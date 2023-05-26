import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
    IsInt,
    IsOptional,
    IsString,
} from 'class-validator'

export class CreateStageDto {
    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    courceid: number

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    title?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    type?: string
}

// model Stage {
//     id        Int      @id @default(autoincrement())
//     createdAt DateTime @default(now())

//     description String?
//     title       String?

//     type Int @default(0)

//     fileid Int[] @default([])

//     commentsid Int[] @default([])
//     likes      Int   @default(0)
//     dislikes   Int   @default(0)
//   }
