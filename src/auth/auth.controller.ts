import {
  Controller,
  Post,
  Get,
  HttpStatus,
  HttpCode,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/CreateUserDto';
import { signInDto } from './dto/signInDto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from 'src/prisma.service';
import { RequestWithUser } from './jwt.strategy';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // Routepour créer un utilisateur
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUp: CreateUserDto) {
    console.log('>>>>>>>data', signUp);
    return this.authService.register(signUp);
  }

  // Route pour se connecter
  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() authBody: signInDto) {
    console.log('login===>data>>>', authBody);
    let response = await this.authService.login(authBody);
    console.log('login response', response);

    return response;
  }

  // Route pour se connecter
  @Post('reset')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async reset(@Body() authBody: { email: string }) {
    console.log('login data reset====>>>>', authBody);
    let response = await this.authService.resetPasswordRequest(authBody);
    if (response!) {
      return response;
    }
  }
  //
  // Route pour se connecter
  @Post('reset-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async resetPassword(@Body() authBody: { now_password: string }) {
    console.log('reset-password data ======>>>', authBody);
    // let response =
    //   await this.authService.resetPasswordAccountDisconnet(authBody);
    // if (response!) {
    //   return response;
    // } else {
    //   //
    // }
    return;
  }
  // Route pour se connecter
  @Get('validate-reset-password')
  @HttpCode(HttpStatus.CREATED)
  async validateResetPassword(@Query('token') authBody: { token: string }) {
    console.log('validate-reset-password data ====>>>', authBody);
    let response = await this.authService.resetPasswordValidation(authBody);
    if (response!) {
      return response;
    } else {
      //
    }
    // return
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async authenticateUser(@Request() req: RequestWithUser) {
    // console.log(req.user);

    if (!req.user) {
      return 'back request';
    }
    const account = await this.prisma.account.findUnique({
      where: { user_id: req.user.user_id },
    });

    if (account) {
      return await this.userService.getUser(account.id);
    } else {
      return await this.userService.getUser(req.user.user_id);
    }
  }
}
