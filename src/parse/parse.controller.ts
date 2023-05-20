import { Controller, Logger, Post, UploadedFile, UseInterceptors, UseGuards, Get, Query, BadRequestException } from '@nestjs/common';
import { ParseService } from './parse.service';
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiCreatedResponse, ApiTags, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { PermissionsGuard,JwtGuard } from 'src/auth/guard';
import { Permissions } from 'src/auth/decorator';
import { ReturnDto } from 'src/dto';
import { GetSchoolDto } from './dto';

@ApiTags("parse")
@Controller('parse')
export class ParseController {
    constructor(private parseService: ParseService){}

    @ApiBearerAuth()
    @ApiBody({
        description: "requested permits: upload:file",
        type:"file"
    })
    @UseGuards(JwtGuard,PermissionsGuard)
    @Permissions("upload:file")
    @Post("excel")
    @UseInterceptors(FileInterceptor('file'))
    async excel(@UploadedFile() file: Express.Multer.File): Promise<ReturnDto> {
        return {
            statusCode:201,
            data: await this.parseService.excel(file)
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Get("school")
    async getSchool(@Query() data:GetSchoolDto): Promise<ReturnDto>{
        if(data.id == null && data.name == null) {
            throw new BadRequestException("minimum 1 parameter")
        }
        return {
            statusCode:200,
            data: await this.parseService.getSchool(data)
        }
    }
}
