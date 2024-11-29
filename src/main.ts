import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');

    app.enableCors({
        origin: '*',
    });

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Giftr API')
        .setDescription(
            'A NestJS based backend implementation that supports the Giftr application.',
        )
        .setExternalDoc('GitHub Repo', 'https://github.com/bjardon/giftr-api')
        .addBearerAuth()
        .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('/docs', app, swaggerDocument);

    await app.listen(3000);
}

bootstrap();
