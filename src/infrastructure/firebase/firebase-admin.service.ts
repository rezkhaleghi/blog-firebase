import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  onModuleInit() {
    // Ensure all required environment variables are set
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      throw new Error(
        'Missing Firebase configuration in environment variables.',
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }

  // Method to return Firebase Auth instance
  getAuth() {
    return admin.auth();
  }
}
