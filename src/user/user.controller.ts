import { Controller, Get, UseGuards,Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiCreatedResponse, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Request } from 'express';
import { Permissions } from 'src/auth/decorator';
import { PermissionsGuard,JwtGuard } from 'src/auth/guard';
import { ReturnDto } from 'src/dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('users')
export class UserController {
    constructor(
        private userService: UserService,
    ) {}

    @ApiBearerAuth()
    @ApiOkResponse({
        description:"requested permits: read:yourself.\nreturn user object.",
        schema: {
            example: {
                "statusCode": 200,
                "data": {
                    "id": 1,
                    "createdAt": "2023-05-18T16:44:08.504Z",
                    "updatedAt": "2023-05-18T16:44:08.504Z",
                    "role": 1,
                    "permissions": "4294967295",
                    "other": {},
                    "isActive": true,
                    "firstname": null,
                    "lastname": null,
                    "middlename": null,
                    "birthday": null,
                    "city": "Moscow",
                    "country": "Russia",
                    "login": "admin",
                    "email": null,
                    "parentid": [
                        0
                    ],
                    "score": 0,
                    "courcesid": [],
                    "progress": {},
                    "friendsid": [],
                    "interests": "",
                    "tests": [],
                    "rating": 5,
                    "social": {},
                    "photo": null,
                    "ActiveToken": {
                        "id": 1,
                        "createdAt": "2023-05-18T16:55:46.247Z",
                        "userid": 1,
                        "token": "lIQLUU8LJVK6eS0vkkVCNiDpVuo55wReqSzVHO1PsDg",
                        "description": "auth.service: signToken",
                        "permissions": "4294967295",
                        "usedAt": "2023-05-18T16:55:47.710Z",
                        "countOfUses": 0
                    }
                }
            }
        }
    })
    @UseGuards(JwtGuard, PermissionsGuard)
    @Permissions("read:yourself")
    @Get('me')
    getMe(@Req() req: Request):ReturnDto{
        //раскоментировать в случае если сервак плюется в лицо непонятной ошибкой при вызове этой функции
        //req.user['permissions']=req.user['permissions'].toString();
        return {
            statusCode:200,
            data: this.userService.getme(req)
        };
    }

    @ApiBearerAuth()
    @ApiOkResponse({
        description: "requested permits: read:yourself. return your permissions",
        schema: {
            example: {
                "rawUserPermisisons": "4294967295",
                "rawTokenPermissions": "4294967295",
                "rawPermissions": "4294967295",
                "permissions": [
                    "read:yourself",
                    "write:yourself",
                    "create:invitelink",
                    "create:account",
                    "write:feedback",
                    "read:feedback",
                    "read:allfeedback",
                    "create:feedback",
                    "read:role",
                    "write:role",
                    "read:permissions",
                    "write:permissions"
                ]
            }
        }
    })
    @UseGuards(JwtGuard,PermissionsGuard)
    @Permissions("read:yourself")
    @Get("permissions")
    async getYourselfPermissions(@Req() user:{user:User}): Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.userService.getYourselfPermissions(user)
        }
    }
}
