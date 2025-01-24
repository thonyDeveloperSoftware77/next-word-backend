/* eslint-disable prettier/prettier */
// encrypt.service.ts// src/auth/encrypt.service.ts
import { Injectable } from '@nestjs/common';
import * as vault from 'node-vault';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EncryptService {
    private vaultClient: any; 

    constructor(private configService: ConfigService) {
        this.vaultClient = vault({
            apiVersion: 'v1',
            endpoint: this.configService.get<string>('VAULT_ADDR'),
            token: this.configService.get<string>('VAULT_TOKEN'), 
        });

        console.log('vaultClient:', this.vaultClient);

        console.log('vaultClient.transit:', this.vaultClient.transit);


        console.log('Método write:', typeof this.vaultClient.write === 'function'); // true
        console.log('Método read:', typeof this.vaultClient.read === 'function'); // true

        if (this.vaultClient.transit) {
            console.log('transit.encrypt es una función:', typeof this.vaultClient.transit.encrypt === 'function');
        } else {
            console.log('transit no está definido en vaultClient.');
        }

    }

    /**
     * Encripta un texto plano utilizando Vault Transit.
     * @param plaintext Texto plano a encriptar.
     * @returns Ciphertext encriptado.
     */
    async encryptData(plaintext: string): Promise<string> {
        const base64Plaintext = Buffer.from(plaintext).toString('base64');
        try {
            const result = await this.vaultClient.write('transit/encrypt/my-key', { plaintext: base64Plaintext });
            console.log('Resultado de encrypt:', result);
            return result.data.ciphertext;
        } catch (error) {
            console.error('Error al encriptar datos con Vault:', error.response?.data || error.message);
            throw new Error('Error al encriptar datos');
        }
    }

    /**
     * Desencripta un ciphertext utilizando Vault Transit.
     * @param ciphertext Texto encriptado a desencriptar.
     * @returns Texto plano desencriptado.
     */
    async decryptData(ciphertext: string): Promise<string> {
        try {
            const result = await this.vaultClient.write('transit/decrypt/my-key', { ciphertext });
            console.log('Resultado de decrypt:', result);
            const plaintextBase64 = result.data.plaintext;
            const plaintext = Buffer.from(plaintextBase64, 'base64').toString('utf-8');
            return plaintext;
        } catch (error) {
            console.error('Error al desencriptar datos con Vault:', error.response?.data || error.message);
            throw new Error('Error al desencriptar datos');
        }
    }
}
