/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { CardService } from "./card.service";
import { Card } from "./entity/card.entity";
import { EncryptService } from "src/auth/encrypt.service";
import { HttpService } from "@nestjs/axios";

@Controller('card')
export class CardController {
    constructor(
        private readonly cardService: CardService,
        private readonly encryptService: EncryptService,
        private readonly httpService: HttpService, // Inyecta HttpService

    ) { }

    //Ejemplo
    @Get('/test-vault')
    async getText(): Promise<string> {
        try {
            const originalText = 'Hola';
            console.log('Texto Original:', originalText);

            // Encriptar el texto usando Vault
            const encryptedText = await this.encryptService.encryptData(originalText);
            console.log('Texto Encriptado:', encryptedText);

            // Desencriptar el texto usando Vault
            const decryptedText = await this.encryptService.decryptData(encryptedText);
            console.log('Texto Desencriptado:', decryptedText);

            // Retornar el texto desencriptado
            return decryptedText;
        } catch (error) {
            console.error('Error en /test-vault:', error);
            throw error; // Esto enviará una respuesta 500 automáticamente
        }
    }

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
        @Body() card: Card): Promise<Card> {
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

    @Get('/send-encrypted')
    async sendEncryptedData(): Promise<string> {
        try {
            const originalText = 'Holaaa, esta es una prueba de encriptación.';
            console.log('Texto Original:', originalText);

            const encryptedText = await this.encryptService.encryptData(originalText);
            console.log('Texto Encriptado:', encryptedText);

            const response = await this.httpService.post('http://localhost:3002/api/receive-encrypted', {
                ciphertext: encryptedText,
            }).toPromise();

            console.log('Respuesta de Aplicación B:', response.data);
            return 'Datos encriptados enviados exitosamente.';
        } catch (error) {
            console.error('Error en /send-encrypted:', error.response?.data || error.message);
            throw new Error('Error al enviar datos encriptados');
        }
    }

}