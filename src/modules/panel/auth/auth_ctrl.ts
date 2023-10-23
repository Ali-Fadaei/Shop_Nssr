import * as N from '@nestjs/common';
import R from 'src/routes';
import G from 'src/guards/guards';
import * as M from './auth_mdl';
import { PanelAuthService } from './auth_srv';
import { Admin } from '../admin/admin_mdl';

@N.Controller('panel/auth')
export class PanelAuthController {
  //
  constructor(private panelAuthService: PanelAuthService) {}

  @N.Post('/signin')
  async signIn(@N.Body() body: M.SignInPD) {
    return Admin.toTokenDto(await this.panelAuthService.signIn(body));
  }

  @G.UsePanelGuards()
  @N.Post('/refresh')
  async refresh(@G.BearerToken() token: string) {
    return Admin.toTokenDto(await this.panelAuthService.refresh(token));
  }

  @G.UsePanelGuards()
  @N.Post('/logout')
  async logOut(@G.BearerToken() token: string) {
    return await this.panelAuthService.logOut(token);
  }
}
