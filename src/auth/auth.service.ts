import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ActiveTokenDto, AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from "crypto";
import { ActiveToken } from "@prisma/client";

@Injectable({})
export class AuthService {
    private readonly logger = new Logger(AuthService.name)
    constructor(
        private prisma: PrismaService, 
        private jwt: JwtService,
        private config: ConfigService
        ) {}

    async signup(dto: AuthDto) {
        //generate a hash from password
        const hash = await argon.hash(dto.password);
        //try create a field on database
        try {
            const user = await this.prisma.user.create({
                data: {
                    login: dto.login,
                    hash,
                    permissions: 3,
                    role: 32
                },
            });
            delete user.hash;
            return user
        }
        catch(error) {
            if (error instanceof PrismaClientKnownRequestError) {
                //if field is exist throw error to client
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken')
                }
            }
            this.logger.error("signup: cathing some error with code: "+error.code+" and with message: "+error.message);
            throw error
        }
    }

    async signin(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                login: dto.login,
            },
        });
        if (!user) throw new ForbiddenException('Credentials incorrect');
        
        const pwMatches = await argon.verify(user.hash, dto.password);
        if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
        var tokenName = "auth.service: signToken";
        var tokenPermissions:bigint = 4294967295n;
        if(dto.tokenName) tokenName = dto.tokenName;
        if(dto.tokenPermissions != null) tokenPermissions = dto.tokenPermissions;
        if(!dto.tokenName && dto.tokenPermissions) throw new BadRequestException("tokenPermissions can't be settet without tokenName");
        return this.signToken(user.id,tokenName,tokenPermissions,tokenName == "auth.service: signToken");
    }

    async signToken(userId:number, tokenName:string,tokenPermissions:bigint, isOverride:boolean): Promise<{"access_token":string}>{
        const activeTokens = await this.prisma.activeToken.findMany({
            where:{
                userid:userId
            }
        });
        this.logger.verbose("signToken: userid:"+userId+" activeTokens: ",activeTokens);
        var token:string;
        var _createActiveToken:ActiveToken;

        //если вдруг пользователь не имеет вообще токенов, то
        for(var i = 0; i < activeTokens.length;i++) {
            if(activeTokens[i].description == tokenName) {
                token = activeTokens[i].token;
                _createActiveToken = activeTokens[i];
            }
        }

        //если мы не нашли токен среди существующих, то создалим его сами
        if(!token){
            this.logger.verbose("signToken: active tokens not found on all tokens. Create him");
            _createActiveToken = await this.createActiveToken(userId,tokenName,tokenPermissions);
            token = _createActiveToken.token;
        }
        
        //если вдруг права существующего мастер токена и запрашиваемые отличаются, то
        if(isOverride) {
            _createActiveToken = await this.prisma.activeToken.update({
                where: {
                    id: _createActiveToken.id
                },
                data: {
                    permissions: tokenPermissions
                }
            });
            if(!_createActiveToken) {
                this.logger.error("active token can't be a updated in db");
                throw new InternalServerErrorException()
            }
        }
        else if(_createActiveToken.permissions != tokenPermissions){
            this.logger.verbose("tokenName: "+tokenName);
            this.logger.verbose("tokenPermissions: "+tokenPermissions+" and _createActiveToken.permissions: "+_createActiveToken.permissions);
            throw new BadRequestException("You cannot put new Permissions to an existing token. Please deactivate it or make up a new one. You can also not to use the tokenPermissions field");
        }
        const payload = {
            sub: userId,
            token: token,
            v: 1    //первая версия токена, в ней добавлен мастертокен, это важно!!
        }
        const secret = this.config.get('JWT_SECRET');

        return {
            "access_token":await this.jwt.signAsync(payload, {
                secret:secret,
                }),
        }
    }

    //создание мастер токена
    async createActiveToken(
        userId:number,
        description:string,
        tokenPermissions:bigint
    ):Promise<ActiveTokenDto> {
        const randomdata = createHash('sha256').update(randomBytes(20).toString('hex')).digest('base64url');
            this.logger.verbose("createActiveToken: randomdata: "+randomdata);
            const data = {
                userid:userId,
                token: randomdata,
                description:description,
                permissions:tokenPermissions           //права токена. НЕ ПЕРЕПИСЫВАЮТ ПРАВА ПОЛЬЗОВАТЕЛЯ, НАКЛАДЫВАЮТСЯ МАСКОЙ!!!
            }
            const createActiveToken = await this.prisma.activeToken.create({
                data: data
            });
            if(!createActiveToken){
                this.logger.debug("activeToken not created into DB userid:"+userId);
                this.logger.verbose("data",data);
                throw new InternalServerErrorException("activeToken not created into DB")
            }
        return createActiveToken
    }

}