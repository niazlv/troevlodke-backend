import { Injectable } from '@nestjs/common';
import { SetQuizzesDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { GetQuizzesDto } from './dto/GetQuizzes.dto';

@Injectable()
export class QuizzesService {

    constructor(
        private prisma: PrismaService,
        ){}


    async setQuizzes(body: SetQuizzesDto) {
        const data = {
            data: JSON.stringify(body.data),
            description: body.description,
            title: body.title,
            type: body.type
        }
        if(data.type == null) delete data.type;
        if(data.description == null) delete data.description;
        if(data.title == null) delete data.title;
        const Quizzes = await this.prisma.quizzes.create({
            data: data
        })
        return Quizzes
    }

    async getQuizzes(body:GetQuizzesDto) {
        const data = {
            type: body.type,
            id: body.id
        }
        if(data.id == null) delete data.id
        if(data.type == null) delete data.type
        const Quizzes = await this.prisma.quizzes.findMany({
            where: data
        });
        return Quizzes;
    }

    async getRegisterQuizzes() {
        const Quizzes = await this.prisma.quizzes.findFirst({
            where:{
                id: (process.env.registerQuizzId != null)? Number.parseInt(process.env.registerQuizzId): 0,
            }
        });
        Quizzes.data = JSON.parse(JSON.stringify(Quizzes.data))
        return Quizzes;
    }
}
