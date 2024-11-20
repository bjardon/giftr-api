import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: false },
})
export class UserEntity {
    @Prop({
        type: String,
        required: true,
        unique: true,
        trim: true,
    })
    email: string;

    @Prop({
        type: String,
        trim: true,
        default: '',
    })
    name: string;

    @Prop({
        type: String,
        trim: true,
        default: null,
    })
    firebaseId: string;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);

export type UserDocument = HydratedDocument<UserEntity>;
