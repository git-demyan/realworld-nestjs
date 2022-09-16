import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
