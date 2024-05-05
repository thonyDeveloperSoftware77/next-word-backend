/* eslint-disable prettier/prettier */
// course.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
import { Teacher } from '../../teacher/entities/teacher.entity';

@Entity('course')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  duration: string;

  @Column({ type: 'date', nullable: true })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ nullable: true })
  instructor: string;

  @Column({ nullable: true })
  level: string;

  @Column({ nullable: true })
  prerequisites: string;

  @Column({ nullable: true })
  learning_objectives: string;

  @Column({ nullable: true })
  course_content: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  teacher_uid: string;

  @ManyToOne(() => Teacher)
  @JoinColumn({ name: 'teacher_uid' })
  teacher: Teacher;
}
