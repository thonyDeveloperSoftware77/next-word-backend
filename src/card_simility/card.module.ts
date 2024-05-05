/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import {  CardSimilar } from "./entity/card.entity";
import { Card } from "src/card/entity/card.entity";
import { CardSimilarController } from "./card.controller";
import { CardSimilarService} from "./card.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [ TypeOrmModule.forFeature([CardSimilar]),TypeOrmModule.forFeature([Card]),],
    controllers: [CardSimilarController],
    providers: [CardSimilarService]
})

export class CardSimilarModule {}