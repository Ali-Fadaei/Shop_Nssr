import * as N from '@nestjs/common';
import * as NTO from '@nestjs/typeorm';
import { PanelOtp } from './otp_mdl';
import { PanelOtpController } from './otp_ctrl';
import { PanelOtpService } from './otp_srv';
import { AdminModule } from '../admin/admin_mdu';

@N.Module({
  imports: [NTO.TypeOrmModule.forFeature([PanelOtp]), AdminModule],
  controllers: [PanelOtpController],
  providers: [PanelOtpService],
  exports: [PanelOtpService],
})
export class PanelOtpModule {}
