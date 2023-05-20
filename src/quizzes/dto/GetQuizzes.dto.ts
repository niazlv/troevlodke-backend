import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional } from "class-validator";

export class GetQuizzesDto {

    @ApiProperty()
    @IsInt()
    @IsOptional()
    id?: number;

    @ApiProperty()
    @IsInt()
    @IsOptional()
    type?: number;
}