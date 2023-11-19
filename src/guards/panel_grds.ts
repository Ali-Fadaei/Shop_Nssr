import * as N from '@nestjs/common';
import T from 'src/toolkit/toolkit';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminService } from 'src/modules/panel/admin/admin_srv';
import { Reflector } from '@nestjs/core';

export const PanelJwtStrategyId = 'panel-jwt';

export const PanelRoleId = 'panel-role';

export const PanelRole = (role: number) => N.SetMetadata(PanelRoleId, role);

export class PanelJwtPayload {
  //
  constructor(init: { id: number; role: number }) {
    Object.assign(this, init);
  }

  id: number;

  role: number;

  type = PanelJwtStrategyId;

  static fromDecodedJwt(init: { [key: string]: any }) {
    return new PanelJwtPayload({
      id: init.id,
      role: init.role,
    });
  }
}

@N.Injectable()
export class PanelJwtStrategy extends PassportStrategy(
  Strategy,
  PanelJwtStrategyId,
) {
  //
  constructor(private adminService: AdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: T.Consts.jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(request: any, payload: PanelJwtPayload) {
    request.payload = payload;
    return true;
  }
}

@N.Injectable()
export class PanelJwtGuard extends AuthGuard(PanelJwtStrategyId) {
  //
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (!user) throw new T.Exceptions.UnAuthorized();
    return super.handleRequest(err, user, info, context, status);
  }
}

@N.Injectable()
export class PanelRoleGuard implements N.CanActivate {
  //
  constructor(private reflector: Reflector) {}

  canActivate(context: N.ExecutionContext): boolean {
    const payload = context.switchToHttp().getRequest().payload;
    if (payload.type !== PanelJwtStrategyId) return true;
    const requiredRole = this.reflector.getAllAndOverride<number>(PanelRoleId, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (requiredRole === undefined || null) return true;
    const role = context.switchToHttp().getRequest().payload.role;
    if (role <= requiredRole) return true;
    else throw new T.Exceptions.Forbidden();
  }
}

export function UsePanelGuards() {
  return N.UseGuards(PanelJwtGuard, PanelRoleGuard);
}
