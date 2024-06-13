/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CourseService } from "./course.service";
import { Course } from "./entities/course.entity";
import { CourseStudent } from "./entities/course.student.entity";
import { User } from "src/firebase/user.decorator";
import { FirebaseGuard } from "src/firebase/firebase.guard";


@Controller('course')
@UseGuards(FirebaseGuard)
export class CourseController {
    constructor(private readonly courseService: CourseService) { }


    @Get()
    findAll(): Promise<Course[]> {
        return this.courseService.findAll();
    }

    @Get('/teacher/:uid')
    findByTeacher(@Param('uid') uid: string): Promise<Course[]> {
        return this.courseService.findAllByTeacher(uid);
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Course> {
        return this.courseService.findOne(id);
    }

    @Get('/student/:course_id')
    findStudentByCourse(
        @User() user,
        @Param('course_id') course_id: number): Promise<CourseStudent[]> {
            console.log(user);
        return this.courseService.findAllStudentByCourse(course_id);
    }

    @Put(':uid')
    async update(
        @Param('id') id: number,
        @Body('code') code: string,
        @Body('name') name: string,
        @Body('description') description: string,
        @Body('duration') duration: string,
        @Body('start_date') start_date: Date,
        @Body('end_date') end_date: Date,
        @Body('instructor') instructor: string,
        @Body('level') level: string,
        @Body('prerequisites') prerequisites: string,
        @Body('learning_objectives') learning_objectives: string,
        @Body('course_content') course_content: string,
        @Body('type') type: string
    ): Promise<Course> {
        return this.courseService.update(id, code, name, description, duration, start_date, end_date, instructor, level, prerequisites, learning_objectives, course_content, type);
    }

    @Put('/student/status/:course_student_id')
    async changeStateStudentCourse(
        @Param('course_student_id') course_student_id: number,
        @User() user,
        @Body('status') status: number
    ) {
        return this.courseService.changeStateStudentCourse(course_student_id, user.uid.uid ,status);
    }

    @Post()
    create(@Body() course: Course): Promise<Course> {
        return this.courseService.create(course);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<Course> {
        return this.courseService.delete(id);
    }
}