import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class CreateLessionDto {
    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    stageid: number

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    mimetype?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    url?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    text?: string
}

// model Lession {
//     id        Int      @id @default(autoincrement())
//     createdAt DateTime @default(now())

//     mimetype String?
//     url      String?
//     text     String?
//   }
