/* eslint-disable prettier/prettier */
// teacher.module.ts
import { Module } from '@nestjs/common';
import {  VerifyController } from './verify.controller';
import { VerifyService } from './verify.service';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [ FirebaseModule],
  controllers: [VerifyController],
  providers: [VerifyService],
})
export class VerifyModule {}