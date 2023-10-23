import * as N from '@nestjs/common';

import R from 'src/routes';
import { PanelOtpConfirmPD, PanelOtpGeneratePD } from './otp_mdl';
import { PanelOtpService } from './otp_srv';
import * as M from './otp_mdl';

@N.Controller()
export class PanelOtpController {
  //
  constructor(private panelOtpService: PanelOtpService) {}

  @N.Post(R.panel.otp.generate)
  async generateOtp(@N.Body() pd: PanelOtpGeneratePD) {
    return M.PanelOtpGenerateDTO.fromEntity(
      await this.panelOtpService.generate(pd.mobileNumber),
    );
  }

  @N.Post(R.panel.otp.confirm)
  async confirmOtp(@N.Body() pd: PanelOtpConfirmPD) {
    return M.PanelOtpConfirmDTO.fromEntity(
      await this.panelOtpService.confirm(pd),
    );
  }

  @N.Post(R.panel.otp.resetPassword)
  async resetPassword(@N.Body() pd: M.PanelOtpResetPasswordPD) {
    return await this.panelOtpService.changePassword(pd);
  }
}
