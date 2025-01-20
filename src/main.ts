import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpErrorFilter } from './common/http-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Activer la validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non spécifiées dans les DTOs
      forbidNonWhitelisted: true, // Génère une erreur pour les propriétés inconnues
      transform: true, // Transforme les types primitifs automatiquement
    }),
  );

  // Appliquer le gestionnaire d'erreurs global
  app.useGlobalFilters(new HttpErrorFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
