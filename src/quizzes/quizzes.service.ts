import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common'
import { PassDto, SetQuizzesDto } from './dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma, User } from '@prisma/client'
import { GetQuizzesDto } from './dto/GetQuizzes.dto'
import { UtilService } from 'src/util/util.service'
import { isJSON } from 'class-validator'

@Injectable()
export class QuizzesService {
    constructor(
        private prisma: PrismaService,
        private utilService: UtilService,
    ) {}

    async setQuizzes(body: SetQuizzesDto) {
        const dto_data = {
            data: body.data,
            description: body.description,
            title: body.title,
            type: body.type,
        }

        const data = await this.utilService.cleanData(dto_data)

        if (data['data'] != null) {
            if (!isJSON(JSON.stringify(data.data)))
                throw new BadRequestException('data must be a json string')
        }

        const Quizzes = await this.prisma.quizzes.create({
            data: data,
        })

        if (body.courseid != null) {
            try {
                const course = await this.prisma.cource.update({
                    where: {
                        id: body.courseid,
                    },
                    data: {
                        quizzesid: {
                            push: Quizzes.id,
                        },
                    },
                })
            } catch (e) {}
        }
        return Quizzes
    }

    async getQuizzes(body: GetQuizzesDto) {
        const data = {
            type: body.type,
            id: body.id,
        }
        if (data.id == null) delete data.id
        if (data.type == null) delete data.type
        const Quizzes = await this.prisma.quizzes.findMany({
            where: data,
        })
        return Quizzes
    }

    async getRegisterQuizzes(user: { user: User }) {
        // {"data": [
        //     {
        //         "id":5,
        //         "label":"Живопись",
        //         "value":"Живопись"
        //     }]
        // }

        try {
            const categories: [
                {
                    id: number
                    label: string
                    value: string
                },
            ] = user.user.categories['data']
            const Quizzes = await this.prisma.quizzes.findFirst({
                where: {
                    //id: (process.env.registerQuizzId != null)? Number.parseInt(process.env.registerQuizzId): 0,
                    title: categories[0].value,
                },
            })
            if (Quizzes == null) throw new NotFoundException()
            Quizzes.data = JSON.parse(JSON.stringify(Quizzes.data))
            return Quizzes
        } catch (e) {
            if (e.code === 'P2002') {
                throw new InternalServerErrorException('Error on access to db')
            }
            if (e.code == 404) {
                throw new NotFoundException(e)
            }
            Logger.error('categories not valid!', e)
            throw new InternalServerErrorException(
                'your categories not valid!',
                'contact the administration',
            )
        }

        return null
    }

    async passQuizzes(body: PassDto) {
        try {
            const getQuizzes = await this.prisma.quizzes.findFirst({
                where: {
                    id: body.id,
                },
            })

            const data = getQuizzes.data as unknown as Array<JSON>
            // {
            //     answers:string[],
            //     question:string,
            //     correct_answer:string
            // }

            // body
            // [
            //     {
            //         id: 0,
            //         answer: "bla bla bla"
            //     }
            // ]

            // getQuizzes
            // {
            //     "title": "string"
            //     "data": [
            //         {
            //             "question": "bla bla bla?",
            //             "answers": ["bla","kek", "cheburek"],
            //             "correct_answer": "bla"
            //         },
            //         {...}
            //     ]
            // }
            if (getQuizzes == null)
                throw new NotFoundException("can't find quizzes to check by id")
            // if(data.length != body.user_answers.length) throw new BadRequestException("not enough data")

            var score = 0
            var errors = []
            const maxScore = data.length
            const len =
                data.length <= body.answers.length
                    ? data.length
                    : body.answers.length

            for (var i = 0; i < len; i++) {
                if (data[i]['correct_answer'] == body.answers[i]['answer']) {
                    score += 1
                } else {
                    errors.push(i)
                }
            }
            return {
                score,
                maxScore,
                errors,
            }
        } catch (e) {
            if (e.code == 404) {
                throw new NotFoundException(e)
            }
            Logger.error(e)
            throw new BadRequestException(e)
        }
    }
}
