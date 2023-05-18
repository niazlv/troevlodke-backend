import { Logger, LogLevel, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const TAG_LOG = 'main.ts';
  /** Начало мега костыля для BigInt. НЕ СОВЕТУЮ ТРОГАТЬ, ЕСЛИ НЕ ХОТИТЕ ФАНТОМНЫЕ ОШИБКИ В РАЗНЫХ ЧАСТЯХ КОДА
   * его можно убрать, только тогда нельзя выводить user на экран и пытаться выводить json где есть поле permissions. Либо коментируем, либо преобразуем в число или в строку
   * Если вдруг что-то полетело и ругается на эту строку, то идем переписывать
   * BigInt.prototype.toJSON
   * 
   * $(PROj)/node_modules/typescript/lib/lib.es2020.bigint.d.ts
   * Ищем interface BigInt и вписываем туда:
   * toJSON():JSON;
   * либо патченный lib.es2020.bigint.d.ts копируем из $(PROj)/node_modules.patched/typescript/lib/lib.es2020.bigint.d.ts в $(PROj)/node_modules/typescript/lib/lib.es2020.bigint.d.ts
   * 
   * Тоже самое можно сделать в вашей IDE чтобы она не ругалась и не подсвечивала красным. А она будет это делать, если у вас не изменено ничего. Либо просто забиваем на это
  */
   BigInt.prototype.toJSON = function() {
    return this.toString();
  };
  Logger.log("BigInt prototype toJSON is runned! *something in Elvish*",TAG_LOG);
  /** ----------------------------------------------------------- */
  const _LOG_LEVEL_STAGE:LogLevel[] = [
    "log",
    "error",
    "warn",
  ]
  const _LOG_LEVEL_DEV:LogLevel[] = [
    "log",
    "error",
    "warn",
    "debug",
  ]
  const _LOG_LEVEL_TEST:LogLevel[] = [
    "log",
    "error",
    "warn",
    "debug",
    "verbose",
  ]
  var _LOG_LEVEL:LogLevel[] = 
    (process.env.ENV == 'stage')? _LOG_LEVEL_STAGE:
    (process.env.ENV == 'dev')?_LOG_LEVEL_DEV:
    (process.env.ENV == 'test')?_LOG_LEVEL_TEST:
    _LOG_LEVEL_TEST;
  
  if(process.env.ENV == 'dev') _LOG_LEVEL = _LOG_LEVEL_TEST;
  
  const app = await NestFactory.create(AppModule,{
    logger: _LOG_LEVEL,
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion:"1",
    prefix: 'api/v',
  });

  Logger.warn("log level: "+process.env.ENV,TAG_LOG);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    transform: true,
  }));
  
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
});

  const config = new DocumentBuilder()
    .setTitle('troevlodke')
    .setDescription('The troevlodke API description')
    .setVersion('0.0.1')
    .addBearerAuth()
    //.addServer("campfire.ext-it.ru:4081", "Stage on server")
    //.addServer("campfire.ext-it.ru:4082", "Dev on server")
    //.addServer("localhost:4082", "Dev localy")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  Logger.log('swagger is runned',TAG_LOG);

  await app.listen(process.env.PORT);
  Logger.log('API is upped on '+process.env.PORT,TAG_LOG);
}
bootstrap();
