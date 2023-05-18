import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilService } from 'src/util/util.service';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private utilService: UtilService,
    ) {}

    getme(req: Request) {
        return req.user;
    }

    async getYourselfPermissions(req: {user:User}) {
        //user permissions
        const rawUserPermisisons = req.user.permissions;
        //token permissions
        const rawTokenPermissions:bigint = req.user["ActiveToken"]["permissions"];
        //permissions available right now
        const rawPermissions = rawUserPermisisons & rawTokenPermissions;

        //permissions name
        const permissions = await this.utilService.getPermissionsByName(rawPermissions)
        
        return {
            rawUserPermisisons,
            rawTokenPermissions,
            rawPermissions,
            permissions
        };
    }
}
