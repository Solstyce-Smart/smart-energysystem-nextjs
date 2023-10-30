import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';

const httpsOptions = {
  key: fs.readFileSync('./secrets/cert.key'),
  cert: fs.readFileSync('./secrets/cert.crt'),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true, httpsOptions });

  const config = new DocumentBuilder()
    .setTitle('SMART - ENERGYSYSTEM')
    .setDescription('Endpoints for the SMART - ENERGYSYSTEM')
    .setVersion('1.0')
    .addTag('smart-energysystem')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3001);
}
bootstrap();
