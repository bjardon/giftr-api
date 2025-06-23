import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USERS_MODULE_COLLECTIONS } from './constants';
import { UserSchema } from './schemas';
import { UsersService } from './services';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: USERS_MODULE_COLLECTIONS.User,
                useFactory: () => UserSchema,
            },
        ]),
    ],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
