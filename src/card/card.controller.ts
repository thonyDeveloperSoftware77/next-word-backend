/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { CardService } from "./card.service";
import { Card } from "./entity/card.entity";

@Controller('card')
export class CardController {
    constructor(
        private readonly cardService: CardService,
    ) { }

    @Get()
    findAll(): Promise<Card[]> {
        return this.cardService.findAll();
    }

    @Get('/course/:course_id')
    findByCourse(@Param('course_id') course_id: number): Promise<Card[]> {
        return this.cardService.findByCourse(course_id);
    }

    @Post()
    create(
        @Body()card: Card): Promise<Card> {
        return this.cardService.create(card);
    }

    @Post('/many')
    createMany(@Body() card: Card[]): Promise<Card[]> {
        return this.cardService.createCards(card);
    }

    @Put('/:id')
    update(
        @Param('id') id: number,
        @Body('course_id') course_id: number,
        @Body('word_english') word_english: string,
        @Body('word_spanish') word_spanish: string,
        @Body('meaning_english') meaning_english: string,
        @Body('meaning_spanish') meaning_spanish: string,
        @Body('example_english') example_english: string,
        @Body('example_spanish') example_spanish: string,
    ): Promise<Card> {
        return this.cardService.update(
            Number(id),
            word_english,
            word_spanish,
            meaning_english,
            meaning_spanish,
            example_english,
            example_spanish,
            Number(course_id),
        );
    }
}