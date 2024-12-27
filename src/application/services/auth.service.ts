import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FirebaseAdminService } from 'src/infrastructure/firebase/firebase-admin.service';
import { AuthDto } from 'src/application/DTOs/auth.dto';
import { UserService } from 'src/application/services/user.service';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly userService: UserService,
  ) {}

  async registerUser(authDto: AuthDto) {
    try {
      // Create user in Firebase
      const userRecord = await this.firebaseAdminService.getAuth().createUser({
        email: authDto.email,
        password: authDto.password,
      });

      // Create user in our db
      await this.userService.create({
        email: userRecord.email,
        role: 0,
        firebaseId: userRecord.uid,
      });

      return userRecord;
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async loginUser(authDto: AuthDto) {
    const { email, password } = authDto;
    try {
      const { idToken, refreshToken, expiresIn } =
        await this.signInWithEmailAndPassword(email, password);

      return { idToken, refreshToken, expiresIn };
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error.message;
        if (errorMessage.includes('EMAIL_NOT_FOUND')) {
          throw new UnauthorizedException('User not found.');
        } else if (errorMessage.includes('INVALID_PASSWORD')) {
          throw new UnauthorizedException('Invalid password.');
        } else {
          throw new UnauthorizedException(errorMessage);
        }
      } else {
        throw new UnauthorizedException(error.message);
      }
    }
  }

  private async signInWithEmailAndPassword(email: string, password: string) {
    try {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`;

      return await this.sendPostRequest(url, {
        email,
        password,
        returnSecureToken: true,
      });
    } catch (error) {
      // console.error('Error signing in with email and password:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  private async sendPostRequest(url: string, data: any) {
    try {
      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Error in sendPostRequest:', error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
