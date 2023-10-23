import * as N from '@nestjs/common';

import { PanelOtpConfirmPD, PanelOtpGeneratePD } from './otp_mdl';
import { PanelOtpService } from './otp_srv';
import * as M from './otp_mdl';

@N.Controller('panel/otp')
export class PanelOtpController {
  //
  constructor(private panelOtpService: PanelOtpService) {}

  @N.Post('/generate')
  async generateOtp(@N.Body() pd: PanelOtpGeneratePD) {
    return M.PanelOtp.toGenerateDto(
      await this.panelOtpService.generate(pd.mobileNumber),
    );
  }

  @N.Post('/confirm')
  async confirmOtp(@N.Body() pd: PanelOtpConfirmPD) {
    return M.PanelOtp.toConfirmDto(await this.panelOtpService.confirm(pd));
  }

  @N.Post('/reset')
  async resetPassword(@N.Body() pd: M.PanelOtpResetPasswordPD) {
    return await this.panelOtpService.changePassword(pd);
  }
}
