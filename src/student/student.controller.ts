/* eslint-disable prettier/prettier */

import { Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { StudentService } from "./student.service";
import { Student } from "./entities/student.entity";

@Controller('student')
export class StudentController{
    constructor(private readonly studentService: StudentService){}

    @Get()
    findAll(): Promise<Student[]>{
        return this.studentService.findAll();
    }

    @Get('/course/:uid')
    findByCourse(@Param('uid') uid: string): Promise<Student[]>{
        return this.studentService.finAllByCourse(uid);
    }

    @Get(':uid')
    findOne(@Param('uid') uid: string): Promise<Student>{
        return this.studentService.findOne(uid);
    }

    @Put(':uid')
    async update(@Param('uid') uid: string, @Param('name') name: string): Promise<Student>{
        return this.studentService.update(uid, name);
    }

    @Post()
    create(@Param('student') student: Student): Promise<Student>{
        return this.studentService.create(student);
    }

    @Delete(':uid')
    async delete(@Param('uid') uid: string): Promise<Student>{
        return this.studentService.deleteCourse(uid);
    }
}