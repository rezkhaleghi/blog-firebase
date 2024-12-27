import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './domain/entities/blog.entity';
import { User } from './domain/entities/user.entity';
import { AuthService } from './application/services/auth.service';
import { FirebaseAdminService } from './infrastructure/firebase/firebase-admin.service';
import { BlogService } from './application/services/blog.service';
import { FirebaseAuthGuard } from './api/guards/firebase-auth-guard';
import { AuthController } from './api/controllers/v1/auth.controller';
import { BlogController } from './api/controllers/v1/blog.controller';
import { UserService } from './application/services/user.service';
import { UserController } from './api/controllers/v1/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Blog],
      synchronize: true, // Disable in production
      logging: false,
    }),
    TypeOrmModule.forFeature([User, Blog]),
  ],
  providers: [
    FirebaseAdminService,
    AuthService,
    BlogService,
    FirebaseAuthGuard,
    UserService,
  ],
  controllers: [AuthController, BlogController, UserController],
})
export class AppModule {}
