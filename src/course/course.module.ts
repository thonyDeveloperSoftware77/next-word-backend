/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Course } from "./entities/course.entity";
import { FirebaseModule } from "src/firebase/firebase.module";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";
import { Teacher } from "src/teacher/entities/teacher.entity";
import { CourseStudent } from "./entities/course.student.entity";
import { Student } from "src/student/entities/student.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Course]), FirebaseModule,TypeOrmModule.forFeature([Teacher]),  TypeOrmModule.forFeature([CourseStudent]), TypeOrmModule.forFeature([Student]) ],
    controllers: [CourseController],
    providers: [CourseService]
})

export class CourseModule {}