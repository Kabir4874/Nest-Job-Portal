import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';
import { RegisterUserDto } from './dto/user.dto';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const {
      fullName,
      email,
      phoneNumber,
      password,
      profileBio,
      profileSkills,
      profileResume,
      profileResumeOriginalName,
      profilePhoto,
      role,
    } = registerUserDto;

    if (!fullName || !email || !phoneNumber || !password) {
      throw new BadRequestException('All fields are required');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists with this emial');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        fullName,
        email,
        phoneNumber,
        password: hashedPassword,
        profileBio,
        profileSkills,
        profileResume,
        profileResumeOriginalName,
        profilePhoto,
        role,
      },
    });
    if (!user) {
      throw new BadRequestException('User not created');
    }
    return { user, success: true, message: 'Successfully user created' };
  }

  async login(email: string, password: string, role: string) {
    if (!email || !password || !role) {
      throw new BadRequestException('All fields are required');
    }
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not exist');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('Incorrect password');
    }
    if (role !== user.role) {
      throw new BadRequestException("Account doesn't exist with current role");
    }

    const token = this.jwtService.sign(
      { userId: user.id },
      { secret: process.env.SECRET_KEY, expiresIn: '1d' },
    );
    return { token, user, success: true, message: 'Login successful' };
  }
}
