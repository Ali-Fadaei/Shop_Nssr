import * as N from '@nestjs/common';
import R from 'src/routes';
import G from 'src/guards/guards';
import * as M from './auth_mdl';
import { PanelAuthService } from './auth_srv';

@N.Controller()
export class PanelAuthController {
  //
  constructor(private panelAuthService: PanelAuthService) {}

  @N.Post(R.panel.auth.signIn)
  async signIn(@N.Body() body: M.SignInPD) {
    return M.SignInDTO.fromEntity(await this.panelAuthService.signIn(body));
  }

  @G.UsePanelGuards()
  @N.Post(R.panel.auth.refresh)
  async refresh(@G.BearerToken() token: string) {
    return M.SignInDTO.fromEntity(await this.panelAuthService.refresh(token));
  }

  @G.UsePanelGuards()
  @N.Post(R.panel.auth.logOut)
  async logOut(@G.BearerToken() token: string) {
    return await this.panelAuthService.logOut(token);
  }
}
