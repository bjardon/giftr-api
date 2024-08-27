import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
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
        required: true,
        trim: true,
    })
    firebaseId: string;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);

export type UserDocument = HydratedDocument<UserEntity>;
