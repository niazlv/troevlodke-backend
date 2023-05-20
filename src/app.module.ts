import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { UtilModule } from './util/util.module';
import { ParseModule } from './parse/parse.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    AuthModule, 
    UserModule,
    PrismaModule,
    UtilModule,
    ParseModule,
  ],
})
export class AppModule {}
