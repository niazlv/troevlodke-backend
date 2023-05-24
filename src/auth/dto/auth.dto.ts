import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDateString, IsInt, IsJSON, IsNotEmpty, IsNumber, IsNumberString, IsObject, IsOptional, IsString } from 'class-validator';
import { json } from 'express';
import { stringify } from 'querystring';
import { isStringObject } from 'util/types';

export class AuthDto {
    @ApiProperty({ 
        description: "Login",
        example:"petya123",
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    login: string;

    @ApiProperty({ 
        description: "Password",
        example:"12345678",
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiPropertyOptional({
        description: "token name. Used to indificate him and get this",
        example: "for mywebsite.com",
        default: "auth.service: signToken",
    })
    @IsString()
    @IsOptional()
    tokenName?: string;

    @ApiPropertyOptional({
        description: "token permissions. Restriction of token permissions. Used to issue token to untrustworthy sources. by default 2^32-1",
        example:"3",
        default: "4294967295",
        type: typeof 1
    })
    @Type(() =>  Number)
    @IsInt()
    @IsOptional()
    tokenPermissions?: bigint;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    lastname?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    firstname?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    middlename?: string;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    birthday?: Date;

    @ApiPropertyOptional()
    @Type(() =>  Number)
    @IsInt()
    @IsOptional()
    age?: number;

    @ApiPropertyOptional({
        default: 4,
        description: "1 - admin, 2 - parent, 4 - user"
    })
    @Type(() =>  Number)
    @IsInt()
    @IsOptional()
    role?: number;

    @ApiPropertyOptional({
        default: "Moscow"
    })
    @IsString()
    @IsOptional()
    city?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    country?: string;

    @ApiPropertyOptional({
        example: {
            data: [0,1,2,4,6,7]
        },
        description: "Направления из шага 3(5 скрин в фигме)"
    })
    @IsObject()
    @IsOptional()
    categories?: JSON;
}