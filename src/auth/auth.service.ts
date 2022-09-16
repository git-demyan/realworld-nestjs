import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { map, lastValueFrom, catchError } from 'rxjs';
// import { UserEntity } from '../user/dto/user.entity'; // path?

const EVERY_23_HOURS = '0 0-23/23 * * *';

@Injectable()
export class AuthService implements OnModuleInit {
  private token: string;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  onModuleInit() {
    console.log('TOOOK', this.token);
    this.setAuthToken(); // get auth0 token on app startup
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  public async setAuthToken() {
    const AUTH0_DOMAIN = this.configService.get<string>('AUTH0_DOMAIN');
    const AUTH0_CLIENT_ID = this.configService.get<string>('AUTH0_CLIENT_ID');
    const AUTH0_CLIENT_SECRET = this.configService.get<string>(
      'AUTH0_CLIENT_SECRET',
    );
    const AUTH0_AUDIENCE = this.configService.get<string>('AUTH0_AUDIENCE');

    const body = {
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      audience: `${AUTH0_AUDIENCE}/`,
      grant_type: 'client_credentials',
    };

    return await lastValueFrom(
      this.httpService
        .post(`${AUTH0_DOMAIN}/oauth/token`, body)
        .pipe(
          map((res) => {
            console.log('schedule: get auth token');
            this.token = res.data.access_token;
            return res.data.access_token;
          }),
        )
        .pipe(
          catchError((e) => {
            console.log('here?');
            throw new HttpException(e.response.data, e.response.status);
          }),
        ),
    );
  }

  public getAuthToken(): string {
    return this.token;
  }

  // public async getUser(token: string) {
  //   const userinfo: UserEntity = await lastValueFrom(
  //     this.httpService
  //       .get('https://dev-1kdczm5r.us.auth0.com/userinfo', {
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
