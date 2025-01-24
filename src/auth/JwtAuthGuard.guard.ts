/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Obtener el token del encabezado Authorization: Bearer <token>
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header no presente');
    }

    const [bearer, token] = authorizationHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token no válido');
    }

    try {
      // Verificar el token usando la clave secreta o clave pública
      await this.jwtService.verifyAsync(token);
      return true; // El token es válido, por lo que se permite el acceso
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
