import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ENVIRONMENT_CONFIGURATION_FACTORY, EnvironmentConfig } from './config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [ENVIRONMENT_CONFIGURATION_FACTORY],
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                appName: config.get<string>('MONGO_NAME'),
                uri: config.get<string>('MONGO_URI'),
                user: config.get<string>('MONGO_USER'),
                pass: config.get<string>('MONGO_PASS'),
                retryWrites: true,
            }),
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
