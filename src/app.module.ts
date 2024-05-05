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

@Module({
  imports: [
    GatewayModule,
    TeacherModule,
    CourseModule,
    StudentModule,
    CardModule,
    CardSimilarModule,
    VerifyModule,
    ConfigModule.forRoot({ cache: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // reemplaza con tu host
      port: 5432, // reemplaza con tu puerto
      username: 'postgres', // reemplaza con tu nombre de usuario
      password: 'admin', // reemplaza con tu contraseña
      database: 'NextWordBD', // reemplaza con tu nombre de base de datos
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // establece en false para no sobrescribir las tablas existentes
    })],
  controllers: [],
  providers: [],
})
export class AppModule { }
