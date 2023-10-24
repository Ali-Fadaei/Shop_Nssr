import * as N from '@nestjs/common';
import * as NTO from '@nestjs/typeorm';
import { ClientOtp } from './otp_mdl';
import { ClientAuthModule } from '../auth/auth_mdu';
import { ClientOtpController } from './otp_ctrl';
import { ClientOtpService } from './otp_srv';
import { UserModule } from 'src/modules/panel/user/user_mdu';

@N.Module({
  imports: [
    NTO.TypeOrmModule.forFeature([ClientOtp]),
    UserModule,
    ClientAuthModule,
  ],
  controllers: [ClientOtpController],
  providers: [ClientOtpService],
  exports: [ClientOtpService],
})
export class ClientOtpModule {}
