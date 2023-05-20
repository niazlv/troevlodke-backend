import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsJSON, IsOptional, IsString, isJSON } from "class-validator";

export class SetQuizzesDto {

    @ApiProperty({
        description: 'set quizzes json by example: {\
            \"theatr\": \[ \
              \"question":"whats u name?",\
              \"answers\":[\"niyaz\",\"vasia\",\"anya\'"],\
              \"correctAnswer\": 0\
            \],\
            \"guitar\":[...],\
          \}',
          example: {
            "theatr": [{
              "question":"what's u name?",
              "answers":["niyaz","vasia","anya"],
              "correctAnswer": 0
          }]
          }
    })
    @IsString()
    data: JSON;

    @ApiProperty()
    @Type(() =>  Number)
    @IsInt()
    @IsOptional()
    type?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    title?: string;
}