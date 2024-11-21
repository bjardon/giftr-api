import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTIONS } from '@app/users/constants';
import { UsersController } from '@app/users/controllers';
import { UserSchema } from '@app/users/schemas';
import { UsersService } from '@app/users/services';

@Global()
@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            { name: COLLECTIONS.User, useFactory: () => UserSchema },
        ]),
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
