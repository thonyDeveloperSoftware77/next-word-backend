/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from "@nestjs/common";
import { LearnService } from "./learn.service";
import { Card } from "src/card/entity/card.entity";
import { LearnCardInput } from "./entity/learnCardInput.entity";
import { LearningHistory } from "./entity/learnHistory.entity";
//import { User } from "src/firebase/user.decorator";

@Controller('learn')
export class LarnController {
    constructor(
        private readonly learnService: LearnService,
    ) { }


    @Get('/prepare')
    getCardsPreparedForLearning(
        // @User() user,
        // @Body('course_id') course_id: number

    ): Promise<Card[]> {
        return this.learnService.getCardsPreparedForLearning(
            'zNAXym25jVbmySIJvRCwJ8BVA1F3',
            13
        );
    }

    @Post('/history')
    createCardsHistory(
        // @User() user,
        @Body('cards') cards: LearnCardInput[]
    ): Promise<LearningHistory[]> {
        return this.learnService.createCardsHistory(
            '4OVu74ohyUUL16p8cUTF3D9YS1D2',
            13,
            cards
        );
    }


    //compareLearningRateBetweenStudents
    @Get('/compareLearningRateBetweenStudents')
    compareLearningRateBetweenStudents(
        // @User() user,
        // @Body('course_id') course_id: number
    ): Promise<any> {
        console.log("compareLearningRateBetweenStudents");
        return this.learnService.reporteProgresoEstudiantes("03rwifXks3MG7M4nkYbJ1ItGtFm2");
    }

    @Post('/comparationBetweenDates')
    comparationBetweenDates(
        // @User() user,
        @Body('date1') date1: string,
        @Body('date2') date2: string
    ): Promise<any> {
        console.log("comparationBetweenDates");
        return this.learnService.comparationBetweenDates("03rwifXks3MG7M4nkYbJ1ItGtFm2", date1, date2);
    }

}