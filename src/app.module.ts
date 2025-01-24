/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { GatewayModule } from './websocket/websocket.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherModule } from './teacher/teacher.module';
import { ConfigModule } from '@nestjs/config';
import { VerifyModule } from './verify/verify.module';
import { CourseModule } from './course/course.module';
import { StudentModule } from './student/student.module';
import { CardModule } from './card/card.module';
import { CardSimilarModule } from './card_simility/card.module';
import { LearnModule } from './learn/learn.module';
import { AuthModule } from './auth/auth.modulte';
import { EncryptService } from './auth/encrypt.service';

@Module({
  imports: [
    GatewayModule,
    TeacherModule,
    CourseModule,
    StudentModule,
    CardModule,
    CardSimilarModule,
    VerifyModule,
    LearnModule,
    AuthModule,
    
    ConfigModule.forRoot({ cache: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Dirección del servidor
      port: 5432, // Puerto por defecto para PostgreSQL
      username: 'postgres', // Usuario de PostgreSQL
      password: 'admin', // Contraseña del usuario
      database: 'NextWordBD', // Nombre de tu base de datos
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Ubicación de las entidades
      synchronize: false, // Mantén en false si no deseas modificar la estructura de tablas automáticamente
      ssl: false, // Desactiva SSL para conexiones locales
    }),
    
  ],
  controllers: [],
  providers: [EncryptService],
})
export class AppModule { }
