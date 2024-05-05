/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { CardSimilarService} from "./card.service";
import { CardSimilar} from "./entity/card.entity";

@Controller('card_similar')
export class CardSimilarController {
    constructor(
        private readonly cardSimilarService: CardSimilarService,
    ) { }

    @Get('/:card_id')
    findByCard(@Param('card_id') card_id: number): Promise<CardSimilar> {
        return this.cardSimilarService.find(card_id);
    }

    @Post('/:course_id')
    create(
        @Param('course_id') course_id: number,
        @Body()CardSimilar: CardSimilar
    ): Promise<CardSimilar> {
        return this.cardSimilarService.create(Number(course_id), CardSimilar);
    }

    @Put('/:course_id')
    update(
        @Param('course_id') course_id: number,
        @Body('id') id: number,
        @Body('word_english') word_english: string,
        @Body('word_spanish') word_spanish: string,
        @Body('meaning_english') meaning_english: string,
        @Body('meaning_spanish') meaning_spanish: string,
        @Body('example_english') example_english: string,
        @Body('example_spanish') example_spanish: string,
        @Body('card_id') card_id: number
    ): Promise<CardSimilar> {
        return this.cardSimilarService.update(
            Number(course_id),
            Number(id),
            word_english,
            word_spanish,
            meaning_english,
            meaning_spanish,
            example_english,
            example_spanish,
            Number(card_id)
        );
    }
}

