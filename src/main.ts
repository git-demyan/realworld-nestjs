import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { auth } from 'express-openid-connect';
import { AppModule } from './app.module';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT', 3000);
  const AUTH0_DOMAIN = configService.get('AUTH0_DOMAIN');
  const AUTH0_CLIENT_ID = configService.get('AUTH0_CLIENT_ID');
  const AUTH0_CLIENT_SECRET = configService.get('AUTH0_CLIENT_SECRET');
  const AUTH0_SECRET = configService.get('AUTH0_SECRET');

  const authConfig = {
    authRequired: false,
    auth0Logout: true,
    secret: AUTH0_SECRET,
    baseURL: 'http://localhost:3000',
    clientID: AUTH0_CLIENT_ID,
    clientSecret: AUTH0_CLIENT_SECRET,
    issuerBaseURL: AUTH0_DOMAIN,
    authorizationParams: {
      response_type: 'code',
      audience: 'https://dev-1kdczm5r.us.auth0.com/api/',
      scope: 'openid email profile',
    },
  };
  app.use(auth(authConfig));

  await app.listen(PORT);
}
bootstrap();
