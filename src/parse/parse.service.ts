import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { Files } from '@prisma/client'
import { length } from 'class-validator'
import { createHash } from 'crypto'
import { Workbook } from 'exceljs'
import { forkJoin } from 'rxjs'
import { PrismaService } from 'src/prisma/prisma.service'
import { GetFullExcelDto, GetSchoolDto } from './dto'
import { UtilService } from 'src/util/util.service'
@Injectable()
export class ParseService {
    constructor(
        private prisma: PrismaService,
        private utilService: UtilService,
    ) {}

    // парсинг был полностью переписан, старая версия до git commit "45ca755"
    async parse_excel_file(file_url: Files /** prisma */) {
        const file = await this.prisma.files.findFirstOrThrow({
            where: {
                id: file_url.id,
            },
        })

        const workbook = new Workbook()
        await workbook.xlsx.load(file.data)

        const worksheet = workbook.worksheets[0]

        const countRow = worksheet.rowCount
        const countCol = worksheet.getRow(1).cellCount
        Logger.error('row ' + countRow + ' col ' + countCol)
        var x = 0
        const data = []
        worksheet.eachRow(function (row, rownum) {
            var temp = []
            for (var i = 1; i <= countCol; i++) {
                const cell = row.getCell(i)
                x = i - 1

                if (cell.value != null) {
                    temp[x] = cell.value

                    // if cell is formula
                    if (temp[x]['result'] != null) {
                        temp[x] = temp[x]['result']
                    }

                    // if cell is formated text
                    if (temp[x]['richText'] != null) {
                        var text = ''
                        for (var k = 0; k < temp[x]['richText'].length; k++) {
                            if (temp[x]['richText']['text'] != null) {
                                text += temp[x]['richText']['text']
                            }
                        }
                        temp[x] = text
                    }
                } else {
                    temp[x] = null
                }
            }
            data.push(temp)
        })

        return data
    }

    async parsed_to_db(data, file: Files) {
        var schoolid = []
        // create schools on db
        for (var i = 1; i < data.length; i++) {
            try {
                const schoolDB = await this.prisma.schoolNew.create({
                    data: {
                        idInFile: String(data[i][0]),
                        name: data[i][1],
                        address: data[i][2],
                        phone: data[i][3],
                        email: data[i][4],
                        coordinates: data[i][6] + ', ' + data[i][5],
                        district: data[i][7],
                    },
                })
                schoolid.push(schoolDB.id)
            } catch (e) {
                Logger.error(e, 'error on create schools')
                throw e
            }
        }

        try {
            // const excelFieldsOfStudy = await this.prisma.excelFieldsOfStudy.upsert({
            //     where: {
            //         originalFileChecksum: file.checksum,
            //     },
            //     create: {
            //         fileid: file.id,
            //         originalFileChecksum: file.checksum,
            //     },
            //     update: {
            //         schoolid: schoolid,
            //         nameYear: nameYear,
            //         nameChunks: nameChunks,
            //         ticketStatus:true
            //     }
            // });
            const excelFieldsOfStudy =
                await this.prisma.excelFieldsOfStudyNew.create({
                    data: {
                        originalFileChecksum: file.checksum,
                        fileid: file.id,
                        schoolid: schoolid,
                        ticketStatus: true,
                    },
                })
            return excelFieldsOfStudy
        } catch (e) {
            Logger.error('error on create excel fieldsofstudy', e)
            throw e
        }
        return ''
    }

    async excel(file: Express.Multer.File) {
        // safe file to db (it is serious needed?)
        var uploadedFile = await this.utilService.saveFile(file)

        // check, maybe we parsed?
        const check = await this.prisma.excelFieldsOfStudyNew.findFirst({
            where: {
                originalFileChecksum: uploadedFile.checksum,
            },
        })
        if (check != null) {
            return {
                upload_file: uploadedFile,
                parsed_file: check,
            }
        }

        // --------------------------------
        // precreate field on db

        // place file to queue

        // return to user precreated field on db(include "ticket")

        // --------------------------------
        // or you can hardcode this(my way)

        //parse excel file
        const parsed_file = await this.parse_excel_file(uploadedFile)

        // place data to db

        const excelFieldsOfStudy = await this.parsed_to_db(
            parsed_file,
            uploadedFile,
        )

        // return to user(????)

        return {
            upload_file: uploadedFile,
            parsed_file: excelFieldsOfStudy,
        }
    }

    async getSchool(data: GetSchoolDto) {
        const dd = {
            id: data.id,
            name: data.name,
        }
        if (dd.id == null) delete dd.id
        if (dd.name == null) delete dd.name
        try {
            const School = await this.prisma.schoolNew.findFirstOrThrow({
                where: data,
            })
            return School
        } catch (e) {
            throw new NotFoundException()
        }
    }

    async getAllExcel() {
        const excels = await this.prisma.excelFieldsOfStudyNew.findMany({})
        return excels
    }

    async fullExcel(dto: GetFullExcelDto) {
        try {
            const excel =
                await this.prisma.excelFieldsOfStudyNew.findFirstOrThrow({
                    where: {
                        id: dto.excelid,
                    },
                })
            excel['schools'] = []
            for (var i = 0; i < excel.schoolid.length; i++) {
                const school = await this.prisma.schoolNew.findFirst({
                    where: {
                        id: excel.schoolid[i],
                    },
                })
                excel['schools'].push(school)
            }

            return excel
        } catch (e) {
            throw new NotFoundException('Excel table not found by this id')
        }
        return ''
    }
}
