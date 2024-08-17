import { Injectable } from '@nestjs/common';
import { DecodedIdToken, UserRecord } from 'firebase-admin/auth';
import { FirebaseService } from 'src/modules/firebase/services';

@Injectable()
export class AuthService {
    constructor(private firebase: FirebaseService) {}

    async decodeToken(token: string): Promise<DecodedIdToken> {
        return await this.firebase.auth.verifyIdToken(token);
    }

    async getUser(token: string): Promise<UserRecord> {
        const { uid } = await this.decodeToken(token);

        return this.firebase.auth.getUser(uid);
    }
}
