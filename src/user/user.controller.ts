import {
    Controller,
    Get,
    UseGuards,
    Req,
    Put,
    Body,
    Delete,
    Query,
    Post,
} from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiBody,
    ApiHeader,
    ApiCreatedResponse,
    ApiTags,
    ApiOkResponse,
} from '@nestjs/swagger'
import { User } from '@prisma/client'
import { Request } from 'express'
import { Permissions } from 'src/auth/decorator'
import { PermissionsGuard, JwtGuard } from 'src/auth/guard'
import { ReturnDto } from 'src/dto'
import { UserService } from './user.service'
import {
    EditMeDto,
    FriendRequestDto,
    HiddenModeDto,
    ReplyFriendRequestDto,
} from './dto'

@ApiTags('user')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'requested permits: read:yourself.\nreturn user object.',
        schema: {
            example: {
                statusCode: 200,
                data: {
                    id: 1,
                    createdAt: '2023-05-18T16:44:08.504Z',
                    updatedAt: '2023-05-18T16:44:08.504Z',
                    role: 1,
                    permissions: '4294967295',
                    other: {},
                    isActive: true,
                    firstname: null,
                    lastname: null,
                    middlename: null,
                    birthday: null,
                    city: 'Moscow',
                    country: 'Russia',
                    login: 'admin',
                    email: null,
                    parentid: [0],
                    score: 0,
                    courcesid: [],
                    progress: {},
                    friendsid: [],
                    interests: '',
                    tests: [],
                    rating: 5,
                    social: {},
                    photo: null,
                    ActiveToken: {
                        id: 1,
                        createdAt: '2023-05-18T16:55:46.247Z',
                        userid: 1,
                        token: 'lIQLUU8LJVK6eS0vkkVCNiDpVuo55wReqSzVHO1PsDg',
                        description: 'auth.service: signToken',
                        permissions: '4294967295',
                        usedAt: '2023-05-18T16:55:47.710Z',
                        countOfUses: 0,
                    },
                },
            },
        },
    })
    @UseGuards(JwtGuard, PermissionsGuard)
    @Permissions('read:yourself')
    @Get('me')
    async getMe(@Req() req: Request): Promise<ReturnDto> {
        //раскоментировать в случае если сервак плюется в лицо непонятной ошибкой при вызове этой функции
        //req.user['permissions']=req.user['permissions'].toString();
        return {
            statusCode: 200,
            data: await this.userService.getme(req),
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Put('me')
    async editMe(
        @Body() dto: EditMeDto,
        @Req() user: { user: User },
    ): Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.userService.editMe(dto, user),
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Delete('deleteProfile')
    async deleteMe(@Req() user: { user: User }): Promise<ReturnDto> {
        const d = await this.userService.deleteMe(user)
        return {
            statusCode: 200,
            data: {
                deleted_user: d,
            },
        }
    }

    @ApiBearerAuth()
    @ApiOkResponse({
        description:
            'requested permits: read:yourself. return your permissions',
        schema: {
            example: {
                rawUserPermisisons: '4294967295',
                rawTokenPermissions: '4294967295',
                rawPermissions: '4294967295',
                permissions: [
                    'read:yourself',
                    'write:yourself',
                    'create:invitelink',
                    'create:account',
                    'write:feedback',
                    'read:feedback',
                    'read:allfeedback',
                    'create:feedback',
                    'read:role',
                    'write:role',
                    'read:permissions',
                    'write:permissions',
                ],
            },
        },
    })
    @UseGuards(JwtGuard, PermissionsGuard)
    @Permissions('read:yourself')
    @Get('permissions')
    async getYourselfPermissions(
        @Req() user: { user: User },
    ): Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.userService.getYourselfPermissions(user),
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Get('hiddenmode')
    async hiddenMode(
        @Query() dto: HiddenModeDto,
        @Req() user: { user: User },
    ): Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.userService.hiddenMode(dto, user),
        }
    }

    @Get('allusers')
    async allGetUsers(): Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.userService.allGetUsers(),
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Post('friendrequest')
    async addRequest(
        @Body() dto: FriendRequestDto,
        @Req() user: { user: User },
    ): Promise<ReturnDto> {
        return {
            statusCode: 201,
            data: await this.userService.addFriendRequest(dto, user),
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Post('replyfriend')
    async replyFriendRequest(
        @Body() dto: ReplyFriendRequestDto,
        @Req() user: { user: User },
    ): Promise<ReturnDto> {
        return {
            statusCode: 201,
            data: await this.userService.replyFriendRequest(dto, user),
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Get('friends')
    async getFriends(@Req() user: { user: User }): Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.userService.getFriends(user),
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Get('friendrequest')
    async getFriendRequest(@Req() user: { user: User }): Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.userService.getFriendRequest(user),
        }
    }
}
