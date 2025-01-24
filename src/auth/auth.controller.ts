/* eslint-disable prettier/prettier */
import { Controller, Get, Query, Redirect, Res, Headers, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import fetch from 'node-fetch';
import * as jwt from 'jsonwebtoken';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
  ) { }



  @Get('callback')
  async handleCallback(@Query('code') code: string, @Res() res): Promise<any> {
    const tokenEndpoint = 'http://localhost:8080/realms/demo-realm/protocol/openid-connect/token';

    const body = new URLSearchParams({
      client_id: 'sistema-a',
      client_secret: 'ibjqNGu7PAszODFNbLDYlAKcZlm6CTfN', // Sustituye con tu Client Secret
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://localhost:3001/api/auth/callback',
    });

    // Intercambiar el código por tokens
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const tokens = await response.json();

    if (response.ok) {
      // Guardar los tokens en cookies para el frontend
      res.cookie('access_token', tokens.access_token, { httpOnly: true, path: '/' });
      res.cookie('refresh_token', tokens.refresh_token, { httpOnly: true, path: '/' });
      res.cookie('id_token', tokens.id_token, { httpOnly: true, path: '/' }); // Guardar el id_token

      // Redirigir al frontend
      return res.redirect('http://localhost:3000/teacher');
    } else {
      return res.status(400).json({ error: tokens });
    }
  }

  @Get('logout')
  @Redirect() // Redirigir al endpoint de logout de Keycloak
  async handleLogout(@Headers('cookie') cookie: string): Promise<{ url: string }> {
    const keycloakHost = 'http://localhost:8080'; // URL del servidor de Keycloak
    const realmName = 'demo-realm'; // Nombre del Realm en Keycloak
    const redirectUri = 'http://localhost:3000/logout'; // URL a redirigir después del logout

    // Parsear las cookies
    const cookies = cookie
      .split('; ')
      .reduce((acc, current) => {
        const [key, value] = current.split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

    const idToken = cookies['id_token'];

    if (!idToken) {
      console.error('No se encontró el id_token en las cookies.');
      return { url: `${redirectUri}?error=no-id-token` }; // Redirigir con un mensaje de error
    }

    // Construir la URL de logout
    const logoutUrl = `${keycloakHost}/realms/${realmName}/protocol/openid-connect/logout?post_logout_redirect_uri=${redirectUri}&id_token_hint=${idToken}`;

    // Retornar la redirección al cliente
    return { url: logoutUrl };
  }

  @Get('verify-token')
  async verifyToken(@Query('token') token: string, @Query('refreshToken') refreshToken: string, @Res() res) {
    try {
      // Paso 1: Verificar el token de acceso
      const certUrl = 'http://localhost:8080/realms/demo-realm/protocol/openid-connect/certs';
      const response = await fetch(certUrl);
      const certs = await response.json();
  
      if (!certs.keys || certs.keys.length === 0) {
        throw new UnauthorizedException('No se encontraron claves públicas de Keycloak');
      }
  
      const decodedHeader = jwt.decode(token, { complete: true })?.header;
      if (!decodedHeader || !decodedHeader.kid) {
        throw new UnauthorizedException('No se encontró el `kid` en el encabezado del token');
      }
  
      const key = certs.keys.find(cert => cert.kid === decodedHeader.kid);
      if (!key) {
        throw new UnauthorizedException('No se encontró la clave pública correspondiente al `kid`');
      }
  
      const publicKey = key.x5c[0];
  
      // Verificar el token usando la clave pública
      try {
        jwt.verify(token, `-----BEGIN CERTIFICATE-----\n${publicKey}\n-----END CERTIFICATE-----`, {
          algorithms: ['RS256'],
        });
        return res.json({ valid: true }); // El token es válido
      } catch (error) {
        // Si el token está expirado, intentamos refrescarlo con el refresh token
        if (error.name === 'TokenExpiredError') {
          console.log('Access token expirado, intentando refrescarlo...');
          
          if (!refreshToken) {
            throw new UnauthorizedException('El refresh token es necesario para obtener uno nuevo');
          }
  
          // Validar y refrescar el token (puedes usar el refreshToken aquí)
          const newTokens = await this.refreshAccessToken(refreshToken); // Método que gestionará el refresco del token
  
          // Actualizar las cookies con el nuevo access token (y refresh token si es necesario)
          res.cookie('access_token', newTokens.access_token, { httpOnly: true, path: '/' });
          res.cookie('refresh_token', newTokens.refresh_token, { httpOnly: true, path: '/' });
          res.cookie('id_token', newTokens.id_token, { httpOnly: true, path: '/' }); // Si también deseas refrescar el id_token
  
          return res.json({ valid: true, newAccessToken: newTokens.access_token });
        }
  
        throw new UnauthorizedException('Token inválido o expirado');
      }
    } catch (error) {
      console.error('Error al verificar el token:', error);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
  
  // Método para refrescar el token
  async refreshAccessToken(refreshToken: string): Promise<any> {
    try {
      const tokenEndpoint = 'http://localhost:8080/realms/demo-realm/protocol/openid-connect/token';
  
      const body = new URLSearchParams({
        client_id: 'sistema-a',
        client_secret: 'ibjqNGu7PAszODFNbLDYlAKcZlm6CTfN', // Sustituye con tu Client Secret
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      });
  
      // Intercambiar el refresh token por nuevos tokens
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
  
      const tokens = await response.json();
  
      if (response.ok) {
        return tokens; // Devuelve los nuevos tokens (access, refresh, id)
      } else {
        throw new UnauthorizedException('No se pudo refrescar el token');
      }
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  
  

}
