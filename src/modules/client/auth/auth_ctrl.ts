import * as N from '@nestjs/common';
import R from 'src/routes';
import G from 'src/guards/guards';
import * as M from './auth_mdl';
import { ClientAuthService } from './auth_srv';
import { ClientJwtPayload } from 'src/guards/client_grds';

@N.Controller()
export class ClientAuthController {
  //
  constructor(private clientAuthService: ClientAuthService) {}

  @N.Post(R.client.auth.signUp)
  async signUp(@N.Body() body: M.SignUpPD): Promise<M.SignUpDTO> {
    const user = body.toEntity();
    return M.SignUpDTO.fromEntity(await this.clientAuthService.signUp(user));
  }

  @N.Post(R.client.auth.signIn)
  async signIn(@N.Body() body: M.SignInPD): Promise<M.SignInDTO> {
    return M.SignInDTO.fromEntity(await this.clientAuthService.signIn(body));
  }

  @G.UseClientGuards()
  @N.Post(R.client.auth.refresh)
  async refresh(@G.BearerToken() token: string) {
    return M.SignInDTO.fromEntity(
      await this.clientAuthService.refreshToken(token),
    );
  }

  @G.UseClientGuards()
  @N.Post(R.client.auth.logOut)
  async signOut(@G.BearerToken() token: string) {
    return await this.clientAuthService.logOut(token);
  }

  @G.UseClientGuards()
  @N.Get(R.client.auth.signIn)
  async whoami(@G.BearerTokenPayload() payload: ClientJwtPayload) {
    return payload;
  }
}
