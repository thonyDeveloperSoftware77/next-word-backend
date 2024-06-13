/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { StudentService } from "./student.service";
import { Student } from "./entities/student.entity";
import { User } from "src/firebase/user.decorator";
import { FirebaseGuard } from "src/firebase/firebase.guard";
import {  StudentCourse } from "./entities/courseStudent.entity";

@Controller('student')
export class StudentController{
    constructor(
        private readonly studentService: StudentService    )
        {}
    

    @Get()
    findAll(): Promise<Student[]>{
        return this.studentService.findAll();
    }

    @Get('/course/:uid')
    findByCourse(@Param('uid') uid: string): Promise<Student[]>{
        return this.studentService.finAllByCourse(uid);
    }

    @Get('/findOne')
    @UseGuards(FirebaseGuard)
    findOne(
        @User() user,
    ): Promise<Student>{
        return this.studentService.findOne(user.uid.uid);
    }

    @Put(':uid')
    update(
        @User() user, @Param('name') name: string): Promise<Student>{
        return this.studentService.update(user.uid, name);
    }

    @Post()
    create(
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string,
    ): Promise<Student>{
        return this.studentService.create(
            name,
            email,
            password
        );
    }

    @Post('/course')
    @UseGuards(FirebaseGuard)
    createCourseStudent(
        @User() user,
        @Body('course_id') course_id: number
    ): Promise<StudentCourse>{
        return this.studentService.createStudentCourse(user.uid.uid, course_id);
    }

}