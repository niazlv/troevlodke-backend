import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsBooleanString, IsInt } from 'class-validator'

export class ReplyFriendRequestDto {
    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    userid: number
    @ApiProperty({
        default: true,
    })
    @IsBooleanString()
    isAccept: boolean
}
