import { Body, Controller, Logger, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { ReturnDto } from "src/dto";
import { AuthService } from "./auth.service";
import { Permissions } from "./decorator";
import { AuthDto } from "./dto";
import { JwtGuard, PermissionsGuard } from "./guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(private authService: AuthService) {}


    @ApiCreatedResponse({
        description:"return access_token",
        schema:{
            example: {
                statusCode:201,
                data:{"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6skpXVCJ9.eyJzdWIiOjgsInRva2VuIjoiZXJ1bV9mMzczWjh1ZUplYTd5eFY3ZlNualdxTGUwU29KQlhSRVsyZk5EcyIsInYiOjEsImlhdCI6MTY2NTgxODQwNH0.pxBNn_rqp-32XdrJCEdYrzgBhiv1ehsi5dGF8kk5vBg"}
            }
        }
    })
    @Post('signin')
    async signin(@Query() dto: AuthDto):Promise<ReturnDto> {
        return {
            statusCode:201,
            data: await this.authService.signin(dto)
        }
    }

    @ApiBearerAuth()
    @ApiBody({
        description: "requested permits: create:account",
        type:AuthDto
    })
    // @UseGuards(JwtGuard,PermissionsGuard)
    // @Permissions("create:account")
    @Post('signup')
    async signup(@Body() dto: AuthDto):Promise<ReturnDto> {
        return {
            statusCode: 201,
            data: await this.authService.signup(dto)
        }
    }
}