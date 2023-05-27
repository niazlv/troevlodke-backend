import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common'
import {
    CreateCourseDto,
    CreateStageDto,
    GetCourceDto,
    GetCoursesByCategoryDto,
    GetStageDto,
    UploadFileDto,
} from './dto'
import { UtilService } from 'src/util/util.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { ParseService } from 'src/parse/parse.service'

@Injectable()
export class CourseService {
    constructor(
        private utilService: UtilService,
        private prismaService: PrismaService,
    ) {}

    async getCourse(dto: GetCourceDto) {
        try {
            // find course
            const course = await this.prismaService.cource.findFirstOrThrow({
                where: {
                    id: dto.id,
                },
            })
            course['stages'] = []
            for (var i = 0; i < course.stagesid.length; i++) {
                const stage = await this.getStage({
                    id: course.stagesid[i],
                } as GetStageDto)
                course['stages'].push(stage)
            }
            return course
        } catch (e) {
            if (e.code == 404) {
                throw new NotFoundException(e)
            }
            Logger.error(e)
            throw new InternalServerErrorException()
        }
    }

    async createCourse(dto: CreateCourseDto) {
        const categories = [
            'Театр',
            'Фортепиано',
            'Гитара',
            'Ударные инструменты',
            'ИЗО',
            'Живопись',
            'Хоровое пение',
            'Хореография',
            'Скрипка',
            'Дизайн',
            'Цирковое искусство',
            'Вокал',
        ]
        // delete null values
        const data = await this.utilService.cleanData(dto)
        if (data == null) {
            throw new BadRequestException("body can't be null")
        }
        if (data['categoryid'] == null && data['categorylabel'] == null) {
            throw new BadRequestException(
                "field categoryid and categorylabel can't both be empty",
            )
        }

        if (data['categoryid'] != null && data['categorylabel'] == null) {
            if (categories.length < data['categoryid'])
                throw new BadRequestException(
                    "categoryid can't be bigger than " +
                        categories.length.toString(),
                )
            data['categorylabel'] = categories[data['categoryid']]
        } else if (
            data['categorylabel'] != null &&
            data['categoryid'] == null
        ) {
            const id = categories.indexOf(data['categorylabel'])
            if (id == -1)
                throw new BadRequestException(
                    'categorylabel not found on categories',
                )
            data['categoryid'] = id
        } else if (
            data['categoryid'] != null &&
            data['categorylabel'] != null
        ) {
            if (categories[data['categoryid']] != data['categorylabel'])
                throw new BadRequestException(
                    'categoryid and categorylabel are different values(the category does not match its id)',
                )
        }

        try {
            // create on db
            const cource = await this.prismaService.cource.create({
                data: data,
            })
            return cource
        } catch (e) {
            Logger.error("can't create cource on db", e)
            throw new InternalServerErrorException()
        }
    }

    async createStage(dto: CreateStageDto) {
        // delete null values
        const data = await this.utilService.cleanData(dto)
        if (data == null) {
            throw new BadRequestException("body can't be null")
        }
        const courseid = data.courceid
        delete data.courceid

        try {
            // find course
            const cource = await this.prismaService.cource.findFirstOrThrow({
                where: { id: courseid },
            })

            // stage on db
            const stage = await this.prismaService.stage.create({
                data: data,
            })

            // update stages id on course
            cource.stagesid.push(stage.id)
            const updated_cource = await this.prismaService.cource.update({
                where: {
                    id: courseid,
                },
                data: {
                    stagesid: cource.stagesid,
                },
            })
            if (updated_cource == null)
                throw new InternalServerErrorException(
                    "cource not found or can't be updated",
                )
            return stage
        } catch (e) {
            if (e.code == 404) {
                throw new NotFoundException(
                    "course not found. Can't create him stage",
                )
            }
            Logger.error("can't create stage on db", e)
            throw new InternalServerErrorException()
        }
    }

    async getStage(dto: GetStageDto) {
        try {
            const stage = await this.prismaService.stage.findFirstOrThrow({
                where: {
                    id: dto.id,
                },
            })
            stage['files'] = []
            for (var i = 0; i < stage.fileid.length; i++) {
                const file = await this.prismaService.files.findFirst({
                    where: {
                        id: stage.fileid[i],
                    },
                })
                stage['files'].push(file)
            }
            return stage
        } catch (e) {
            if (e.code == 404) {
                throw new NotFoundException(e)
            }

            Logger.error("can't get stage", e)
            throw new InternalServerErrorException()
        }
    }

    async saveFile(file: Express.Multer.File, dto: UploadFileDto) {
        try {
            // try find stage
            const stage = await this.prismaService.stage.findFirstOrThrow({
                where: {
                    id: dto.stageid,
                },
            })
            // safe file
            const savedFile = await this.utilService.saveFile(file)

            // update stage
            stage.fileid.push(savedFile.id)

            const updated_stage = await this.prismaService.stage.update({
                where: {
                    id: dto.stageid,
                },
                data: {
                    fileid: stage.fileid,
                },
            })
            return savedFile
        } catch (e) {
            if (e.code == 404) {
                throw new NotFoundException(e)
            }
            Logger.error(e)
            throw new InternalServerErrorException()
        }
    }

    async getCourcesByCategory(dto: GetCoursesByCategoryDto) {
        try {
            const course = await this.prismaService.cource.findMany({
                where: {
                    categoryid: dto.categoryid,
                },
            })
            return course
        } catch (e) {
            Logger.error(e)
            throw new InternalServerErrorException()
        }
    }
}
