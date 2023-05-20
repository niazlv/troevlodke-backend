import { Controller, Logger, Post, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { ParseService } from './parse.service';
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiCreatedResponse, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { PermissionsGuard,JwtGuard } from 'src/auth/guard';
import { Permissions } from 'src/auth/decorator';
import { ReturnDto } from 'src/dto';

@Controller('parse')
export class ParseController {
    constructor(private parseService: ParseService){}

    @ApiBearerAuth()
    @ApiBody({
        description: "requested permits: upload:file",
        type:""
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
}
