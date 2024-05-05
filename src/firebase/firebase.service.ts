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

  async createUser(user: { email: string, password: string }) {
    try {
      const userRecord = await this.firebaseApp.auth().createUser(user);
      console.log('Successfully created new user:', userRecord.uid);
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
      return decodedToken.uid;
    } catch (error) {
      console.log('Error verifying token:', error);
      throw error;
    }
  }
}
