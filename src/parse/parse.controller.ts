import {
    Controller,
    Logger,
    Post,
    UploadedFile,
    UseInterceptors,
    UseGuards,
    Get,
    Query,
    BadRequestException,
} from '@nestjs/common'
import { ParseService } from './parse.service'
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import {
    ApiBearerAuth,
    ApiBody,
    ApiHeader,
    ApiCreatedResponse,
    ApiTags,
    ApiOkResponse,
    ApiQuery,
} from '@nestjs/swagger'
import { PermissionsGuard, JwtGuard } from 'src/auth/guard'
import { Permissions } from 'src/auth/decorator'
import { ReturnDto } from 'src/dto'
import { GetFullExcelDto, GetSchoolDto } from './dto'
import { UtilService } from 'src/util/util.service'

@ApiTags('parse')
@Controller('parse')
export class ParseController {
    constructor(
        private parseService: ParseService,
        private utilService: UtilService,
    ) {}

    @ApiBearerAuth()
    @ApiBody({
        description:
            'requested permits: upload:file. Upload file via form-data',
    })
    @UseGuards(JwtGuard)
    // @Permissions('upload:file') // disabled in the hackathon solution for unnecessary
    @Post('excel')
    @UseInterceptors(FileInterceptor('file'))
    async excel(@UploadedFile() file: Express.Multer.File): Promise<ReturnDto> {
        return {
            statusCode: 201,
            data: await this.parseService.excel(file),
        }
    }

    @Get('allexcel')
    async getAllExcel(): Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.parseService.getAllExcel(),
        }
    }

    @Get('school')
    async getSchool(@Query() data: GetSchoolDto): Promise<ReturnDto> {
        if (data.id == null && data.name == null) {
            throw new BadRequestException('minimum 1 parameter')
        }
        return {
            statusCode: 200,
            data: await this.parseService.getSchool(data),
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
    ): Promise<ReturnDto> {
        return {
            statusCode: 201,
            data: await this.utilService.saveFile(file),
        }
    }

    @Get('fullexcel')
    async fullExcel(@Query() dto: GetFullExcelDto): Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.parseService.fullExcel(dto),
        }
    }
}
