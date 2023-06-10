import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateClubDto {
    @ApiProperty()
    @IsString()
    title: string
}
