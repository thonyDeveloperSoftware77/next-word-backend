/* eslint-disable prettier/prettier */

import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "./entities/course.entity";
import { Repository } from "typeorm";
import isValidUid, { codeGenerator } from "utils/verifyUID";
import { Teacher } from "src/teacher/entities/teacher.entity";
import { CourseStudent } from "./entities/course.student.entity";


@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(Course)
        private courseRepository: Repository<Course>,
        @InjectRepository(CourseStudent)
        private courseStudentRepository: Repository<CourseStudent>,
        @InjectRepository(Teacher)
        private teacherRepository: Repository<Teacher>,
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

    async findAllStudentByCourse(course_id: number): Promise<CourseStudent[]> {
        const course_student = await this.courseStudentRepository.createQueryBuilder('course_student')
            .innerJoin('course_student.course', 'course', 'course.id = :course_id', { course_id })
            .innerJoin('course_student.student', 'student')
            .addSelect(['student.uid', 'student.name', 'student.email'])
            .getMany();

        if (!course_student) {
            return [];
        }
        return course_student;
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

            //Por el momento se establece el type en private
            course.type = 'private';
            console.log(course);
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


    async changeStateStudentCourse(course_student_id: number, uid: string, status: number) {
        console.log('Parametros:', { course_student_id, uid, status });

        // Validar que el estado sea de 1 a 3
        if (status < 1 || status > 3) {
            throw new ConflictException('Estado inválido');
        }

        // Recuperar el registro de course_student
        const course_student = await this.courseStudentRepository.findOne({ where: { id: course_student_id } });
        console.log('Registro course_student encontrado:', course_student);

        if (!course_student) {
            throw new NotFoundException('No se encontró el registro');
        }

        // Buscar el curso y verificar el teacher_uid
        const course_id = course_student.course_id;
        const existingCourse = await this.courseRepository.findOne({ where: { id: course_id } });
        console.log('Registro de curso encontrado:', existingCourse);

        if (!existingCourse) {
            throw new ConflictException('Este curso no existe');
        }

        if (existingCourse.teacher_uid !== uid) {
            throw new ConflictException('No tiene permisos para realizar esta acción');
        }

        // Actualizar el estado del curso_estudiante
        try {
            console.log('Intentando actualizar el estado...');
            await this.courseStudentRepository.update(course_student_id, { status });
            console.log('Estado actualizado, verificando...');
            // Verificar la actualización
            const updatedCourseStudent = await this.courseStudentRepository.findOne({ where: { id: course_student_id } });
            console.log('Registro course_student actualizado:', updatedCourseStudent);
            return updatedCourseStudent;
        } catch (error) {
            console.log('Error al actualizar:', error);
            throw new ConflictException('Error al actualizar el estado del estudiante');
        }
    }



    async delete(id: number): Promise<Course> {
        const existingCourse = await this.courseRepository.findOne({ where: { id } });
        if (!existingCourse) {
            throw new ConflictException('Este curso no existe');
        }
        return this.courseRepository.remove(existingCourse);
    }


}