/* eslint-disable prettier/prettier */
import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CardSimilar } from "./entity/card.entity";
import { Repository } from "typeorm";
import { Card } from "src/card/entity/card.entity";

@Injectable()
export class CardSimilarService {
    constructor(
        @InjectRepository(CardSimilar) private cardSimilarRepository: Repository<CardSimilar>,
        @InjectRepository(Card) private cardRepository: Repository<Card>,
    ) { }


    /**
     * Función para buscar CardSimilars de card source
     * @param card_id 
     * @returns CardSimilar
     */
    async find(card_id: number): Promise<CardSimilar> {
        const CardSimilar = await this.cardSimilarRepository.findOne({ where: { card_id } });
        if (!CardSimilar) {
            throw new ConflictException('La tarjeta no existe');
        }
        return CardSimilar;
    }

    /**
     * Función para crear una CardSimilar
     * @param course_id
     * @param CardSimilar 
     * @returns CardSimilar
     */
    async create(course_id, CardSimilar: CardSimilar): Promise<CardSimilar> {
        try {
            //Verificar que existe el card source
            const card = await this.cardRepository.findOne({ where: { id: CardSimilar.card_id } });
            if (!card) {
                throw new Error('El card no existe');
            }
            //verificar que el card sea del mismo curso que el parametro
            if (card.course_id !== course_id) {
                throw new Error('El card no pertenece al curso');
            }
            //verificar que no existe la CardSimilar
            const CardSimilarExist = await this.cardSimilarRepository.findOne({ where: { card_id: CardSimilar.card_id } });
            if (CardSimilarExist) {
                throw new ConflictException('La tarjeta similar ya existe');
            }

            return this.cardSimilarRepository.save(CardSimilar);
        }
        catch (error) {
            throw new ConflictException(error.message);
        }
    }

    async update(
        course_id: number,
        id: number,
        word_english: string,
        word_spanish: string,
        meaning_english: string,
        meaning_spanish: string,
        example_english: string,
        example_spanish: string,
        card_id: number
    ): Promise<CardSimilar> {
        try {
            const CardSimilar = await this.cardSimilarRepository.findOne({ where: { id } });
            if (!CardSimilar) {
                throw new ConflictException('La tarjeta no existe');
            }
             //verificar que el card source sea del mismo curso 
            const card = await this.cardRepository.findOne({ where: { id: card_id } });
            if (!card) {
                throw new Error('El card no existe');
            }
            if (card.course_id !== course_id) {
                throw new Error('El card no pertenece al curso');
            }
            CardSimilar.word_english = word_english;
            CardSimilar.word_spanish = word_spanish;
            CardSimilar.meaning_english = meaning_english;
            CardSimilar.meaning_spanish = meaning_spanish;
            CardSimilar.example_english = example_english;
            CardSimilar.example_spanish = example_spanish;
            CardSimilar.card_id = card_id;
            return this.cardSimilarRepository.save(CardSimilar);
        } catch (error) {
            throw new ConflictException(error.message);
        }
    }
}