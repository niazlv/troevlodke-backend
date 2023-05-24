import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional } from "class-validator";

export class GetQuizzesDto {

    @ApiPropertyOptional()
    @IsInt()
    @IsOptional()
    id?: number;

    @ApiPropertyOptional()
    @IsInt()
    @IsOptional()
    type?: number;
}