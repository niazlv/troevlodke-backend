import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { permissions, User } from '@prisma/client'
import {
    createCipheriv,
    createDecipheriv,
    createHash,
    randomBytes,
    randomFill,
    scrypt,
    scryptSync,
} from 'crypto'

@Injectable()
export class UtilService {
    private readonly logger = new Logger(UtilService.name)
    constructor(private prisma: PrismaService) {}

    async getPermissionsByName(rawPermissions: bigint) {
        var permissions = []
        const _permissions = await this.prisma.permissions.findMany({})
        for (var i = 0; i < _permissions.length; i++) {
            const bit = BigInt(_permissions[i].bit)
            if ((bit & rawPermissions) == bit) {
                permissions.push(_permissions[i].name)
            }
        }
        return permissions
    }

    getbitmask(permissions: permissions[], permissionList: string[]): bigint {
        var bitmask = BigInt(0)
        for (let index = 0; index < permissions.length; index++) {
            const jspayload = permissions[index]
            for (let i = 0; i < permissionList.length; i++) {
                if (jspayload['name'] === permissionList[i]) {
                    const bit = jspayload['bit']
                    bitmask |= 1n << BigInt(bit)
                }
            }
        }
        return bitmask
    }

    isBitmask(src: bigint, bitmask: bigint): boolean {
        return (src & bitmask) === bitmask
    }

    async getPages(dto, data: any[]) {
        if (dto.pageSize == null) dto.pageSize = 20
        console.log(dto)
        this.logger.verbose('data.length: ' + data.length)
        this.logger.verbose('dto.pageSize: ' + dto.pageSize)
        if (dto.page <= 0)
            throw new BadRequestException("page can't be lower or equal 0")
        const ln = this.roundToMore(data.length / dto.pageSize)
        this.logger.verbose('ln: ' + ln)
        const start_page = (dto.page - 1) * dto.pageSize
        const stop_page = dto.page * dto.pageSize
        if (dto.page > ln) throw new NotFoundException('page not found')
        var paged_data = []
        for (var i = start_page; i < stop_page; i++) {
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
        if (Object.prototype.toString.call(o) == '[object Array]') {
            for (let key = 0; key < o.length; key++) {
                this.cleanData(o[key])
                if (
                    Object.prototype.toString.call(o[key]) == '[object Object]'
                ) {
                    if (Object.keys(o[key]).length === 0) {
                        o.splice(key, 1)
                        key--
                    }
                }
            }
        } else if (Object.prototype.toString.call(o) == '[object Object]') {
            for (let key in o) {
                let value = this.cleanData(o[key])
                if (value === null) {
                    delete o[key]
                }
                if (
                    Object.prototype.toString.call(o[key]) == '[object Object]'
                ) {
                    if (Object.keys(o[key]).length === 0) {
                        delete o[key]
                    }
                }
                if (
                    Object.prototype.toString.call(o[key]) == '[object Array]'
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
        const checksum = createHash('md5').update(file.buffer).digest('hex')
        file['checksum'] = checksum
        Logger.debug('checksum: ' + checksum)
        // try find it on db
        const file_db = await this.prisma.files.findFirst({
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
        const file_db_upload = await this.prisma.files.create({
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

    encrypt(
        text: string,
        password: string,
        salt: string = 'salt',
        iv: string = '123456789ABCDEFG',
    ): {
        encrypted: string
        key: string
    } {
        const algorithm = 'aes-192-cbc'
        var key = scryptSync(password, salt, 24)
        // Once we have the key and iv, we can create and use the cipher...
        const cipher = createCipheriv(algorithm, key, iv)

        var encrypted = cipher.update(text, 'utf8', 'base64')
        encrypted += cipher.final('base64')
        // cipher.setEncoding('base64')

        // cipher.on('data', (chunk) => (encrypted += chunk))

        // cipher.write(text)
        // cipher.end()
        return {
            encrypted,
            key: key.toString('hex'),
        }
    }

    encryptByKey(
        text: string,
        key: string,
        iv: string = '123456789ABCDEFG',
    ): {
        encrypted: string
        key: string
    } {
        const algorithm = 'aes-192-cbc'
        // Once we have the key and iv, we can create and use the cipher...
        const cipher = createCipheriv(algorithm, Buffer.from(key, 'hex'), iv)

        var encrypted = cipher.update(text, 'utf8', 'base64')
        encrypted += cipher.final('base64')
        // cipher.setEncoding('base64')

        // cipher.on('data', (chunk) => (encrypted += chunk))

        // cipher.write(text)
        // cipher.end()

        return {
            encrypted,
            key: key,
        }
    }

    decrypt(
        encrypted: string,
        password: string,
        salt: string = 'salt',
        iv: string = '123456789ABCDEFG',
    ): {
        decrypted: string
        key: string
    } {
        const algorithm = 'aes-192-cbc'
        var key = scryptSync(password, salt, 24)
        // Once we have the key and iv, we can create and use the cipher...
        const cipher = createDecipheriv(algorithm, key, iv)
        var decrypted = cipher.update(encrypted, 'base64', 'utf8')
        decrypted += cipher.final('utf8')
        // cipher.setEncoding('base64')

        // cipher.on('data', (chunk) => (decrypted += chunk))

        // cipher.write(encrypted)
        // cipher.end()
        return {
            decrypted,
            key: key.toString('hex'),
        }
    }

    decryptByKey(
        encrypted: string,
        key: string,
        iv: string = '123456789ABCDEFG',
    ): {
        decrypted: string
        key: string
    } {
        const algorithm = 'aes-192-cbc'
        // Once we have the key and iv, we can create and use the cipher...
        const cipher = createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv)

        var decrypted = cipher.update(encrypted, 'base64', 'utf8')
        decrypted += cipher.final('utf8')
        // cipher.setEncoding('utf-8')

        // cipher.on('data', (chunk) => (decrypted += chunk))

        // cipher.write(encrypted)
        // cipher.end()

        return {
            decrypted,
            key,
        }
    }

    iv_generator(): string {
        var iv = randomBytes(8)
        return iv.toString('hex')
    }

    splitString(str: string) {
        const length = str.length
        const midpoint = Math.floor(length / 2)

        const firstHalf = str.slice(0, midpoint)
        const secondHalf = str.slice(midpoint)

        return [firstHalf, secondHalf]
    }

    async decryptUser(user, key: string) {
        const iv_storage = await this.prisma.iv_storage.findFirst({
            where: {
                userid: user.id,
            },
        })

        user.firstname = this.decryptByKey(
            user.firstname,
            key,
            iv_storage.iv,
        ).decrypted
        user.lastname = this.decryptByKey(
            user.lastname,
            key,
            iv_storage.iv,
        ).decrypted
        user.middlename = this.decryptByKey(
            user.middlename,
            key,
            iv_storage.iv,
        ).decrypted

        return user
    }
}
