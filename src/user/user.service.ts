import { Injectable, Logger } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { error } from 'console'
import { Request } from 'express'
import { PrismaService } from 'src/prisma/prisma.service'
import { UtilService } from 'src/util/util.service'

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
}
