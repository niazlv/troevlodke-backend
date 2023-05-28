import { ApiProperty } from '@nestjs/swagger'
import { IsObject } from 'class-validator'

export class SaveProgressDto {
    @ApiProperty()
    @IsObject()
    progress: JSON
}
