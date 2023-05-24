import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignInDto {
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
}