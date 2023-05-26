import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, IsInt, IsJSON, IsString } from "class-validator"

export class PassDto {
    @ApiProperty({
        example: 1
    })
    @Type(() =>  Number)
    @IsInt()
    id: number;

    @ApiProperty({ 
        isArray: true, 
        example: [
            {
                // id: 0,
                answer: "Графика"
            }
        ] 
    })
    @IsArray()
    //@IsJSON({ each: true, message: "Each item should be JSON" })
    answers: Array<JSON>;
}