import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Nest app api ')
    .setDescription('The first APIs nest')
    .setVersion('1.0')
    .addTag('I love nest')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/client', app, document);

  await app.listen(8080);
}
bootstrap();
