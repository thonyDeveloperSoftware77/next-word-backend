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
    ConfigModule.forRoot({ cache: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-coul16ol6cac73b6bro0-a.oregon-postgres.render.com', // reemplaza con tu host
      port: 5432, // reemplaza con tu puerto
      username: 'nextwordbd_user', // reemplaza con tu nombre de usuario
      password: '0HCo5GTKNY3DotBoN4HDeBATbXU9ZQ75', // reemplaza con tu contraseña
      database: 'nextwordbd', // reemplaza con tu nombre de base de datos
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // establece en false para no sobrescribir las tablas existentes
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    })],
  controllers: [],
  providers: [],
})
export class AppModule { }
