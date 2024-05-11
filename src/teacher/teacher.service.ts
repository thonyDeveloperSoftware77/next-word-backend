/* eslint-disable prettier/prettier */
// teacher.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import isValidUid from 'utils/verifyUID';
import { FirebaseRepository } from 'src/firebase/firebase.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(Teacher)
        private teacherRepository: Repository<Teacher>,
        private firebaseRepository: FirebaseRepository,
        private configService: ConfigService
        
    ) { }

    async findAll(): Promise<Teacher[]> {
        return this.teacherRepository.find({
            select: ["uid", "name", "email", "state"] // especifica los campos que quieres devolver
        });
    }

    async findOne(uid: string): Promise<Teacher> {
        const teacher = await this.teacherRepository.findOne({
            where: { uid: uid },
            select: ["uid", "name", "email", "state"] // especifica los campos que quieres devolver
        });
        if (!teacher) {
            throw new NotFoundException('El profesor no existe');
        }
        return teacher;
    }

    async create(user:string, teacher: Teacher): Promise<Teacher> {
        const uidAdmin = this.configService.get('USER_ADMIN_UID');
        if (user !== uidAdmin) {
            throw new ConflictException('No tienes permisos para realizar esta acción');
        }else{
            console.log('Usuario Admin');
        }
        try {
            const existingTeacher = await this.teacherRepository.findOne({ where: { uid: teacher.uid } });
            if (existingTeacher) {
                throw new ConflictException('Este Usuario ya está registrado');
            }
            isValidUid(teacher.uid)
            if (isValidUid(teacher.uid)) {
                throw new ConflictException('UID inválido petición denegada');
            }
            //verifica la sintaxis del correo electrónico
            if (!teacher.email.match(/.+@.+\..+/)) {
                throw new ConflictException('Correo electrónico inválido');
            }
            //verifica la longitud de la contraseña, debe ser minimo 8 caracteres y maximo 15
            if (teacher.password.length < 8 || teacher.password.length > 15) {
                throw new ConflictException('La contraseña debe tener entre 8 y 15 caracteres');
            }

            // Creacion del usuario en Firebase
            const userRecord = await this.firebaseRepository.createUser({
                email: teacher.email,
                password: teacher.password,
            });
            // Se accede al uid del usuario recién creado
            teacher.uid = userRecord.uid;

            return this.teacherRepository.save(teacher);
        } catch (error) {
            if (error.code === '23505') { // error code for unique_violation in PostgreSQL
                throw new ConflictException(error.detail);
            }
            throw error;
        }
    }



    async update(uid: string, name: string, state: boolean): Promise<Teacher> {
        const existingTeacher = await this.teacherRepository.findOne({ where: { uid: uid } });
        if (!existingTeacher) {
            throw new NotFoundException('El profesor no existe');
        }
        const updatedTeacher = await this.teacherRepository.save({ ...existingTeacher, name, state });
        return updatedTeacher;
    }


    async delete(uid: string): Promise<Teacher> {
        const existingTeacher = await this.teacherRepository.findOne({ where: { uid: uid } });
        if (!existingTeacher) {
            throw new NotFoundException('El profesor no existe');
        }
    
        // Aquí es donde borras el usuario en Firebase
        await this.firebaseRepository.deleteUser(uid);
    
        await this.teacherRepository.delete(uid);
        return existingTeacher;
    }
    
}