import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '@app/auth/services';
import { Request } from 'express';
import { isNil } from 'lodash';
import to from 'await-to-js';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        const token = this.extractBearerToken(request);
        if (isNil(token))
            throw new UnauthorizedException(
                'Bearer token not present in request headers',
            );

        const [decodeErr] = await to(this.authService.decodeToken(token));
        if (!isNil(decodeErr)) throw new UnauthorizedException('Invalid token');

        return true;
    }

    private extractBearerToken(request: Request): string {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
