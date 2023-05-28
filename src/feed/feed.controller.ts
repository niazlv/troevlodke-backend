import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import { ReturnDto } from 'src/dto'
import { FeedService } from './feed.service'
import { JwtGuard } from 'src/auth/guard'
import { CreatePostDto, DeletePostDto, EditPostDto, GetPostDto } from './dto'
import { User } from '@prisma/client'

@ApiTags('News feed')
@Controller('feed')
export class FeedController {
    constructor(private feedService: FeedService) {}

    @ApiBearerAuth()
    @ApiBody({
        type: CreatePostDto,
    })
    @UseGuards(JwtGuard)
    @Post('post')
    async createPost(
        @Req() user: { user: User },
        @Body() dto: CreatePostDto,
    ): Promise<ReturnDto> {
        return {
            statusCode: 201,
            data: await this.feedService.createPost(user, dto),
        }
    }

    @Get('post')
    async getPost(@Query() dto: GetPostDto): Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.feedService.getPost(dto),
        }
    }

    @Get('allposts')
    async getAllPosts(): Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.feedService.getAllPosts(),
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Put('post')
    async editPost(@Body() dto: EditPostDto): Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.feedService.editPost(dto),
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Delete('post')
    async deletePost(@Query() dto: DeletePostDto): Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.feedService.deletePost(dto),
        }
    }
}
