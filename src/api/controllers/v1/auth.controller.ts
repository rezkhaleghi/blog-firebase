import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from 'src/application/services/auth.service';
import { AuthDto } from 'src/application/DTOs/auth.dto';
import { Response } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async registerUser(@Body() authDto: AuthDto, @Res() res: Response) {
    try {
      const response = await this.authService.registerUser(authDto);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'User registered successfully',
        data: response,
        error: null,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal Server Error',
        data: null,
        error: error.message,
      });
    }
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async loginUser(@Body() authDto: AuthDto, @Res() res: Response) {
    try {
      const { idToken, refreshToken, expiresIn } =
        await this.authService.loginUser(authDto);

      res.cookie('idToken', idToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'User logged in successfully',
        data: { idToken, refreshToken, expiresIn },
        error: null,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal Server Error',
        data: null,
        error: error.message,
      });
    }
  }

  @Post('logout')
  async logoutUser(@Res() res: Response) {
    try {
      res.clearCookie('idToken');

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'User logged out successfully',
        data: null,
        error: null,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal Server Error',
        data: null,
        error: error.message,
      });
    }
  }
}
