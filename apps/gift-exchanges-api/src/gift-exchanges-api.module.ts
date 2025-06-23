import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { cert } from 'firebase-admin/app';
import { AuthModule } from '@shared/auth';
import {
    ENVIRONMENT_CONFIGURATION_FACTORY,
    EnvironmentConfig,
} from '@shared/config';
import { EmailsModule } from '@shared/emails';
import { FirebaseModule } from '@shared/firebase';
import { UsersModule } from '@shared/users';
import { GIFT_EXCHANGES_MODULE_COLLECTIONS } from './constants';
import {
    GiftExchangeParticipantsController,
    GiftExchangesController,
    ParticipantsController,
    WishListItemsController,
    ParticipantWishListItemsController,
} from './controllers';
import {
    ParticipantSchema,
    GiftExchangeSchema,
    WishListItemSchema,
} from './schemas';
import {
    ParticipantsService,
    GiftExchangesService,
    WishListItemsService,
} from './services';

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
        MongooseModule.forFeatureAsync([
            {
                name: GIFT_EXCHANGES_MODULE_COLLECTIONS.GiftExchange,
                useFactory: () => GiftExchangeSchema,
            },
            {
                name: GIFT_EXCHANGES_MODULE_COLLECTIONS.Participant,
                useFactory: () => ParticipantSchema,
            },
            {
                name: GIFT_EXCHANGES_MODULE_COLLECTIONS.WishListItem,
                useFactory: () => WishListItemSchema,
            },
        ]),
        AuthModule,
        UsersModule,
        EmailsModule,
    ],
    providers: [
        GiftExchangesService,
        ParticipantsService,
        WishListItemsService,
    ],
    controllers: [
        GiftExchangesController,
        ParticipantsController,
        WishListItemsController,
        GiftExchangeParticipantsController,
        ParticipantWishListItemsController,
    ],
    exports: [],
})
export class GiftExchangesApiModule {}
