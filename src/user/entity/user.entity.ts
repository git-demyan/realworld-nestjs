import { Expose } from 'class-transformer';

export class UserEntity {
  bio: string;
  email: string;
  // token: string;
  image: string;

  @Expose({ name: 'username' })
  nickname: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
