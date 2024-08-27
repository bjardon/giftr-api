import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from '@app/users/controllers';
import { UserEntity, UserSchema } from '@app/users/schemas';
import { UsersService } from '@app/users/services';

@Global()
@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            { name: UserEntity.name, useFactory: () => UserSchema },
        ]),
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
