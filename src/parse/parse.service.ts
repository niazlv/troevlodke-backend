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

        // Мега костыль. Пожалуйста, пропустите мимо глаз >_<
        // Пожалейте себя и свои нервы
        var data = {
            header: [],
            body: [],
        }
        var x = 0
        var headery = 0
        var bodyy = 0
        var isHeader = true
        var isNumSymbolFinded = false
        var numSymbolPos = 1
        worksheet.eachRow(function (row, rownum) {
            if (isHeader) {
                data.header[headery] = []
            } else {
                data.body[bodyy] = []
            }
            var temp = []
            for (var i = 1; i <= countCol; i++) {
                const cell = row.getCell(i)
                x = i - 1

                if (cell.value != null) {
                    temp[x] = cell.value

                    // check header ends
                    if (isHeader) {
                        if (!isNumSymbolFinded) {
                            if (typeof temp[x] === 'string') {
                                if (temp[x].at(0) == '№') {
                                    isNumSymbolFinded = true
                                    numSymbolPos = x
                                }
                            }
                        } else {
                            if (typeof temp[x] === 'number') {
                                if (temp[numSymbolPos] >= 0) {
                                    isHeader = false
                                }
                            }
                        }
                    }

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
            //write on header or on data
            if (isHeader) {
                data.header[headery] = temp
                headery += 1
            } else {
                data.body[bodyy] = temp
                bodyy += 1
            }
        })

        var dict = [
            {
                name: data.body[0][2],
                chunks: [[]],
                years: [],
                coordinates: [],
            },
        ]
        var j = 0
        for (var i = 0; i < data.body.length; i++) {
            //remove nulls from start
            data.body[i].shift()

            if (dict[dict.length - 1]['name'] != data.body[i][1]) {
                dict.push({
                    name: data.body[i][1],
                    chunks: [],
                    years: [],
                    coordinates: [],
                })
                j = 0
            }
            dict[dict.length - 1]['chunks'][j] = []
            for (var k = 2; k < data.body[i].length - 3; k += 2) {
                dict[dict.length - 1]['chunks'][j][k / 2 - 1] = [
                    data.body[i][k],
                    data.body[i][k + 1],
                ]
            }
            dict[dict.length - 1]['years'].push(
                data.body[i][data.body[i].length - 2] != null
                    ? data.body[i][data.body[i].length - 2]
                    : '',
            )
            dict[dict.length - 1]['coordinates'].push(
                data.body[i][data.body[i].length - 1] != null
                    ? data.body[i][data.body[i].length - 1]
                    : '',
            )

            j += 1
        }
        data.body = dict

        for (var i = 0; i < data.header.length; i++) {
            //remove nulls from start
            data.header[i].shift()
        }

        return data
    }

    async parsed_to_db(
        data: {
            header: any[]
            body: any[]
        },
        file: Files,
    ) {
        var schoolid = []

        // create schools on db
        for (var i = 0; i < data.body.length; i++) {
            try {
                const schoolDB = await this.prisma.school.create({
                    data: {
                        name: data.body[i].name,
                        chunks: {
                            data: data.body[i].chunks,
                        },
                        years: data.body[i].years,
                        coordinates: data.body[i].coordinates,
                    },
                })
                schoolid.push(schoolDB.id)
            } catch (e) {
                Logger.error('error on create schools', e)
                throw e
            }
        }
        var nameYear = ''
        var nameChunks = []
        try {
            nameYear =
                data.header[data.header.length - 2][
                    data.header[data.header.length - 2].length - 1
                ]
            nameChunks = data.header[data.header.length - 2]
            delete nameChunks[nameChunks.length - 1]
            delete nameChunks[nameChunks.length - 1]
        } catch (e) {
            Logger.error('error on create nameYear and nameChanks', e)
            throw e
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
                await this.prisma.excelFieldsOfStudy.create({
                    data: {
                        originalFileChecksum: file.checksum,
                        fileid: file.id,
                        schoolid: schoolid,
                        nameChunks: nameChunks,
                        ticketStatus: true,
                    },
                })
            return excelFieldsOfStudy
        } catch (e) {
            Logger.error('error on create excel fieldsofstudy', e)
            throw e
        }

        return
    }

    async excel(file: Express.Multer.File) {
        // safe file to db (it is serious needed?)
        var uploadedFile = await this.utilService.saveFile(file)

        // check, maybe we parsed?
        const check = await this.prisma.excelFieldsOfStudy.findFirst({
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
            const School = await this.prisma.school.findFirstOrThrow({
                where: data,
            })
            return School
        } catch (e) {
            throw new NotFoundException()
        }
    }

    async getAllExcel() {
        const excels = await this.prisma.excelFieldsOfStudy.findMany({})
        return excels
    }

    async fullExcel(dto: GetFullExcelDto) {
        try {
            const excel = await this.prisma.excelFieldsOfStudy.findFirstOrThrow(
                {
                    where: {
                        id: dto.excelid,
                    },
                },
            )
            excel['schools'] = []
            for (var i = 0; i < excel.schoolid.length; i++) {
                const school = await this.prisma.school.findFirst({
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
