/* eslint-disable prettier/prettier */
// teacher.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { Teacher } from './entities/teacher.entity';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher]), FirebaseModule],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}