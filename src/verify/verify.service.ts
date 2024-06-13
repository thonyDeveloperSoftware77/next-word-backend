/* eslint-disable prettier/prettier */
// teacher.service.ts
import {  Injectable } from '@nestjs/common';
import { FirebaseRepository } from 'src/firebase/firebase.service';
interface User {
    uid: string;
    role: any;
}
@Injectable()
export class VerifyService {
    constructor(
        private firebaseRepository: FirebaseRepository
    ) { }

    async verifyToken(token: string): Promise<User> {
        return this.firebaseRepository.verifyToken(token);
    }
    
}