/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';
import * as cors from 'cors';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as cookieParser from 'cookie-parser'; // Importar cookie-parser

const logger = new Logger('HTTP'); // Instancia del logger global

// Middleware personalizado para registrar solicitudes
const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { method, originalUrl } = req;

  // Escuchar el evento 'finish' de la respuesta para registrar el estado
  res.on('finish', () => {
    const { statusCode } = res;
    logger.log(`[${method}] ${originalUrl} - ${statusCode}`);
  });

  next();
};

@Module({
  imports: [AppModule],
})
class ApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requestLoggerMiddleware).forRoutes('*'); // Aplicar a todas las rutas
  }
}

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.useGlobalFilters(new AllExceptionsFilter());
   // Habilitar middleware de cookies
   app.use(cookieParser());

  app.use(
    cors({
      origin: true,
      credentials: true
    }),
  );

  await app.listen(3001);
  logger.log('Application is running on http://localhost:3001');
}
bootstrap();
