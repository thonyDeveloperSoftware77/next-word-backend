/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Student } from "./entities/student.entity";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";
import { FirebaseModule } from "src/firebase/firebase.module";
import { Course } from "src/course/entities/course.entity";
import { StudentCourse } from "./entities/courseStudent.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Course]),TypeOrmModule.forFeature([StudentCourse]),TypeOrmModule.forFeature([Student]), FirebaseModule],
    controllers: [StudentController],
    providers: [StudentService],
})

export class StudentModule {}