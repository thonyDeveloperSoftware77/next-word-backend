/* eslint-disable prettier/prettier */
import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Card } from "./entity/card.entity";
import { Repository } from "typeorm";
import { Course } from "src/course/entities/course.entity";

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(Card) private cardRepository: Repository<Card>,
        @InjectRepository(Course) private courseRepository: Repository<Course>
    ) { }

    /**
     *  Función para buscar todas las cards
     * @returns Card[]
     */
    async findAll(): Promise<Card[]> {
        return this.cardRepository.find();
    }

    /**
     * Función para buscar cards por curso
     * @param course_id 
     * @returns Card[]
     */
    async findByCourse(course_id: number): Promise<Card[]> { // Buscar todas las tarjetas por curso
        const cards = await this.cardRepository.createQueryBuilder('card')
            .innerJoin('card.course', 'course', 'course.id = :course_id', { course_id })
            .getMany();
        if (!cards) {
            return [];
        }
        return cards;
    }

    /**
     * Función para crear una card
     * @param card 
     * @returns Card
     */
    async create(card: Card): Promise<Card> {
        try {
            const course = await this.courseRepository.findOne({ where: { id: card.course_id } });
            if (!course) {
                throw new Error('El curso no existe');
            }
            return this.cardRepository.save(card);
        }
        catch (error) {
            throw new ConflictException(error.message);
        }
    }

    /**
     * Función para crear varias cards
     * @param card[]
     * @returns Card[]
     */
    async createCards(card: Card[]) : Promise<Card[]> {
        try {
            return this.cardRepository.save(card);
        } catch (error) {
            throw new ConflictException(error.message);
        }
    }

    /**
     * Función para actualizar una card
     * @param id 
     * @param word_english 
     * @param word_spanish 
     * @param meaning_english 
     * @param meaning_spanish 
     * @param example_english 
     * @param example_spanish 
     * @param course_id 
     * @returns Card
     */
    async update(
        id: number,
        word_english: string,
        word_spanish: string,
        meaning_english: string,
        meaning_spanish: string,
        example_english: string,
        example_spanish: string,
        course_id: number
    ): Promise<Card> {
        try {
            const card = await this.cardRepository.findOne({ where: { id } });
            if (!card) {
                throw new ConflictException('La tarjeta no existe');
            }
            //verificar que el card pertenezca al mismo curso
            if (card.course_id !== course_id) {
                throw new ConflictException('La tarjeta no pertenece al curso');
            }
            card.word_english = word_english;
            card.word_spanish = word_spanish;
            card.meaning_english = meaning_english;
            card.meaning_spanish = meaning_spanish;
            card.example_english = example_english;
            card.example_spanish = example_spanish;
            card.course_id = course_id;
            return this.cardRepository.save(card);
        } catch (error) {
            throw new ConflictException(error.message);
        }
    }
}