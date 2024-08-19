import { Inject, Injectable } from '@nestjs/common';
import { initializeApp, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getMessaging, Messaging } from 'firebase-admin/messaging';
import { FIREBASE_OPTIONS } from '../constants';
import { FirebaseOptions } from '../interfaces';

@Injectable()
export class FirebaseService {
    private firebaseApp: App;
    private firebaseAuth: Auth;
    private firebaseMessaging: Messaging;

    constructor(@Inject(FIREBASE_OPTIONS) options: FirebaseOptions) {
        this.firebaseApp = initializeApp(options);

        this.firebaseAuth = getAuth(this.firebaseApp);
        this.firebaseMessaging = getMessaging(this.firebaseApp);
    }

    get app(): App {
        return this.firebaseApp;
    }

    get auth(): Auth {
        return this.firebaseAuth;
    }

    get messaging(): Messaging {
        return this.firebaseMessaging;
    }
}
