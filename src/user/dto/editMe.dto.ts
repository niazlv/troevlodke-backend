import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsObject, IsOptional, IsString } from 'class-validator'

export class EditMeDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    firstname?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    lastname?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    middlename?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    birthday?: Date

    @ApiPropertyOptional()
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    age?: number

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    city?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    country?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    email?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    photo?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    score?: string

    @ApiPropertyOptional({
        example: {
            data: [
                {
                    id: 5,
                    label: 'Живопись',
                    value: 'Живопись',
                },
            ],
        },
        description: 'Направления из шага 3(5 скрин в фигме)',
    })
    @IsObject()
    @IsOptional()
    categories?: JSON
}

// model User {
//     id          Int      @id @default(autoincrement())
//     createdAt   DateTime @default(now())
//     updatedAt   DateTime @updatedAt
//     role        Int      @default(3)
//     permissions BigInt   @default(2)
//     other       Json     @default("{}")
//     isActive    Boolean  @default(true)

//     firstname  String? //name
//     lastname   String? //lastname
//     middlename String? //middle name
//     birthday   DateTime? //birthday
//     age        Int?

//     city    String @default("Moscow")
//     country String @default("Russia")

//     login String  @unique //login
//     hash  String //pswd
//     email String? //email

//     parentid Int[] @default([0]) //parentids

//     score     Int    @default(0) //rating score
//     courcesid Int[]  @default([]) // cources id's
//     progress  Json   @default("{}") // ???
//     friendsid Int[]  @default([]) // friends
//     interests String @default("")

//     tests Int[] @default([])

//     rating Float   @default(5) //rating 0.0-5.0
//     social Json    @default("{}") //{'vk':"vk.com/durov", ...}
//     photo  String? //url to photografy

//     categories Json? @default("{}")

//     @@map("users")
//   }
