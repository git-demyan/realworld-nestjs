import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const isToken = this.authService.getAuthToken();

    if (isToken) {
      next();
    } else {
      this.authService
        .setAuthToken()
        .then(() => next())
        .catch((err) => next(new HttpException(err.response, err.status)));
    }
  }
}
