/* eslint-disable prettier/prettier */
// card.entity.ts
import { Course } from 'src/course/entities/course.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
@Entity('card')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  word_english: string;

  @Column()
  word_spanish: string;

  @Column()
  meaning_english: string;

  @Column()
  meaning_spanish: string;

  @Column()
  example_english:string;

  @Column()
  example_spanish: string;

  @Column()
  course_id: number;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
