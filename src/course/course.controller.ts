/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CourseService } from "./course.service";
import { Course } from "./entities/course.entity";


@Controller('course')
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


    @Post()
    create(@Body() course: Course): Promise<Course> {
        return this.courseService.create(course);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<Course> {
        return this.courseService.delete(id);
    }
}