import { FirebaseOptions } from './firebase-options.interface';

export interface FirebaseOptionsFactory {
    createFirebaseOptions(): Promise<FirebaseOptions> | FirebaseOptions;
}
