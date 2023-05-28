import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt } from 'class-validator'

export class GetPostDto {
    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    postid: number
}
