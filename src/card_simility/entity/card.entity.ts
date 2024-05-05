/* eslint-disable prettier/prettier */
// card.entity.ts
import { Card } from 'src/card/entity/card.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
@Entity('card_similar')
export class CardSimilar {
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
  card_id: number;

  @ManyToOne(() => Card)
  @JoinColumn({ name: 'card_id' })
  card: Card;
}
