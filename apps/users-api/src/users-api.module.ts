import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { cert } from 'firebase-admin/app';
import { AuthModule } from '@shared/auth';
import {
    ENVIRONMENT_CONFIGURATION_FACTORY,
    EnvironmentConfig,
} from '@shared/config';
import { FirebaseModule } from '@shared/firebase';
import { UsersModule } from '@shared/users';
import { UsersController } from './controllers';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [ENVIRONMENT_CONFIGURATION_FACTORY],
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService<EnvironmentConfig>) => ({
                ...config.get('mongo'),
                retryWrites: true,
            }),
        }),
        FirebaseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService<EnvironmentConfig>) => ({
                credential: cert(
                    config.get('firebase.serviceAccount', { infer: true }),
                ),
            }),
        }),
        AuthModule,
        UsersModule,
    ],
    providers: [],
    controllers: [UsersController],
    exports: [],
})
export class UsersApiModule {}
