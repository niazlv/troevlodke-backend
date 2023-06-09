import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt } from 'class-validator'

export class FriendRequestDto {
    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    userid: number
}
