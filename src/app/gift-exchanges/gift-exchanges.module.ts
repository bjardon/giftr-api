import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTIONS } from '@app/gift-exchanges/constants';
import {
    ParticipantSchema,
    GiftExchangeSchema,
} from '@app/gift-exchanges/schemas';
import {
    ParticipantsService,
    GiftExchangesService,
} from '@app/gift-exchanges/services';
import {
    GiftExchangeParticipantsController,
    GiftExchangesController,
    ParticipantsController,
} from '@app/gift-exchanges/controllers';

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
        ]),
    ],
    providers: [GiftExchangesService, ParticipantsService],
    controllers: [
        GiftExchangesController,
        ParticipantsController,
        GiftExchangeParticipantsController,
    ],
    exports: [GiftExchangesService],
})
export class GiftExchangesModule {}
