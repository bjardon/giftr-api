import { Inject, Injectable } from '@nestjs/common';
import { initializeApp, App } from 'firebase-admin/app';
import { FIREBASE_OPTIONS } from '../constants';
import { FirebaseOptions } from '../interfaces';

@Injectable()
export class FirebaseService {
    private firebaseApp: App;

    constructor(@Inject(FIREBASE_OPTIONS) options: FirebaseOptions) {
        this.firebaseApp = initializeApp(options);
    }

    get admin(): App {
        return this.firebaseApp;
    }
}
