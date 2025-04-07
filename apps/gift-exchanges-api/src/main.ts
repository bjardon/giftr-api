import { NestFactory } from '@nestjs/core';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@codegenie/serverless-express';
import { GiftExchangesApiModule } from './gift-exchanges-api.module';

let server: Handler;

async function bootstrap() {
    const microservice = await NestFactory.create(GiftExchangesApiModule);
    await microservice.init();

    const expressApp = microservice.getHttpAdapter().getInstance();
    return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback,
) => {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
};
