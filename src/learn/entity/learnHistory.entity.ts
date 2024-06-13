/* eslint-disable prettier/prettier */
// card.entity.ts
import { Card } from 'src/card/entity/card.entity';
import { Student } from 'src/student/entities/student.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
@Entity('learning_history')
export class LearningHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    student_uid: string;

    @Column()
    session_id: number;

    @Column()
    card_id: number;

    @Column()
    revision_date: Date;

    @ManyToOne(() => Student)
    @JoinColumn({ name: 'student_uid' })
    student: Student;

    @ManyToOne(() => Card)
    @JoinColumn({ name: 'card_id' })
    card: Card;
}
