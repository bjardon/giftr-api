import { COLLECTIONS as USERS_COLLECTIONS } from '@app/users/constants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { COLLECTIONS } from '../constants';

@Schema({
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: false },
})
export class ParticipantEntity {
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
}

const _ParticipantSchemaFactory = () => {
    const schema = SchemaFactory.createForClass(ParticipantEntity);

    schema.virtual('user', {
        ref: USERS_COLLECTIONS.User,
        localField: '_user',
        foreignField: '_id',
        justOne: true,
    });

    schema.virtual('giftee', {
        ref: COLLECTIONS.Participant,
        localField: '_giftee',
        foreignField: '_id',
        justOne: true,
        options: {
            populate: ['user'],
        },
    });

    return schema;
};

export const ParticipantSchema = _ParticipantSchemaFactory();

export type ParticipantDocument = HydratedDocument<ParticipantEntity>;
