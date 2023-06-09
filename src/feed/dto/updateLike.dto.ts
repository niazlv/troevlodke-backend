import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsBooleanString, IsInt, IsOptional } from 'class-validator'

export class UpdateLikeDto {
    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    postid: number
    @ApiPropertyOptional({
        default: true,
    })
    @IsBooleanString()
    @IsOptional()
    isLike: boolean

    @ApiPropertyOptional({
        default: false,
    })
    @IsBooleanString()
    @IsOptional()
    isDislike: boolean
}
