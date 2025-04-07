import { Module } from '@nestjs/common';
import { FirebaseModule } from '@shared/firebase';
import { UsersModule } from '@shared/users';
import { AuthService } from './services';
import { AuthGuard } from './guards';

@Module({
    imports: [FirebaseModule, UsersModule],
    providers: [AuthService, AuthGuard],
    exports: [AuthService, AuthGuard],
})
export class AuthModule {}
