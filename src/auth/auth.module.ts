import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';
// import { requiresAuth } from 'express-openid-connect';

@Module({
  imports: [HttpModule, ScheduleModule.forRoot()],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(requiresAuth()).forRoutes('/user');
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
