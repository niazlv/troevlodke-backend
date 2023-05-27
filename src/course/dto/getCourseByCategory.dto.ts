import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsString } from 'class-validator'

export class GetCoursesByCategoryDto {
    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    categoryid: number
}
