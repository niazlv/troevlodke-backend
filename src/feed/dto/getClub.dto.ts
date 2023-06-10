import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt } from 'class-validator'

export class GetClubDto {
    @ApiPropertyOptional({
        default: 0,
    })
    @Type(() => Number)
    @IsInt()
    id: number
}
