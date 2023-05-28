import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { BearerTokenDto } from '../dto'
import { scrypt } from 'crypto'
import { UtilService } from 'src/util/util.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name)
    constructor(
        config: ConfigService,
        private prisma: PrismaService,
        private utilService: UtilService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        })
    }

    async validate(payload: BearerTokenDto) {
        var user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        })
        // const group = await this.prisma.group.findUnique({
        //     where: {
        //         id: user.groupid
        //     }
        // })
        // const camp = await this.prisma.camp.findUnique({
        //     where: {
        //         id: user.campid
        //     }
        // })
        // user['camp'] = camp
        // user['group'] = group
        if (payload.v === 1) {
            try {
                const activeToken =
                    await this.prisma.activeToken.findUniqueOrThrow({
                        where: {
                            token: payload.token,
                        },
                    })
                //важный костыль. Фиксить и убирать сначала в Permissions.guard.ts ИНАЧЕ НЕ ТРОГАТЬ НИ В КОЕМ СЛУЧАЕ!!!. Отвалятся сразу права разрешения
                user['ActiveToken'] = activeToken
            } catch (error) {
                this.logger.verbose(error + ' sub: ' + payload.sub)
                throw new UnauthorizedException('your token is invalid!')
            }
        } else if (payload.v === 2) {
            try {
                const activeToken =
                    await this.prisma.activeToken.findUniqueOrThrow({
                        where: {
                            token: payload.token,
                        },
                    })
                // ключ от расшифровки данных!!!
                const key =
                    activeToken.secure_token_part_private +
                    payload.secure_token_part_public
                //важный костыль. Фиксить и убирать сначала в Permissions.guard.ts ИНАЧЕ НЕ ТРОГАТЬ НИ В КОЕМ СЛУЧАЕ!!!. Отвалятся сразу права разрешения
                user['ActiveToken'] = activeToken
                user['ActiveToken']['key'] = key

                user = await this.utilService.decryptUser(user, key)
                //user.firstname = this.utilService.decryptByKey(user.firstname,key).decrypted
            } catch (error) {
                this.logger.verbose(error + ' sub: ' + payload.sub)
                throw new UnauthorizedException('your token is invalid!')
            }
        } else return

        delete user.hash
        delete user.paircatchphrases
        delete user.catchphrases
        return user
    }
}
