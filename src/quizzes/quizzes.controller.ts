import { BadRequestException, Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QuizzesService } from './quizzes.service';
import { ReturnDto } from 'src/dto';
import { SetQuizzesDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetQuizzesDto } from './dto/GetQuizzes.dto';
import { JwtGuard } from 'src/auth/guard';

@ApiTags('quizzes')
@Controller('quizzes')
export class QuizzesController {

    constructor(
        private quizzesService:QuizzesService,
    ){}

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

    @ApiQuery({
        description: "return quizze by id or type"
    })
    @UseGuards(JwtGuard)
    @Get("quizzes")
    async getQuizzes(@Query() body:GetQuizzesDto):Promise<ReturnDto> {
        if(body.id == null && body.type == null) throw new BadRequestException("must be more than 0 param")
        return {
            statusCode: 200,
            data: await this.quizzesService.getQuizzes(body)
        }
    }

    @ApiQuery({
        description:"return registration quizzes(test)"
    })
    @UseGuards(JwtGuard)
    @Get("register")
    async getRegisterQuizzes():Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.quizzesService.getRegisterQuizzes()
        }
    }

    @ApiResponse({
        description:"return categories"
    })
    @UseGuards(JwtGuard)
    @Get("categories")
    getCategories(): ReturnDto {
        const categories = ["Театр",  "Фортепиано", "Гитара", "Ударные инструменты", "ИЗО", "Живопись", "Хоровое пение", "Хореография", "Скрипка", "Дизайн", "Цирковое искусство", "Вокал"]
        return {
            statusCode:200,
            data: categories
        }
    }
}
