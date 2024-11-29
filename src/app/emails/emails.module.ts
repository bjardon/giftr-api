import { Global, Module } from '@nestjs/common';
import { EmailsService } from './services';

@Global()
@Module({
    imports: [],
    providers: [EmailsService],
    controllers: [],
    exports: [EmailsService],
})
export class EmailsModule {}
