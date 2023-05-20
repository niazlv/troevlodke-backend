import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsInt, IsOptional, IsString } from "class-validator"

export class GetSchoolDto {

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    name?: string
    
    @ApiPropertyOptional()
    @Type(() =>  Number)
    @IsInt()
    @IsOptional()
    id?: number
}