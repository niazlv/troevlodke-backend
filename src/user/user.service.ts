import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { error } from 'console'
import { Request } from 'express'
import { PrismaService } from 'src/prisma/prisma.service'
import { UtilService } from 'src/util/util.service'
import { EditMeDto, HiddenModeDto } from './dto'
import { createCipheriv, scrypt } from 'crypto'
import { use } from 'passport'
import { IsBooleanString } from 'class-validator'

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private utilService: UtilService,
    ) {}

    async getme(req: Request) {
        req.user['courses'] = []

        try {
            const course = await this.prisma.cource.findMany({
                where: {
                    categorylabel: req.user['categories']['data'][0]['label'],
                },
            })
            req.user['courses'] = course

            for (var i = 0; i < course.length; i++) {
                req.user['courcesid'].push(course[i].id)
            }
        } catch (e) {
            Logger.error(e)
        }
        return req.user
    }

    async getYourselfPermissions(req: { user: User }) {
        //user permissions
        const rawUserPermisisons = req.user.permissions
        //token permissions
        const rawTokenPermissions: bigint =
            req.user['ActiveToken']['permissions']
        //permissions available right now
        const rawPermissions = rawUserPermisisons & rawTokenPermissions

        //permissions name
        const permissions = await this.utilService.getPermissionsByName(
            rawPermissions,
        )

        return {
            rawUserPermisisons,
            rawTokenPermissions,
            rawPermissions,
            permissions,
        }
    }

    async editMe(dto: EditMeDto, user: { user: User }) {
        // delete null values
        var data = await this.utilService.cleanData(dto)
        if (data == null) {
            throw new BadRequestException("body can't be null")
        }

        data.id = user.user.id

        data = await this.utilService.cryptUser(
            data,
            user.user['ActiveToken']['key'],
        )

        var new_user = await this.prisma.user.update({
            where: {
                id: user.user.id,
            },
            data: data,
        })

        new_user = await this.utilService.decryptUser(
            new_user,
            user.user['ActiveToken']['key'],
        )
        return new_user
    }

    async deleteMe(user: { user: User }) {
        var del_UserFeed = {}
        try {
            del_UserFeed = await this.prisma.userFeed.delete({
                where: {
                    userid: user.user.id,
                },
            })
        } catch (e) {}
        var del_ActiveToken = {}
        try {
            del_ActiveToken = await this.prisma.activeToken.deleteMany({
                where: {
                    userid: user.user.id,
                },
            })
        } catch (e) {}

        var iv_storage = {}
        try {
            iv_storage = await this.prisma.iv_storage.delete({
                where: {
                    userid: user.user.id,
                },
            })
        } catch (e) {}

        const del_user = await this.prisma.user.delete({
            where: {
                id: user.user.id,
            },
        })

        del_user['UserFeed'] = del_UserFeed
        del_user['ActiveToken'] = del_ActiveToken
        del_user['iv_storage'] = iv_storage

        return del_user
    }

    async hiddenMode(dto: HiddenModeDto, user: { user: User }) {
        try {
            dto.isHidden = (dto.isHidden as unknown as string) === 'true'
            console.log(dto.isHidden)
            const hidden = await this.prisma.keys.update({
                where: {
                    userid: user.user.id,
                },
                data: {
                    isHidden: dto.isHidden,
                    key: !dto.isHidden ? user.user['ActiveToken']['key'] : '',
                },
            })
            return hidden
        } catch (e) {
            Logger.error(e)
            throw new InternalServerErrorException()
        }
    }

    async allGetUsers() {
        try {
            const keys = await this.prisma.keys.findMany({
                where: {
                    isHidden: false,
                },
            })
            if (keys.length == 0) throw new NotFoundException()
            var userids = []
            for (var i = 0; i < keys.length; i++) {
                userids.push(keys[i].userid)
            }
            if (userids.length == 0) throw new NotFoundException()
            const users = await this.prisma.user.findMany({
                where: {
                    id: {
                        in: userids,
                    },
                },
            })
            for (var i = 0; i < users.length; i++) {
                users[i] = await this.utilService.decryptUser(
                    users[i],
                    keys[i].key,
                )
                delete users[i].hash
                delete users[i].paircatchphrases
                delete users[i].catchphrases
            }

            return users
        } catch (e) {
            if (e instanceof NotFoundException) throw new NotFoundException()
            Logger.error("can't get all users", e)
            throw new InternalServerErrorException()
        }
    }
}
