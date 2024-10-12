import { Body, Controller, Post, Res } from '@nestjs/common';
import { RegisterUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.userService.register(registerUserDto);
  }

  @Post('login')
  async login(@Body() body, @Res() res: Response) {
    const { email, password, role } = body;
    try {
      const userData = await this.userService.login(email, password, role);
      res.cookie('token', userData?.token, {
        maxAge: 1 * 24 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
      });
    } catch (error) {}
  }
}
