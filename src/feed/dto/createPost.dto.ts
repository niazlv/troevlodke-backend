import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
    IsArray,
    IsDateString,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator'

export class CreatePostDto {
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

    @ApiPropertyOptional({
        isArray: true,
        example: [
            {
                // id: 0,
                answer: 'Графика',
            },
        ],
    })
    // @Type(() => Array<String>)
    @IsArray()
    @IsOptional()
    badge?: Array<String>

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    type?: string

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    datebegin?: Date

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    dateend?: Date

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    address?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    money?: string

    @ApiPropertyOptional({
        default: 0,
    })
    @Type(() => Number)
    @IsInt()
    clubid?: number
}

// model Post {
//     id        Int      @id @default(autoincrement())
//     createdAt DateTime @default(now())

//     title String  @default("")
//     text  String  @default("")
//     image String?

//     authorid Int
//   }
