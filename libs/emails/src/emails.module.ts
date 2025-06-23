import { Module } from '@nestjs/common';
import { EmailsService } from './services';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [EmailsService],
    controllers: [],
    exports: [EmailsService],
})
export class EmailsModule {}
