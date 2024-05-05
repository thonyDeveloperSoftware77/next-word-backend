/* eslint-disable prettier/prettier */
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('teacher')
export class Teacher {
  @PrimaryColumn()
  uid: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  state: boolean;
}
