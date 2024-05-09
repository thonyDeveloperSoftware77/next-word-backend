/* eslint-disable prettier/prettier */

// firebase.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FirebaseRepository } from './firebase.service';

@Injectable()
export class FirebaseGuard implements CanActivate {
  constructor(private firebaseRepository: FirebaseRepository) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      return false;
    }

    const token = authorizationHeader.split(' ')[1]; // Bearer <token>
    return this.firebaseRepository.verifyToken(token)
      .then(uid => {
        if (uid) {
          request.user = { uid };
          return true;
        } else {
          return false;
        }
      })
      .catch(() => false);

  }
}
