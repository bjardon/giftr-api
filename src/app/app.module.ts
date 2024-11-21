import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { cert } from 'firebase-admin/app';
import { FirebaseModule } from '@modules/firebase';
import {
    ENVIRONMENT_CONFIGURATION_FACTORY,
    EnvironmentConfig,
} from '@config/environment';
import { AuthModule } from '@app/auth';
import { UsersModule } from '@app/users';
import { GiftExchangesModule } from '@app/gift-exchanges';

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
        GiftExchangesModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
