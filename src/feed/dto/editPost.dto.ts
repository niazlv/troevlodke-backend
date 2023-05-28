import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class EditPostDto {
    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    postid?: number

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    title?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    text?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    image?: string
}
