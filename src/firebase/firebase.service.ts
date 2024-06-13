/* eslint-disable prettier/prettier */

import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';

@Injectable()
export class FirebaseRepository {
  #db: FirebaseFirestore.Firestore;
  #collection: FirebaseFirestore.CollectionReference;

  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
    this.#db = firebaseApp.firestore();
    this.#collection = this.#db.collection('<collection_name>');
  }

  async createUser(user: { email: string, password: string, role: 'admin' | 'teacher' | 'student' }) {
    try {
      // Crear el usuario en Firebase Authentication
      const userRecord = await this.firebaseApp.auth().createUser({
        email: user.email,
        password: user.password,
      });

      console.log('Successfully created new user:', userRecord.uid);

      // Asignar el rol al usuario
      await this.firebaseApp.auth().setCustomUserClaims(userRecord.uid, { role: user.role });
      console.log(`Role ${user.role} assigned to user ${userRecord.uid}`);

      return userRecord;
    } catch (error) {
      console.log('Error creating new user:', error);
      throw error;
    }
  }

  
  async deleteUser(uid: string) {
    try {
      await this.firebaseApp.auth().deleteUser(uid);
      console.log('Successfully deleted user:', uid);
    } catch (error) {
      console.log('Error deleting user:', error);
      throw error;
    }
  }

  //verificar un token y devolver el uid

  async verifyToken(token: string) {
    try {
        const decodedToken = await this.firebaseApp.auth().verifyIdToken(token);
        console.log(decodedToken.uid);
        return {
            uid: decodedToken.uid,
            role: decodedToken.role || null, // Aquí obtenemos el rol del token
        };
    } catch (error) {
        console.log('Error verifying token:', error);
        throw error;
    }
}
}
