import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'

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
    requirements?: string

    @ApiPropertyOptional()
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    dificulty?: number

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    difficultylabel?: string

    @ApiPropertyOptional({
        description:
            'Hardset category setting by id. Specify either categoryid or categorylabel. The other field will be set automatically',
        example: 2,
    })
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    categoryid?: number

    @ApiPropertyOptional({
        description:
            'name of category. Specify either categoryid or categorylabel. The other field will be set automatically',
        example: 'Гитара',
    })
    @IsString()
    @IsOptional()
    categorylabel?: string

    @ApiPropertyOptional({
        example: 'image/svg+xml',
        default: 'image/svg+xml',
    })
    @IsString()
    @IsOptional()
    mime_type_icons?: string

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
