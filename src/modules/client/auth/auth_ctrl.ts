import * as N from '@nestjs/common';
import G from 'src/guards/guards';
import * as M from './auth_mdl';
import { ClientAuthService } from './auth_srv';
import { ClientJwtPayload } from 'src/guards/client_grds';
import { User } from 'src/modules/panel/user/user_mdl';

@N.Controller('client/auth')
export class ClientAuthController {
  //
  constructor(private clientAuthService: ClientAuthService) {}

  @N.Post('/signup')
  async signUp(@N.Body() body: M.SignUpPD) {
    const user = body.toEntity();
    return User.toDto(await this.clientAuthService.signUp(user));
  }

  @N.Post('/signin')
  async signIn(@N.Body() body: M.SignInPD) {
    return User.toDto(await this.clientAuthService.signIn(body));
  }

  @G.UseClientGuards()
  @N.Post('/refresh')
  async refresh(@G.BearerToken() token: string) {
    return User.toTokenDto(await this.clientAuthService.refreshToken(token));
  }

  @G.UseClientGuards()
  @N.Post('/logout')
  async signOut(@G.BearerToken() token: string) {
    return await this.clientAuthService.logOut(token);
  }

  @G.UseClientGuards()
  @N.Get('/whoami')
  async whoami(@G.BearerTokenPayload() payload: ClientJwtPayload) {
    return payload;
  }
}
