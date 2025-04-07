import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { USERS_MODULE_COLLECTIONS, UserDocument } from '@shared/users';
import { GIFT_EXCHANGES_MODULE_COLLECTIONS } from '../constants';
import { WishListItemDocument } from './wish-list-item.schema';

@Schema({
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: false },
})
export class ParticipantEntity {
    @Prop({
        type: String,
        required: false,
        default: null,
    })
    address: string;

    @Prop({
        type: Date,
        required: false,
        default: Date.now(),
    })
    addedOn: Date;

    @Prop({
        type: Date,
        required: false,
        default: null,
    })
    acknowledgedOn: Date;

    @Prop({
        type: SchemaTypes.ObjectId,
        required: true,
    })
    _exchange: Types.ObjectId;

    @Prop({
        type: SchemaTypes.ObjectId,
        required: true,
    })
    _user: Types.ObjectId;

    @Prop({
        type: SchemaTypes.ObjectId,
        required: false,
        default: null,
    })
    _giftee: Types.ObjectId;

    user?: UserDocument;
    giftee?: UserDocument;
    wishList?: WishListItemDocument[];
}

const _ParticipantSchemaFactory = () => {
    const schema = SchemaFactory.createForClass(ParticipantEntity);

    schema.virtual('user', {
        ref: USERS_MODULE_COLLECTIONS.User,
        localField: '_user',
        foreignField: '_id',
        justOne: true,
    });

    schema.virtual('giftee', {
        ref: GIFT_EXCHANGES_MODULE_COLLECTIONS.Participant,
        localField: '_giftee',
        foreignField: '_id',
        justOne: true,
        options: {
            populate: ['user', 'wishList'],
        },
    });

    schema.virtual('wishList', {
        ref: GIFT_EXCHANGES_MODULE_COLLECTIONS.WishListItem,
        localField: '_id',
        foreignField: '_participant',
        justOne: false,
    });

    return schema;
};

export const ParticipantSchema = _ParticipantSchemaFactory();

export type ParticipantDocument = HydratedDocument<ParticipantEntity>;
