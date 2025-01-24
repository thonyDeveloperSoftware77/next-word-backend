/* eslint-disable prettier/prettier */
// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';  // Importar JwtModule
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: 'YS2ZugsQkUoVj45vUDbVDADr4xev-uV8EjjY0drX4LM',  // Clave secreta para firmar el token
      signOptions: { expiresIn: '1h' },  // Opcional, si quieres que los tokens caduquen
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
