import { BadRequestException, Injectable } from '@nestjs/common';
import { SetQuizzesDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { GetQuizzesDto } from './dto/GetQuizzes.dto';
import { UtilService } from 'src/util/util.service';
import { isJSON } from 'class-validator';

@Injectable()
export class QuizzesService {

    constructor(
        private prisma: PrismaService,
        private utilService: UtilService
        ){}


    async setQuizzes(body: SetQuizzesDto) {
        const dto_data = {
            data: body.data,
            description: body.description,
            title: body.title,
            type: body.type
        }

        const data = await this.utilService.cleanData(dto_data);

        if(data['data'] != null) {
            if(!isJSON(JSON.stringify(data.data))) throw new BadRequestException("data must be a json string");
        }
        
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
