import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, lastValueFrom, map } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  public async getUserInfo(id: string) {
    const AUTH0_AUDIENCE = this.configService.get<string>('AUTH0_AUDIENCE');
    const token = this.authService.getAuthToken();

    const userinfo = await lastValueFrom(
      this.httpService
        .get(`${AUTH0_AUDIENCE}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          map((res) => {
            console.log('_getUser', res.data);
            return {
              email: res.data.email,
              username: res.data.nickname,
              bio: res.data?.user_metadata?.bio || '',
              image: res.data.picture,
            };
          }),
        )
        .pipe(
          catchError((e) => {
            throw new HttpException(e.response.data, e.response.status);
          }),
        ),
    );
    return userinfo;
  }

  public async updateUser(id: string, body: UpdateUserDto) {
    console.log('id', id, 'bbb', body);
    const AUTH0_AUDIENCE = this.configService.get<string>('AUTH0_AUDIENCE');
    console.log(`${AUTH0_AUDIENCE}/users/${id}`);
    const token = this.authService.getAuthToken();

    const userinfo = await lastValueFrom(
      this.httpService
        .patch(`${AUTH0_AUDIENCE}/users/${id}`, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          map((res) => {
            return {
              email: res.data.email,
              username: res.data.nickname,
              bio: res.data?.user_metadata?.bio || '',
              image: res.data.picture,
            };
          }),
        )
        .pipe(
          catchError((e) => {
            throw new HttpException(e.response.data, e.response.status);
          }),
        ),
    );
    return userinfo;
  }

  // public async getUser(token: string) {
  //   const AUTH0_DOMAIN = this.configService.get<string>('AUTH0_DOMAIN');

  //   const userinfo: UserEntity = await lastValueFrom(
  //     this.httpService
  //       .get(`${AUTH0_DOMAIN}/userinfo`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .pipe(
  //         map((res) => {
  //           return {
  //             token,
  //             email: res.data.email,
  //             username: res.data.nickname,
  //             bio: res.data?.user_metadata?.bio || '',
  //             image: res.data.picture,
  //           };
  //         }),
  //       )
  //       .pipe(
  //         catchError((e) => {
  //           throw new HttpException(e.response.data, e.response.status);
  //         }),
  //       ),
  //   );

  //   return userinfo;
  // }
}
