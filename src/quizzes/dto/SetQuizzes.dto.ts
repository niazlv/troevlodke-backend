import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
    IsInt,
    IsJSON,
    IsObject,
    IsOptional,
    IsString,
    isJSON,
} from 'class-validator'

export class SetQuizzesDto {
    @ApiProperty({
        description:
            'set quizzes json by example: {\
            "theatr": [ \
              "question":"whats u name?",\
              "answers":["niyaz","vasia","anya\'"],\
              "correctAnswer": 0\
            ],\
            "guitar":[...],\
          }',
        example: {
            theatr: [
                {
                    question: "what's u name?",
                    answers: ['niyaz', 'vasia', 'anya'],
                    correctAnswer: 0,
                },
            ],
        },
    })
    @IsObject()
    data: JSON

    @ApiPropertyOptional()
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    type?: number

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    title?: string

    @ApiPropertyOptional({
        description: 'used to set automatly to course',
    })
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    courseid?: number
}
