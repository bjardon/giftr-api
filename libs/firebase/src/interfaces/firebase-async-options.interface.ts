import { ModuleMetadata, Type } from '@nestjs/common';
import { FirebaseOptionsFactory } from './firebase-options-factory.interface';
import { FirebaseOptions } from './firebase-options.interface';

export interface FirebaseAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    inject?: any[];
    useExisting?: Type<FirebaseOptionsFactory>;
    useClass?: Type<FirebaseOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<FirebaseOptions> | FirebaseOptions;
}
