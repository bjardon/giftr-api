import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTIONS } from '@app/gift-exchanges/constants';
import {
    ParticipantSchema,
    GiftExchangeSchema,
    WishListItemSchema,
} from '@app/gift-exchanges/schemas';
import {
    ParticipantsService,
    GiftExchangesService,
    WishListItemsService,
} from '@app/gift-exchanges/services';
import {
    GiftExchangeParticipantsController,
    GiftExchangesController,
    ParticipantsController,
} from '@app/gift-exchanges/controllers';
import { WishListItemsController } from './controllers/wish-list-items.controller';
import { ParticipantWishListItemsController } from './controllers/participant-wish-list-items.controller';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: COLLECTIONS.GiftExchange,
                useFactory: () => GiftExchangeSchema,
            },
            {
                name: COLLECTIONS.Participant,
                useFactory: () => ParticipantSchema,
            },
            {
                name: COLLECTIONS.WishListItem,
                useFactory: () => WishListItemSchema,
            },
        ]),
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
    exports: [GiftExchangesService, ParticipantsService, WishListItemsService],
})
export class GiftExchangesModule {}
