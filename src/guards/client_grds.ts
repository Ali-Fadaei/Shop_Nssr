import * as N from '@nestjs/common';
import T from 'src/toolkit/toolkit';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/panel/user/user_srv';
import { Reflector } from '@nestjs/core';

export const ClientJwtStrategyId = 'client-jwt';

export const ClientRoleId = 'client-role';

export const ClientRole = (role: number) => N.SetMetadata(ClientRoleId, role);

export class ClientJwtPayload {
  //
  constructor(init: { id: number; role: number }) {
    Object.assign(this, init);
  }

  id: number;

  role: number;

  type = ClientJwtStrategyId;

  static fromDecodedJwt(init: { [key: string]: any }) {
    return new ClientJwtPayload({
      id: init.id,
      role: init.role,
    });
  }
}

@N.Injectable()
export class ClientJwtStrategy extends PassportStrategy(
  Strategy,
  ClientJwtStrategyId,
) {
  //
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: T.Consts.jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(request: any, payload: ClientJwtPayload) {
    request.payload = payload;
    return true;
  }
}

@N.Injectable()
export class ClientJwtGuard extends AuthGuard(ClientJwtStrategyId) {
  //
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (!user) throw new T.Exceptions.UnAuthorized();
    return super.handleRequest(err, user, info, context, status);
  }
}

@N.Injectable()
export class ClientRoleGuard implements N.CanActivate {
  //
  constructor(private reflector: Reflector) {}

  canActivate(context: N.ExecutionContext): boolean {
    const payload = context.switchToHttp().getRequest().payload;
    if (payload.type !== ClientJwtStrategyId) return true;
    const requiredRole = this.reflector.getAllAndOverride<number>(
      ClientRoleId,
      [context.getHandler(), context.getClass()],
    );
    if (requiredRole === undefined || null) {
      return true;
    } else {
      const role = payload.role;
      if (role <= requiredRole) return true;
      else throw new T.Exceptions.Forbidden();
    }
  }
}

export function UseClientGuards() {
  return N.UseGuards(ClientJwtGuard, ClientRoleGuard);
}
