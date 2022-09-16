import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Query,
  Req,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';

import { Request } from 'express';
import { UserPipe } from 'src/user.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getUser(@Req() req: Request, @Query('id') id: string) {
    // TODO: using Query param for Postman testing
    const userInfo = await this.userService.getUserInfo(
      id || req.oidc.user?.sub,
    );
    return userInfo;
  }

  @Patch()
  @UsePipes(new UserPipe())
  async updateUser(
    @Req() req: Request,
    @Query('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // TODO: using Query param for Postman testing
    const userInfo = await this.userService.updateUser(
      id || req.oidc.user?.sub,
      updateUserDto,
    );
    return userInfo;
  }
}
