/* eslint-disable prettier/prettier */
// student.entity.ts
import { Entity, PrimaryColumn, Column, ManyToOne,JoinColumn } from 'typeorm';
import { Course } from '../../course/entities/course.entity';

@Entity('student')
export class Student {
  @PrimaryColumn()
  uid: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'course_id' })
  course: Course;
  
}
