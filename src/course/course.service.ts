/* eslint-disable prettier/prettier */

import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "./entities/course.entity";
import { Repository } from "typeorm";
import isValidUid, { codeGenerator } from "utils/verifyUID";
import { Teacher } from "src/teacher/entities/teacher.entity";


@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(Course)
        private courseRepository: Repository<Course>
        , @InjectRepository(Teacher)
        private teacherRepository: Repository<Teacher>
    ) { }

    async findOneTeacher(uid: string): Promise<Teacher> {
        const teacher = await this.teacherRepository.findOne({
            where: { uid: uid },
            select: ["uid", "name", "email", "state"] // especifica los campos que quieres devolver
        });
        if (!teacher) {
            throw new NotFoundException('El profesor no existe');
        }
        return teacher;
    }

    async findAll(): Promise<Course[]> {
        return this.courseRepository.find();
    }

    async findAllByTeacher(uid: string): Promise<Course[]> {
        const courses = await this.courseRepository.createQueryBuilder('course')
            .innerJoin('course.teacher', 'teacher', 'teacher.uid = :uid', { uid })
            .getMany();

        if (!courses) {
            return [];
        }
        return courses;
    }


    async findOne(id: number): Promise<Course> {
        const course = await this.courseRepository.findOne({ where: { id } });
        if (!course) {
            throw new ConflictException('Este curso no existe');
        }
        return course;
    }

    async create(course: Course): Promise<Course> {

        

        //Validación de tipo de curso

        try {
            const existingCourse = await this.courseRepository.findOne({ where: { name: course.code } });
            if (existingCourse) {
                throw new ConflictException('El código del curso ya está registrado');
            }

            if (course.type === 'free' && course.teacher_uid) {
                throw new ConflictException('No puede ser asignado a un profesor si es público');
            }

            if (course.type === 'free' && course.instructor) {
                throw new ConflictException('No puede ser asignado a un profesor si es público');
            }

            if (course.type === 'private' && course.teacher_uid === undefined) {
                throw new ConflictException('Debe ser asignado a un profesor si es privado');
            }

            if (course.teacher_uid !== undefined) {
                if (isValidUid(course.teacher_uid)) {
                    throw new ConflictException('UID inválido petición denegada');
                }
            }

            course.code = codeGenerator();
            //Dependiendo de la duracion y de la fecha de inicio se establece course.end_date

            if (course.duration && course.start_date) {
                course.end_date = new Date(course.start_date);
                if (course.duration === '4 weeks') {
                    course.end_date.setDate(course.end_date.getDate() + 28);
                } else if (course.duration === '8 weeks') {
                    course.end_date.setDate(course.end_date.getDate() + 56);
                } else if (course.duration === '12 weeks') {
                    course.end_date.setDate(course.end_date.getDate() + 84);
                } else if (course.duration === '16 weeks') {
                    course.end_date.setDate(course.end_date.getDate() + 112);
                }
            }

            //Por el momento se establece el type en private
            course.type = 'private';

           //Buscar el profesor por uid
            if (course.teacher_uid) {
                const teacher = await this.teacherRepository.findOne({ where: { uid: course.teacher_uid } });
                if (!teacher) {
                    throw new NotFoundException('El profesor no existe');
                }
                course.teacher = teacher;
            } 

            return this.courseRepository.save(course);
        } catch (error) {
            console.log(error);
            if (error.code === '23505') { // error code for unique_violation in PostgreSQL
                throw new ConflictException(error.detail);
            }
            throw new ConflictException('Error al crear el curso');
        }
    }

    async update(
        id: number,
        code: string,
        name: string,
        description: string,
        duration: string,
        start_date: Date,
        end_date: Date,
        instructor: string,
        level: string,
        prerequisites: string,
        learning_objectives: string,
        course_content: string,
        type: string
    ): Promise<Course> {
        const existingCourse = await this.courseRepository.findOne({ where: { id: id } });
        if (!existingCourse) {
            throw new ConflictException('Este curso no existe');
        }

        if (existingCourse.type === 'free' && type === 'private') {
            throw new ConflictException('No puede cambiar el tipo de curso a privado');
        }

        if (existingCourse.type === 'private' && type === 'free') {
            throw new ConflictException('No puede cambiar el tipo de curso a público');
        }

        if (type === 'private' && instructor === undefined) {
            throw new ConflictException('Debe ser asignado a un profesor si es privado');
        }


        const updatedCourse = await this.courseRepository.save({
            ...existingCourse,
            code,
            name,
            description,
            duration,
            start_date,
            end_date,
            instructor,
            level,
            prerequisites,
            learning_objectives,
            course_content,
            type
        });
        return updatedCourse;
    }



    async delete(id: number): Promise<Course> {
        const existingCourse = await this.courseRepository.findOne({ where: { id } });
        if (!existingCourse) {
            throw new ConflictException('Este curso no existe');
        }
        return this.courseRepository.remove(existingCourse);
    }


}