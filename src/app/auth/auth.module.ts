import { Global, Module } from '@nestjs/common';
import { AuthService } from './services';
import { AuthGuard } from './guards';

@Global()
@Module({
    providers: [AuthService, AuthGuard],
    exports: [AuthService, AuthGuard],
})
export class AuthModule {}
