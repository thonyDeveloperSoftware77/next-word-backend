/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LarnController } from './learn.controller';
import { LearnService } from './learn.service';
import { Card } from 'src/card/entity/card.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningHistory } from './entity/learnHistory.entity';
import { StudentCourse } from 'src/student/entities/courseStudent.entity';
import { Course } from 'src/course/entities/course.entity';
import { Student } from 'src/student/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), TypeOrmModule.forFeature([LearningHistory]), TypeOrmModule.forFeature([StudentCourse]) , TypeOrmModule.forFeature([Course]) , TypeOrmModule.forFeature([Student])],
  controllers: [LarnController],
  providers: [LearnService],
})


export class LearnModule {}