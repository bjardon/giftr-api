import { NestFactory } from '@nestjs/core';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@codegenie/serverless-express';
import { UsersApiModule } from './users-api.module';

let server: Handler;

async function bootstrap() {
    const microservice = await NestFactory.create(UsersApiModule);
    microservice.enableCors({ origin: '*' });

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
