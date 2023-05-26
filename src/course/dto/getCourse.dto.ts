import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt } from 'class-validator'

export class GetCourceDto {
    @ApiProperty({
        description: 'id cource',
        example: 1,
    })
    @Type(() => Number)
    @IsInt()
    id: number
}

// model Cource {
//     id Int @id @default(autoincrement())
//     createdAt DateTime @default(now())

//     description String?
//     title String?

//     active_icon String
//     inactive_icon String

//     stagesid Int[]
//   }
