import * as N from '@nestjs/common';
import * as M from './otp_mdl';
import { PanelOtpService } from './otp_srv';

@N.Controller('panel/otp')
export class PanelOtpController {
  //
  constructor(private panelOtpService: PanelOtpService) {}

  @N.Post('/generate')
  async generateOtp(@N.Body() pd: M.PanelOtpGeneratePD) {
    return M.PanelOtp.toGenerateDto(
      await this.panelOtpService.generate(pd.mobileNumber),
    );
  }

  @N.Post('/confirm')
  async confirmOtp(@N.Body() pd: M.PanelOtpConfirmPD) {
    await this.panelOtpService.confirm(pd);
    return;
  }

  @N.Post('/reset')
  async resetPassword(@N.Body() pd: M.PanelOtpResetPasswordPD) {
    await this.panelOtpService.changePassword(pd);
    return;
  }
}
