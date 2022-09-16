import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

interface IUserUpdate {
  bio: string;
  image: string;
  email: string;
  username: string;
  password: string;
}

interface ITransformUser {
  email: string;
  picture: string;
  nickname: string;
  password: string;
  user_metadata: {
    bio: string;
  };
}

@Injectable()
export class UserPipe implements PipeTransform {
  transform(value: IUserUpdate, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      console.log('VAL,', value);
      const transformBody = <ITransformUser>{};
      if (value.email) {
        transformBody.email = value.email;
      }
      if (value.password) {
        transformBody.password = value.password;
      }
      if (value.username) {
        transformBody.nickname = value.username;
      }
      if (value.image) {
        transformBody.picture = value.image;
      }
      if (value.bio) {
        transformBody.user_metadata = { bio: value.bio };
      }
      return transformBody;
    }
    return value;
  }
}
