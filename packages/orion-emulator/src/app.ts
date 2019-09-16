import { NestFactory, NestApplication } from '@nestjs/core';
import { AppModule } from './app.module';

let app: NestApplication

export default async function () {
    if (app) return app

    app = await NestFactory.create(AppModule)

    return app
}
