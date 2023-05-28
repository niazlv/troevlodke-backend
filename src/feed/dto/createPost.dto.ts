import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class CreatePostDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    title?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    text?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    image?: string
}

// model Post {
//     id        Int      @id @default(autoincrement())
//     createdAt DateTime @default(now())

//     title String  @default("")
//     text  String  @default("")
//     image String?

//     authorid Int
//   }
