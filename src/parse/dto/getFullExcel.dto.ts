import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsIn, IsInt, IsNumber } from 'class-validator'

export class GetFullExcelDto {
    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    excelid: number
}
