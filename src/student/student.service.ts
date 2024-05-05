/* eslint-disable prettier/prettier */

import { InjectRepository } from "@nestjs/typeorm";
import { Student } from "./entities/student.entity";
import { Repository } from "typeorm";
import { ConflictException, Injectable } from "@nestjs/common";

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private studentRepository: Repository<Student>
    ) { }

    async findAll(): Promise<Student[]> {
        return this.studentRepository.find();
    }

    async finAllByCourse(uid: string): Promise<Student[]> { 
        const students = await this.studentRepository.createQueryBuilder('student')
            .innerJoin('student.course', 'course', 'course.uid = :uid', { uid })
            .getMany();

        if (!students) {
            return [];
        }
        return students;
    }

    async findOne(uid: string): Promise<Student> {
        const student = await this.studentRepository.findOne({ where: { uid } });
        if (!student) {
            throw new ConflictException('Este estudiante no existe');
        }
        return student;
    }

    async create(student: Student): Promise<Student> {
        try {
            const existingStudent = await this.studentRepository.findOne({ where: { uid: student.uid } });
            if (existingStudent) {
                throw new ConflictException('Este estudiante ya está registrado');
            }
            return this.studentRepository.save(student);
        } catch (error) {
            if (error.code === '23505') { // error code for unique_violation in PostgreSQL
                throw new ConflictException(error.detail);
            }
            throw error;
        }
    }

    async update(uid: string, name: string): Promise<Student> {
        const student = await this.studentRepository.findOne({ where: { uid } });
        if (!student) {
            throw new ConflictException('Este estudiante no existe');
        }
        student.name = name;
        return this.studentRepository.save(student);
    }

    async deleteCourse(uid: string): Promise<Student> {
        const student = await this.studentRepository.findOne({ where: { uid } });
        if (!student) {
            throw new ConflictException('Este estudiante no existe');
        }
        student.course = null;
        return this.studentRepository.save(student);
    }
}