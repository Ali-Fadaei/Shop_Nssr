import * as N from '@nestjs/common';
import G from 'src/guards/guards';
import T from 'src/toolkit/toolkit';
import { JwtModule } from '@nestjs/jwt';
import { PanelAuthController } from './auth_ctrl';
import { PanelAuthService } from './auth_srv';
import { AdminModule } from 'src/modules/panel/admin/admin_mdu';

@N.Module({
  imports: [
    AdminModule,
    JwtModule.register({
      secret: T.Consts.jwtSecret,
      signOptions: { expiresIn: process.env.PJwtEx },
    }),
  ],
  controllers: [PanelAuthController],
  providers: [PanelAuthService, G.PanelJwtStrategy],
})
export class PanelAuthModule {}
