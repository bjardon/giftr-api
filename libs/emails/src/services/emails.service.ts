import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    TransactionalEmailsApi,
    TransactionalEmailsApiApiKeys,
} from '@getbrevo/brevo';
import { EnvironmentConfig } from '@shared/config';

@Injectable()
export class EmailsService {
    private client: TransactionalEmailsApi;

    constructor(private readonly config: ConfigService<EnvironmentConfig>) {
        this.client = new TransactionalEmailsApi();
        this.client.setApiKey(
            TransactionalEmailsApiApiKeys.apiKey,
            this.config.get('brevo.apiKey', { infer: true }),
        );
    }

    async sendEmail(email: {
        subject?: string;
        htmlContent?: string;
        sender?: { name: string; email: string };
        to: { email: string; name: string }[];
        replyTo?: { email: string; name: string };
        params?: object;
        templateId?: number;
    }) {
        return this.client.sendTransacEmail({ ...email });
    }
}
