import { Global, Module } from '@nestjs/common';
import { AuthService } from '@app/auth/services';
import { AuthGuard } from '@app/auth/guards';

@Global()
@Module({
    providers: [AuthService, AuthGuard],
    exports: [AuthService, AuthGuard],
})
export class AuthModule {}
