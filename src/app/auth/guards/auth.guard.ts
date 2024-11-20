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
import { UsersService } from '@app/users/services';
import { DecodedIdToken } from 'firebase-admin/auth';
import { UserDocument } from '@app/users/schemas';
import { FirebaseService } from '@modules/firebase/services';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private users: UsersService,
        private firebase: FirebaseService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        const token = this.extractBearerToken(request);
        if (isNil(token))
            throw new UnauthorizedException(
                'Bearer token not present in request headers',
            );

        const [decodeErr, decodedToken] = await to(
            this.authService.decodeToken(token),
        );
        if (!isNil(decodeErr)) throw new UnauthorizedException('Invalid token');

        const user = await this.upsertUserForToken(decodedToken);
        request['user'] = user;

        return true;
    }

    private extractBearerToken(request: Request): string {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private async upsertUserForToken(
        token: DecodedIdToken,
    ): Promise<UserDocument> {
        const firebaseUser = await this.firebase.auth.getUser(token.uid);

        let user = await this.users.findOrCreate(
            {
                $or: [
                    { firebaseId: firebaseUser.uid },
                    { email: firebaseUser.email },
                ],
            },
            {
                email: firebaseUser.email,
                name: firebaseUser.displayName,
                firebaseId: firebaseUser.uid,
            },
        );

        if (isNil(user.firebaseId))
            user = await this.users.updateById(user._id, {
                firebaseId: firebaseUser.uid,
            });

        return user;
    }
}
