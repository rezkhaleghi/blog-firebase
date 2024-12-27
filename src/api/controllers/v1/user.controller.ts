import {
  Controller,
  Get,
  UseGuards,
  Req,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { UserService } from 'src/application/services/user.service';
import { FirebaseAuthGuard } from 'src/api/guards/firebase-auth-guard';
import { Request, Response } from 'express';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(FirebaseAuthGuard)
  async getProfile(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req['user'];
      const response = await this.userService.profile(user.userId);

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
}
