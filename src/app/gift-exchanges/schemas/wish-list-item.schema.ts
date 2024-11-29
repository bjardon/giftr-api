import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { COLLECTIONS } from '@app/gift-exchanges/constants';

@Schema({
    id: false,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: false, getters: false },
})
export class WishListItemEntity {
    @Prop({
        type: String,
        required: true,
    })
    name: string;

    @Prop({
        type: String,
        required: true,
    })
    linkOrStore: string;

    @Prop({
        type: SchemaTypes.ObjectId,
        required: true,
    })
    _participant: Types.ObjectId;
}

const _WishListItemSchemaFactory = () => {
    const schema = SchemaFactory.createForClass(WishListItemEntity);

    schema.virtual('participant', {
        ref: COLLECTIONS.Participant,
        localField: '_participant',
        foreignField: '_id',
        justOne: true,
    });

    return schema;
};

export const WishListItemSchema = _WishListItemSchemaFactory();

export type WishListItemDocument = HydratedDocument<WishListItemEntity>;
