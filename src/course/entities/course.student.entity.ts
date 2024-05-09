/* eslint-disable prettier/prettier */
// course.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
import { Course } from './course.entity';
import { Student } from 'src/student/entities/student.entity';

@Entity('course_student')
export class CourseStudent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  course_id: number;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'course_id', referencedColumnName: 'id' })
    course: Course;

  @ManyToOne(()=> Student)
  @JoinColumn({ name: 'uid'})
  student:Student



  @Column()
  status: number;
}
