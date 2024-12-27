import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseAdminService } from 'src/infrastructure/firebase/firebase-admin.service';
import { UserService } from 'src/application/services/user.service';
import { Request } from 'express';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeaderOrCookie(request);
    console.log('Token:', token);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decodedToken = await this.firebaseAdminService
        .getAuth()
        .verifyIdToken(token);

      const user = await this.userService.findByFirebaseId(decodedToken.uid);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      decodedToken.userId = user.id;
      console.log('Decoded Token:', decodedToken);

      request['user'] = decodedToken;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  private extractTokenFromHeaderOrCookie(request: Request): string | null {
    const authorization = request.headers.authorization;
    if (authorization) {
      const [type, token] = authorization.split(' ');
      if (type === 'Bearer') {
        return token;
      }
    }
    return request.cookies['idToken'] || null;
  }
}
