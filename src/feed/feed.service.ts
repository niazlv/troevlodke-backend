import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UtilService } from 'src/util/util.service'
import {
    CreatePostDto,
    DeletePostDto,
    EditPostDto,
    GetPostDto,
    UpdateLikeDto,
} from './dto'
import { ApiInternalServerErrorResponse } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { NotFoundError } from 'rxjs'

@Injectable()
export class FeedService {
    constructor(
        private prismaService: PrismaService,
        private utilService: UtilService,
    ) {}

    async createPost(user: { user: User }, dto: CreatePostDto) {
        // delete null values
        var data = await this.utilService.cleanData(dto)
        if (data == null) {
            throw new BadRequestException("body can't be null")
        }
        data['authorid'] = user.user.id
        data['authorname'] = user.user.firstname + ' ' + user.user.lastname
        try {
            const post = await this.prismaService.post.create({
                data: data,
            })
            const userfeed = await this.prismaService.userFeed.upsert({
                where: {
                    userid: user.user.id,
                },

                create: {
                    userid: user.user.id,
                    posts: [post.id],
                },
                update: {
                    posts: {
                        push: post.id,
                    },
                },
            })
            return post
        } catch (e) {
            Logger.error(e, 'Create post failed')
            throw new InternalServerErrorException()
        }
    }

    async getPost(dto: GetPostDto) {
        try {
            const post = await this.prismaService.post.findFirstOrThrow({
                where: {
                    id: dto.postid,
                },
            })
            // const user = await this.prismaService.user.findFirst({
            //     where: {
            //         id: post.authorid,
            //     },
            // })
            // post['authorname'] = user.firstname + ' ' + user.lastname

            return post
        } catch (e) {
            throw new NotFoundException()
        }
    }

    async getAllPosts() {
        const posts = await this.prismaService.post.findMany({
            orderBy: [
                {
                    createdAt: 'desc',
                },
            ],
        })
        const ids = []
        for (var i = 0; i < posts.length; i++) {
            ids[i] = posts[i].authorid
            posts[i]['user'] = await this.prismaService.user.findFirst({
                where: {
                    id: posts[i].authorid,
                },
            })
        }
        // const users = await this.prismaService.user.findMany({
        //     where: {
        //         id: {
        //             in: ids,
        //         },
        //     },
        // })
        // Logger.error(users)
        // for (var i = 0; i < posts.length; i++) {
        //     var authorname = ''
        //     for (var j = 0; j < users.length; j++) {
        //         if (users[j].id == posts[i].authorid) {

        //             users[j] = await this.utilService.decryptUser(users[j],)
        //             authorname = users[j].firstname + ' ' + users[j].lastname
        //         }
        //     }
        //     posts[i]['authorname'] = authorname
        // }

        return posts
    }

    async editPost(dto: EditPostDto) {
        var postid = dto.postid
        delete dto.postid
        // delete null values
        var data = await this.utilService.cleanData(dto)
        if (data == null) {
            throw new BadRequestException("body can't be null")
        }

        try {
            const post = await this.prismaService.post.update({
                where: {
                    id: postid,
                },
                data: dto,
            })
            return post
        } catch (e) {
            if (e.code == 404) {
                throw new NotFoundException('post not found by this id')
            }
            Logger.error(e, 'edit post failed')
            throw new InternalServerErrorException()
        }
    }

    async deletePost(dto: DeletePostDto) {
        try {
            const post = await this.prismaService.post.delete({
                where: {
                    id: dto.postid,
                },
            })

            return post
        } catch (e) {
            if (e.code == 404) {
                throw new NotFoundException('post not found by this id')
            }
            Logger.error(e, 'delete post failed')
            throw new InternalServerErrorException()
        }
    }

    async updateLike(dto: UpdateLikeDto) {
        var like = 0
        var dislike = 0
        console.log(dto)
        if (dto.isLike != null) {
            dto.isLike = (dto.isLike as unknown as string) === 'true'
            like = dto.isLike ? 1 : -1
        }
        if (dto.isLike != null) {
            dto.isDislike = (dto.isDislike as unknown as string) === 'true'
            dislike = dto.isDislike ? 1 : -1
        }
        try {
            const post = await this.prismaService.post.update({
                where: {
                    id: dto.postid,
                },
                data: {
                    likes: {
                        increment: like,
                    },
                    dislikes: {
                        increment: dislike,
                    },
                },
            })

            return post
        } catch (e) {
            if (e.code == 404) {
                throw new NotFoundException('post not found by this id')
            }
            Logger.error(e, 'update likes failed')
            throw new InternalServerErrorException()
        }
    }
}
