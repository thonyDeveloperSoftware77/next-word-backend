/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { Card } from "./entity/card.entity";
import { Course } from "src/course/entities/course.entity";
import { CardController } from "./card.controller";
import { CardService } from "./card.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EncryptService } from "src/auth/encrypt.service";
import { ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [TypeOrmModule.forFeature([Course]),TypeOrmModule.forFeature([Card]), HttpModule],
    controllers: [CardController],
    providers: [CardService, EncryptService, ConfigService]
})

export class CardModule {}