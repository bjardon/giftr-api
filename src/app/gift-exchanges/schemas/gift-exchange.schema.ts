import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, HydratedDocument } from 'mongoose';

@Schema()
export class GiftExchangeEntity {
    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    title: string;

    @Prop({
        type: String,
        required: false,
        default: null,
    })
    topic: string;

    @Prop({
        type: String,
        required: false,
        default: null,
    })
    instructions: string;

    @Prop({
        type: Number,
        required: false,
        default: null,
    })
    budget: number;

    @Prop({
        type: Date,
        required: false,
        default: null,
    })
    scheduledOn: Date;

    @Prop({
        type: Date,
        required: false,
        default: null,
    })
    drawnOn: Date;

    @Prop({
        type: SchemaTypes.ObjectId,
        required: true,
    })
    _organizer: Types.ObjectId;

    get formattedScheduledOn(): string {
        return this.scheduledOn.toLocaleDateString('es-MX');
    }

    get formattedBudget(): string {
        return Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(this.budget);
    }
}

const _GiftExchangeSchemaFactory = () => {
    const schema = SchemaFactory.createForClass(GiftExchangeEntity);
    schema.loadClass(GiftExchangeEntity);

    return schema;
};

export const GiftExchangeSchema = _GiftExchangeSchemaFactory();

export type GiftExchangeDocument = HydratedDocument<GiftExchangeEntity>;
