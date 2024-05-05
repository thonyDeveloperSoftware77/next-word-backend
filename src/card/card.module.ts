/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { Card } from "./entity/card.entity";
import { Course } from "src/course/entities/course.entity";
import { CardController } from "./card.controller";
import { CardService } from "./card.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Course]),TypeOrmModule.forFeature([Card]),],
    controllers: [CardController],
    providers: [CardService]
})

export class CardModule {}