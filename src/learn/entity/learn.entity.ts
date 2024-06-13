/* eslint-disable prettier/prettier */
import { Card } from "src/card/entity/card.entity";

export interface CompareAndUpdateStudentStatus{
    message: string;
    cards: Card[];
}

export interface StudentProgressComparison {
    message: string;
    studentProgress: number;
    averageProgress: number;
    missingCards: Card[];
    sessionsReviewed: number;
    averageSessions: number;
}