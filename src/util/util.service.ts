import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { permissions, User } from '@prisma/client'
import { createHash } from 'crypto'

@Injectable()
export class UtilService {
    private readonly logger = new Logger(
        UtilService.name,
    )
    constructor(private prisma: PrismaService) {}

    async getPermissionsByName(
        rawPermissions: bigint,
    ) {
        var permissions = []
        const _permissions =
            await this.prisma.permissions.findMany(
                {},
            )
        for (
            var i = 0;
            i < _permissions.length;
            i++
        ) {
            const bit = BigInt(
                _permissions[i].bit,
            )
            if ((bit & rawPermissions) == bit) {
                permissions.push(
                    _permissions[i].name,
                )
            }
        }
        return permissions
    }

    getbitmask(
        permissions: permissions[],
        permissionList: string[],
    ): bigint {
        var bitmask = BigInt(0)
        for (
            let index = 0;
            index < permissions.length;
            index++
        ) {
            const jspayload = permissions[index]
            for (
                let i = 0;
                i < permissionList.length;
                i++
            ) {
                if (
                    jspayload['name'] ===
                    permissionList[i]
                ) {
                    const bit = jspayload['bit']
                    bitmask |= 1n << BigInt(bit)
                }
            }
        }
        return bitmask
    }

    isBitmask(
        src: bigint,
        bitmask: bigint,
    ): boolean {
        return (src & bitmask) === bitmask
    }

    async getPages(dto, data: any[]) {
        if (dto.pageSize == null)
            dto.pageSize = 20
        console.log(dto)
        this.logger.verbose(
            'data.length: ' + data.length,
        )
        this.logger.verbose(
            'dto.pageSize: ' + dto.pageSize,
        )
        if (dto.page <= 0)
            throw new BadRequestException(
                "page can't be lower or equal 0",
            )
        const ln = this.roundToMore(
            data.length / dto.pageSize,
        )
        this.logger.verbose('ln: ' + ln)
        const start_page =
            (dto.page - 1) * dto.pageSize
        const stop_page = dto.page * dto.pageSize
        if (dto.page > ln)
            throw new NotFoundException(
                'page not found',
            )
        var paged_data = []
        for (
            var i = start_page;
            i < stop_page;
            i++
        ) {
            if (data[i]) paged_data.push(data[i])
        }
        return {
            paged_data,
            page: dto.page,
            pages: ln,
            pageSize: dto.pageSize,
        }
    }

    roundToMore(num: number): number {
        var one = Number(num.toFixed(0))
        if (num > one) num = one + 1
        //this.logger.verbose(num+" "+one);
        return one
    }

    async cleanData(o) {
        if (
            Object.prototype.toString.call(o) ==
            '[object Array]'
        ) {
            for (
                let key = 0;
                key < o.length;
                key++
            ) {
                this.cleanData(o[key])
                if (
                    Object.prototype.toString.call(
                        o[key],
                    ) == '[object Object]'
                ) {
                    if (
                        Object.keys(o[key])
                            .length === 0
                    ) {
                        o.splice(key, 1)
                        key--
                    }
                }
            }
        } else if (
            Object.prototype.toString.call(o) ==
            '[object Object]'
        ) {
            for (let key in o) {
                let value = this.cleanData(o[key])
                if (value === null) {
                    delete o[key]
                }
                if (
                    Object.prototype.toString.call(
                        o[key],
                    ) == '[object Object]'
                ) {
                    if (
                        Object.keys(o[key])
                            .length === 0
                    ) {
                        delete o[key]
                    }
                }
                if (
                    Object.prototype.toString.call(
                        o[key],
                    ) == '[object Array]'
                ) {
                    if (o[key].length === 0) {
                        delete o[key]
                    }
                }
            }
        }
        return o
    }

    async saveFile(file: Express.Multer.File) {
        // get checksum
        const checksum = createHash('md5')
            .update(file.buffer)
            .digest('hex')
        file['checksum'] = checksum
        Logger.debug('checksum: ' + checksum)
        // try find it on db
        const file_db =
            await this.prisma.files.findFirst({
                where: {
                    checksum: checksum,
                },
            })
        // if finded, throw exception with file info
        if (file_db != null) {
            delete file_db.data
            return file_db
        }
        // upload file on DB
        const file_db_upload =
            await this.prisma.files.create({
                data: {
                    filename: file.originalname,
                    data: file.buffer,
                    checksum: checksum,
                    encoding: file.encoding,
                    mimetype: file.mimetype,
                    size: file.size,
                },
            })
        // return id and hash to user

        delete file_db_upload.data
        return file_db_upload
    }
}
