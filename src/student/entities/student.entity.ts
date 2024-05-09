/* eslint-disable prettier/prettier */
// student.entity.ts
import { Entity, PrimaryColumn, Column} from 'typeorm';

@Entity('student')
export class Student {
  @PrimaryColumn()
  uid: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
  
  @Column()
  password: string;
}
