import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(helmet());

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`app is running on port ${PORT}`);
}
bootstrap();
