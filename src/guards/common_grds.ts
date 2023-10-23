import * as N from '@nestjs/common';
import T from 'src/toolkit/toolkit';
import { AuthGuard } from '@nestjs/passport';
import { ClientJwtStrategyId, ClientRoleGuard } from './client_grds';
import { PanelJwtStrategyId, PanelRoleGuard } from './panel_grds';

@N.Injectable()
export class CommonJwtGuard extends AuthGuard([
  PanelJwtStrategyId,
  ClientJwtStrategyId,
]) {
  //
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (info) throw new T.Exceptions.UnAuthorized();
    return super.handleRequest(err, user, info, context, status);
  }
}

export function UseCommonGuards() {
  return N.UseGuards(CommonJwtGuard, PanelRoleGuard, ClientRoleGuard);
}
