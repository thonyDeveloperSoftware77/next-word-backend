/* eslint-disable prettier/prettier */

import { InjectRepository } from "@nestjs/typeorm";
import { Student } from "./entities/student.entity";
import { Repository } from "typeorm";
import { ConflictException, Injectable } from "@nestjs/common";
import { FirebaseRepository } from "src/firebase/firebase.service";

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
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

    async update(uid: string, name: string): Promise<Student> {
        const student = await this.studentRepository.findOne({ where: { uid } });
        if (!student) {
            throw new ConflictException('Este estudiante no existe');
        }
        student.name = name;
        return this.studentRepository.save(student);
    }
}