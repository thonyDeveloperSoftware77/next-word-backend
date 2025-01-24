/* eslint-disable prettier/prettier */
// teacher.controller.ts
import { Controller, Get, Post, Body, Param, Put, /*UseGuards*/ } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { Teacher } from './entities/teacher.entity';
//import { FirebaseGuard } from 'src/firebase/firebase.guard';
import { User } from 'src/firebase/user.decorator';

@Controller('teacher')
//@UseGuards(FirebaseGuard)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) { }

  @Get()
  findAll(): Promise<Teacher[]> {
    return this.teacherService.findAll();
  }

  @Get(':uid')
  findOne(@Param('uid') uid: string): Promise<Teacher> {
    console.log(uid);
    return this.teacherService.findOne(uid);
  }

  @Put(':uid')
  async update(@Param('uid') uid: string, @Body('name') name: string, @Body('state') state: boolean): Promise<Teacher> {
    return this.teacherService.update(uid, name, state);
  }

  @Post()
  create(
    @User() user,
    @Body() teacher: Teacher): Promise<Teacher> {
    console.log(user);
    console.log(teacher);
    return this.teacherService.create(user.uid.uid, teacher);
  }
}
