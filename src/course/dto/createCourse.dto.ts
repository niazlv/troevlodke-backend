import { ApiPropertyOptional } from '@nestjs/swagger'
import {
    IsOptional,
    IsString,
} from 'class-validator'

export class CreateCourseDto {
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
    active_icon?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    inactive_icon?: string
}

// model Cource {
//     id        Int      @id @default(autoincrement())
//     createdAt DateTime @default(now())

//     description String?
//     title       String?

//     active_icon   String
//     inactive_icon String

//     stagesid Int[]
//   }
