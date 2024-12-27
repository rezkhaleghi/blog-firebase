import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { FirebaseAdminService } from './firebase-admin.service';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  constructor(private readonly firebaseAdminService: FirebaseAdminService) {
    super();
  }

  async validate(req: any): Promise<any> {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      throw new Error('No token provided');
    }

    const decodedToken = await this.firebaseAdminService
      .getAuth()
      .verifyIdToken(token);
    return { uid: decodedToken.uid, email: decodedToken.email };
  }
}
