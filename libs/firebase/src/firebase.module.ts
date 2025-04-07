import { DynamicModule, Module, Provider } from '@nestjs/common';
import { AppOptions } from 'firebase-admin';
import { FIREBASE_OPTIONS } from './constants';
import { FirebaseService } from './services';
import { FirebaseAsyncOptions } from './interfaces';

@Module({})
export class FirebaseModule {
    static forRoot(options: AppOptions): DynamicModule {
        return {
            module: FirebaseModule,
            global: true,
            providers: [
                { provide: FIREBASE_OPTIONS, useValue: options },
                FirebaseService,
            ],
            exports: [FirebaseService],
        };
    }

    static forRootAsync(options: FirebaseAsyncOptions): DynamicModule {
        return {
            module: FirebaseModule,
            global: true,
            imports: options.imports || [],
            providers: [this.createAsyncProviders(options), FirebaseService],
            exports: [FirebaseService],
        };
    }

    private static createAsyncProviders(
        options: FirebaseAsyncOptions,
    ): Provider {
        if (options.useFactory)
            return {
                provide: FIREBASE_OPTIONS,
                inject: options.inject || [],
                useFactory: options.useFactory,
            };

        if (options.useClass)
            return {
                provide: FIREBASE_OPTIONS,
                useClass: options.useClass,
            };

        return {
            provide: FIREBASE_OPTIONS,
            useExisting: options.useExisting,
        };
    }
}
