import * as N from '@nestjs/common';
import * as M from './otp_mdl';
import { ClientOtpService } from './otp_srv';
import { User } from 'src/modules/panel/user/user_mdl';

@N.Controller('client/otp')
export class ClientOtpController {
  //
  constructor(private clientOtpService: ClientOtpService) {}

  @N.Post('/generate')
  async generateOtp(@N.Body() pd: M.ClientOtpGeneratePD) {
    return M.ClientOtp.toDto(
      await this.clientOtpService.generate(pd.mobileNumber),
    );
  }

  @N.Post('/confirm')
  async confirmOtp(@N.Body() pd: M.ClientOtpConfirmPD) {
    return User.toTokenDto(await this.clientOtpService.confirm(pd));
  }

  @N.Put('/register')
  async register(@N.Body() pd: M.ClientRegisterPUD) {
    return User.toTokenDto(await this.clientOtpService.register(pd));
  }
}
