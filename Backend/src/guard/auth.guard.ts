import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { secretKey } from '../../config/config';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secretKey.secret,
      });

      // Attach user information to the request
      request.user = payload;

      // Check if the user has the required role
      const requiredRoles = Reflect.getMetadata(ROLES_KEY, context.getHandler());
      if (requiredRoles && !this.checkRoles(payload.role, requiredRoles)) {
        throw new UnauthorizedException('Insufficient permissions');
      }
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private checkRoles(userRoles: string | string[], requiredRoles: string[]): boolean {
    const userRolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];
    return requiredRoles.some(role => userRolesArray.includes(role));
  }
}
