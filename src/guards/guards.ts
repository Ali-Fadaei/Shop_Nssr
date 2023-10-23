import * as N from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import {
  ClientJwtPayload,
  ClientJwtStrategy,
  UseClientGuards,
  ClientRole,
} from './client_grds';

import {
  PanelJwtPayload,
  PanelJwtStrategy,
  PanelRole,
  UsePanelGuards,
} from './panel_grds';

import { UseCommonGuards } from './common_grds';

const BearerToken = N.createParamDecorator(
  (_: never, context: N.ExecutionContext): string | null => {
    const request = context.switchToHttp().getRequest();
    const bearerToken: string | null = request.headers.authorization;
    return bearerToken?.replace('Bearer', '').trim() ?? null;
  },
);

const BearerTokenPayload = N.createParamDecorator(
  (_: never, context: N.ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.payload;
  },
);

export default {
  ClientRole,
  ClientJwtPayload,
  ClientJwtStrategy,
  PanelRole,
  PanelJwtPayload,
  PanelJwtStrategy,
  BearerToken,
  BearerTokenPayload,
  UseClientGuards,
  UsePanelGuards,
  UseCommonGuards,
};
