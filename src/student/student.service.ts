/* eslint-disable prettier/prettier */

import { InjectRepository } from "@nestjs/typeorm";
import { Student } from "./entities/student.entity";
import { Repository } from "typeorm";
import { ConflictException, Injectable } from "@nestjs/common";
import { FirebaseRepository } from "src/firebase/firebase.service";
import { Course } from "src/course/entities/course.entity";
import { StudentCourse } from "./entities/courseStudent.entity";

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
        @InjectRepository(Course)
        private courseRepository: Repository<Course>,
        @InjectRepository(StudentCourse)
        private courseStudentRepository: Repository<StudentCourse>,
        private firebaseRepository: FirebaseRepository
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
        console.log('uid', uid);
        console.log('llego');
        const student = await this.studentRepository.findOne({ where: { uid } });
        if (!student) {
            throw new ConflictException('Este estudiante no existe');
        }
        return student;
    }

    async create(name, email, password): Promise<Student> {
        const student = new Student();
        student.email = email;
        student.password = password;
        student.name = name;
        //Valida la sintaixs del correo
        if (!student.email.match(/.+@.+\..+/)) {
            throw new ConflictException('Correo electrónico inválido');
        }
        //Valida la longitud de la contraseña, debe ser minimo 8 caracteres y maximo 15
        if (student.password.length < 8 || student.password.length > 15) {
            throw new ConflictException('La contraseña debe tener entre 8 y 15 caracteres');
        }
        //valida que el nombre no sea vacio, no contenga numeros ni caracteres especiales
        if (student.name.length === 0 || student.name.match(/.*[0-9]+.*/) || student.name.match(/.*[^a-zA-Z0-9]+.*/)) {
            throw new ConflictException('Nombre inválido');
        }

        try {
            const existingStudent = await this.studentRepository.findOne({ where: { email: student.email } });
            if (existingStudent) {
                throw new ConflictException('Este estudiante ya está registrado');
            }

            // Creacion del usuario en Firebase
            const userRecord = await this.firebaseRepository.createUser({
                email: student.email,
                password: student.password,
                role: 'student',
            });
            // Se accede al uid del usuario recién creado
            student.uid = userRecord.uid;

            return this.studentRepository.save(student);
        } catch (error) {
            if (error.code === '23505') { // error code for unique_violation in PostgreSQL
                throw new ConflictException(error.detail);
            }
            throw error;
        }
    }


    //async getStudentCourses(uid: string): Promise<Course[]> {
    //    const studentCourses : StudentCourse =  await  this.courseStudentRepository.findOne({ where: { uid } });
    //    if (!studentCourses) {
    //        throw new ConflictException('Este estudiante no tiene cursos');
    //    }
//
//
    //}

    async createStudentCourse(uid: string, course_id: number): Promise<StudentCourse> {
        const student = await this.studentRepository.findOne({ where: { uid } });
        if (!student) {
            throw new ConflictException('Este estudiante no existe');
        }

        //verifica que exista el curso
        const course = await this.courseRepository.findOne({ where: { id: course_id } });
        if (!course) {
            throw new ConflictException('Este curso no existe');
        }

        //verifica si ya esta inscrito en algun otro curso, solo puede haber un registro por estudiante
        const existingCourse = await this.courseStudentRepository.findOne({ where: { uid: uid } });
        if (existingCourse) {
            throw new ConflictException('Este estudiante ya está inscrito en otro curso');
        }   

        const courseStudent = new StudentCourse();
        courseStudent.student = student;
        courseStudent.course_id = course_id;
        courseStudent.status = 1;

        try {
            return this.courseStudentRepository.save(courseStudent);
        } catch (error) {
            throw new ConflictException('Error al inscribir el estudiante en el curso');
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


}