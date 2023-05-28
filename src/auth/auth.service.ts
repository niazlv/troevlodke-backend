import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ActiveTokenDto, AuthDto, SignInDto } from './dto'
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import {
    createCipheriv,
    createHash,
    generateKeyPair,
    randomBytes,
    randomFill,
    scrypt,
} from 'crypto'
import { ActiveToken } from '@prisma/client'
import { UtilService } from 'src/util/util.service'
import { IsJSON, isJSON } from 'class-validator'

@Injectable({})
export class AuthService {
    private readonly logger = new Logger(AuthService.name)
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
        private utilService: UtilService,
    ) {}

    async signup(dto: AuthDto) {
        // check all fields from DTO

        const dto_data = {
            birthday: dto.birthday,
            categories: dto.categories,
            city: dto.city,
            country: dto.country,
            firstname: dto.firstname,
            lastname: dto.lastname,
            middlename: dto.middlename,
            role: dto.role,
            login: dto.login,
            age: dto.age,
        }

        var catchphrases = [
            dto.catchphrase1,
            dto.catchphrase2,
            dto.catchphrase3,
        ]

        const data = await this.utilService.cleanData(dto_data)
        catchphrases = await this.utilService.cleanData(catchphrases)

        if (data['categories'] != null) {
            if (!isJSON(JSON.stringify(data.categories)))
                throw new BadRequestException(
                    'categories must be a json string',
                )
        }
        //generate a hash from password
        const hash = await argon.hash(dto.password)

        data['hash'] = hash

        if (data['role'] == null) data['role'] = 4
        if (data['permissions'] == null) data['permissions'] = 3

        //try create a field on database
        try {
            var user = await this.prisma.user.create({
                data: data,
            })
            delete user.hash

            var tokenName = 'auth.service: signToken'
            var tokenPermissions: bigint = 4294967295n
            if (dto.tokenName) tokenName = dto.tokenName
            if (dto.tokenPermissions != null)
                tokenPermissions = dto.tokenPermissions
            const iv = this.utilService.iv_generator()
            if (iv == null) {
                this.logger.error("can't generate IV")
                throw new InternalServerErrorException("can't generate IV")
            }
            try {
                const IV_storage = await this.prisma.iv_storage.create({
                    data: {
                        userid: user.id,
                        iv: iv,
                    },
                })
            } catch (e) {
                this.logger.error("can't upload generated IV into db", e)
                throw new InternalServerErrorException()
            }
            // data encryption
            const enc_data = this.utilService.encrypt(
                'init',
                dto.password,
                'salt',
                iv,
            )
            // crypt password by catchphrases
            const paircatchphrases = []
            for (var i = 0; i < catchphrases.length; i++) {
                paircatchphrases.push(
                    this.utilService.encrypt(
                        enc_data.key,
                        catchphrases[i],
                        'salt',
                        iv,
                    ).encrypted,
                )
            }

            // crypt catchphrases by password
            const newcatchphrases = []
            for (var i = 0; i < catchphrases.length; i++) {
                newcatchphrases.push(
                    this.utilService.encrypt(
                        catchphrases[i],
                        dto.password,
                        'salt',
                        iv,
                    ).encrypted,
                )
            }

            // personal data encryption
            user.firstname = this.utilService.encryptByKey(
                user.firstname,
                enc_data.key,
                iv,
            ).encrypted
            user.lastname = this.utilService.encryptByKey(
                user.lastname,
                enc_data.key,
                iv,
            ).encrypted
            user.middlename = this.utilService.encryptByKey(
                user.middlename,
                enc_data.key,
                iv,
            ).encrypted

            user = await this.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    middlename: user.middlename,
                    paircatchphrases: paircatchphrases,
                    catchphrases: newcatchphrases,
                },
            })

            const keys = await this.prisma.keys.create({
                data: {
                    userid: user.id,
                    isHidden: true,
                    key: '',
                },
            })
            delete user.hash
            delete user.paircatchphrases
            delete user.catchphrases

            user['access_token'] = await this.signToken(
                user.id,
                tokenName,
                tokenPermissions,
                tokenName == 'auth.service: signToken',
                enc_data,
            )
            return user
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ForbiddenException('Credentials taken')
            }
            this.logger.error(
                'signup: cathing some error with code: ' +
                    error.code +
                    ' and with message: ' +
                    error.message,
            )
            throw error
        }
    }

    async signin(dto: SignInDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                login: dto.login,
            },
        })
        if (!user) throw new ForbiddenException('Credentials incorrect')

        const pwMatches = await argon.verify(user.hash, dto.password)
        if (!pwMatches) throw new ForbiddenException('Credentials incorrect')
        var tokenName = 'auth.service: signToken'
        var tokenPermissions: bigint = 4294967295n
        if (dto.tokenName) tokenName = dto.tokenName
        if (dto.tokenPermissions != null)
            tokenPermissions = dto.tokenPermissions
        if (!dto.tokenName && dto.tokenPermissions)
            throw new BadRequestException(
                "tokenPermissions can't be settet without tokenName",
            )
        var iv = ''
        try {
            const IV_storage = await this.prisma.iv_storage.findFirstOrThrow({
                where: {
                    userid: user.id,
                },
            })
            iv = IV_storage.iv
        } catch (e) {
            this.logger.error("can't find IV into db", e)
            throw new InternalServerErrorException()
        }

        const enc_data = this.utilService.encrypt(
            'init',
            dto.password,
            'salt',
            iv,
        )

        return {
            access_token: await this.signToken(
                user.id,
                tokenName,
                tokenPermissions,
                tokenName == 'auth.service: signToken',
                enc_data,
            ),
        }
    }

    async signToken(
        userId: number,
        tokenName: string,
        tokenPermissions: bigint,
        isOverride: boolean,
        enc_data: {
            encrypted: string
            key: string
        },
    ): Promise<string> {
        const activeTokens = await this.prisma.activeToken.findMany({
            where: {
                userid: userId,
            },
        })
        this.logger.verbose(
            'signToken: userid:' + userId + ' activeTokens: ',
            activeTokens,
        )
        var token: string
        var _createActiveToken: ActiveToken

        //если вдруг пользователь не имеет вообще токенов, то
        for (var i = 0; i < activeTokens.length; i++) {
            if (activeTokens[i].description == tokenName) {
                token = activeTokens[i].token
                _createActiveToken = activeTokens[i]
            }
        }

        const keys = this.utilService.splitString(enc_data.key)

        //если мы не нашли токен среди существующих, то создалим его сами
        if (!token) {
            this.logger.verbose(
                'signToken: active tokens not found on all tokens. Create him',
            )
            _createActiveToken = await this.createActiveToken(
                userId,
                tokenName,
                tokenPermissions,
                keys[0],
            )
            token = _createActiveToken.token
        }

        //если вдруг права существующего мастер токена и запрашиваемые отличаются, то
        if (isOverride) {
            _createActiveToken = await this.prisma.activeToken.update({
                where: {
                    id: _createActiveToken.id,
                },
                data: {
                    permissions: tokenPermissions,
                },
            })
            if (!_createActiveToken) {
                this.logger.error("active token can't be a updated in db")
                throw new InternalServerErrorException()
            }
        } else if (_createActiveToken.permissions != tokenPermissions) {
            this.logger.verbose('tokenName: ' + tokenName)
            this.logger.verbose(
                'tokenPermissions: ' +
                    tokenPermissions +
                    ' and _createActiveToken.permissions: ' +
                    _createActiveToken.permissions,
            )
            throw new BadRequestException(
                'You cannot put new Permissions to an existing token. Please deactivate it or make up a new one. You can also not to use the tokenPermissions field',
            )
        }
        const payload = {
            sub: userId,
            token: token,
            secure_token_part_public: keys[1],
            v: 2, //первая версия токена, в ней добавлен мастертокен, это важно!!
        }
        const secret = this.config.get('JWT_SECRET')

        return await this.jwt.signAsync(payload, {
            secret: secret,
        })
    }

    //создание мастер токена
    async createActiveToken(
        userId: number,
        description: string,
        tokenPermissions: bigint,
        secure_token_part_private: string,
    ): Promise<ActiveTokenDto> {
        const randomdata = createHash('sha256')
            .update(randomBytes(20).toString('hex'))
            .digest('base64url')
        this.logger.verbose('createActiveToken: randomdata: ' + randomdata)

        const data = {
            userid: userId,
            token: randomdata,
            secure_token_part_private: secure_token_part_private,
            description: description,
            permissions: tokenPermissions, //права токена. НЕ ПЕРЕПИСЫВАЮТ ПРАВА ПОЛЬЗОВАТЕЛЯ, НАКЛАДЫВАЮТСЯ МАСКОЙ!!!
        }
        const createActiveToken = await this.prisma.activeToken.create({
            data: data,
        })
        if (!createActiveToken) {
            this.logger.debug(
                'activeToken not created into DB userid:' + userId,
            )
            this.logger.verbose('data', data)
            throw new InternalServerErrorException(
                'activeToken not created into DB',
            )
        }
        return createActiveToken
    }
}
