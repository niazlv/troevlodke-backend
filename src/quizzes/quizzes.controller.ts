import { BadRequestException, Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QuizzesService } from './quizzes.service';
import { ReturnDto } from 'src/dto';
import { PassDto, SetQuizzesDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetQuizzesDto } from './dto/GetQuizzes.dto';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';

@ApiTags('quizzes')
@Controller('quizzes')
export class QuizzesController {

    constructor(
        private quizzesService:QuizzesService,
    ){}

    @ApiBearerAuth()
    @ApiBody({
        description: "create a quizze and safe him on DB",
        type:SetQuizzesDto
    })
    @UseGuards(JwtGuard)
    @Post("quizzes")
    async setQuizzes(@Body() body:SetQuizzesDto):Promise<ReturnDto> {
        return {
            statusCode: 201,
            data: await this.quizzesService.setQuizzes(body)
        }
    }

    @ApiResponse({
        description: "return quizze by id or type"
    })
    // @UseGuards(JwtGuard)
    @Get("quizzes")
    async getQuizzes(@Query() body:GetQuizzesDto):Promise<ReturnDto> {
        if(body.id == null && body.type == null) throw new BadRequestException("must be more than 0 param")
        return {
            statusCode: 200,
            data: await this.quizzesService.getQuizzes(body)
        }
    }

    @ApiBearerAuth()
    @ApiResponse({
        description:"return registration quizzes(test)"
    })
    @UseGuards(JwtGuard)
    @Get("register")
    async getRegisterQuizzes(@Req() user:{user:User}):Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.quizzesService.getRegisterQuizzes(user)
        }
    }

    @ApiBearerAuth()
    @ApiResponse({
        description: "pass your answers to check him",
        schema: {
            example: {
                "statusCode": 201,
                "data": {
                  "score": 1,
                  "maxScore": 6,
                  "errors": []
                }
              }
        }
    })
    @UseGuards(JwtGuard)
    @Post("pass")
    async passQuizzes(@Body() body:PassDto):Promise<ReturnDto> {
        return {
            statusCode: 201,
            data: await this.quizzesService.passQuizzes(body)
        }
    }

    @ApiResponse({
        description:"return categories",
    })
    // @UseGuards(JwtGuard)
    @Get("categories")
    getCategories(): ReturnDto {
        const categories = ["Театр",  "Фортепиано", "Гитара", "Ударные инструменты", "ИЗО", "Живопись", "Хоровое пение", "Хореография", "Скрипка", "Дизайн", "Цирковое искусство", "Вокал"]
        return {
            statusCode:200,
            data: categories
        }
    }
}
