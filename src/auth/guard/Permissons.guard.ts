import { CanActivate, ExecutionContext, ForbiddenException, GoneException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { ActiveTokenDto } from '../dto';
import { UtilService } from 'src/util/util.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name)
  constructor(
    private readonly reflector: Reflector, 
    private prisma: PrismaService,
    private utilService: UtilService,
    ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    this.logger.verbose('someone activate');
    //достаем данные из Metadata что установили в Permissions.decorator.ts
    const routePermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    //тут какая-то магия произошла. Пользователь удобно есть в контексте
    const user:User = context.switchToHttp().getRequest()['user'];
    if(!user) {
      this.logger.error("user not getted from context!");
      return false;
    }
    //достаем ActiveToken из юзера. Мы его поместили туда во время jwt.strategy.ts
    const activeToken: ActiveTokenDto = user['ActiveToken'];
    if(!activeToken) {
      this.logger.verbose("Active token don't found in user");
      throw new UnauthorizedException("your master token is invalid!");
    }
    const activeTokenPermissions:bigint = activeToken.permissions;

    //Накладываем права токена на права пользователя
    const userPermissions:bigint = user.permissions & activeTokenPermissions;
    if (!routePermissions || userPermissions == null) {
      this.logger.debug("nof found permissions, let them pass.");
      return true;
    }

    //получим разрешения из БД
    const permissions = await this.prisma.permissions.findMany({});
    if(permissions.length == 0) {
      this.logger.debug("not found permissions on db, skip checking and pass them");
      return true;
    }

    //Создаем побитовую маску из существующих разрешений
    const bitmask:bigint = this.utilService.getbitmask(permissions,routePermissions);
    this.logger.debug("bitmask: "+bitmask+ " userPermissions: "+userPermissions);
    if(bitmask == 0n) this.logger.warn(routePermissions[0] +" not found!!");

    //если маска сходится с правами пользователя, то разрешаем ему войти
    const status = this.utilService.isBitmask(userPermissions,bitmask);
    this.logger.debug(status);
    if(!status) throw new ForbiddenException("You do not have enough permissions to do this");
    return status;
  } 
}