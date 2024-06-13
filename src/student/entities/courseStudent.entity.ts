/* eslint-disable prettier/prettier */
// student.entity.ts
import { Course } from 'src/course/entities/course.entity';
import { Entity, PrimaryGeneratedColumn,  ManyToOne, JoinColumn, Column } from 'typeorm';
import { Student } from './student.entity';

@Entity('course_student')
export class StudentCourse {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    course_id: number;
    
    @Column()
    uid: string;

    @Column()
    status: number;

    @ManyToOne(() => Course, course => course.id) // Aquí se cambió 'ticketDetails' por 'ticket_detail'
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @ManyToOne(() => Student, student => student.uid) // Aquí se cambió 'ticketDetails' por 'ticket_detail'
    @JoinColumn({ name: 'uid' })
    student: Student;

}
