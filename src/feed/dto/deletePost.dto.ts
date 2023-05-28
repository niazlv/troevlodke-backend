import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt } from 'class-validator'

export class DeletePostDto {
    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    postid: number
}
