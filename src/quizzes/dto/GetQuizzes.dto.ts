import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class GetQuizzesDto {

    @ApiPropertyOptional()
    @Type(() =>  Number)
    @IsInt()
    @IsOptional()
    id?: number;

    @ApiPropertyOptional()
    @Type(() =>  Number)
    @IsInt()
    @IsOptional()
    type?: number;
}