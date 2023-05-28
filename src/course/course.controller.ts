import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Logger,
    NotFoundException,
    Post,
    Put,
    Query,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtGuard } from 'src/auth/guard'
import { ReturnDto } from 'src/dto'
import { CourseService } from './course.service'
import {
    CreateCourseDto,
    CreateLessionDto,
    CreateStageDto,
    GetCourceDto,
    GetCoursesByCategoryDto,
    GetStageDto,
    SaveProgressDto,
    UploadFileDto,
} from './dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { ParseService } from 'src/parse/parse.service'
import { NotFoundError } from 'rxjs'
import { User } from '@prisma/client'

@ApiTags('The Courses')
@Controller('course')
export class CourseController {
    constructor(private courseService: CourseService) {}

    //@ApiQuery({})
    //@UseGuards(JwtGuard)
    @Get('course')
    async getCourse(@Query() dto: GetCourceDto): Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.courseService.getCourse(dto),
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Post('course')
    async createCourse(@Body() dto: CreateCourseDto): Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.courseService.createCourse(dto),
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Post('stage')
    async createStage(@Body() dto: CreateStageDto): Promise<ReturnDto> {
        return {
            statusCode: 201,
            data: await this.courseService.createStage(dto),
        }
    }

    @Get('stage')
    async getStage(@Query() dto: GetStageDto): Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.courseService.getStage(dto),
        }
    }

    @ApiBearerAuth()
    @ApiResponse({
        description:
            'you can upload file as using form-data. File:file, stageid:number',
    })
    @UseGuards(JwtGuard)
    @Post('upload_file')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: UploadFileDto,
    ): Promise<ReturnDto> {
        if (file == null)
            throw new BadRequestException("file parameter can't be null")
        return {
            statusCode: 201,
            data: await this.courseService.saveFile(file, body),
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Post('lession')
    async createLession(@Body() dto: CreateLessionDto): Promise<ReturnDto> {
        return {
            statusCode: 201,
            data: await this.courseService.createLession(dto),
        }
    }

    @Get('coursesBy')
    async getCoursesByCategory(
        @Query() dto: GetCoursesByCategoryDto,
    ): Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.courseService.getCourcesByCategory(dto),
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Put('saveprogress')
    async saveProgress(
        @Body() dto: SaveProgressDto,
        @Req() user: { user: User },
    ): Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.courseService.saveProgress(dto, user),
        }
    }
}
