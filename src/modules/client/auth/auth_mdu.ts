import * as N from '@nestjs/common';
import T from 'src/toolkit/toolkit';
import G from 'src/guards/guards';
import { JwtModule } from '@nestjs/jwt';
import { ClientAuthController } from './auth_ctrl';
import { ClientAuthService } from './auth_srv';
import { UserModule } from 'src/modules/panel/user/user_mdu';

@N.Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: T.Consts.jwtSecret,
      signOptions: { expiresIn: process.env.CJwtEx },
    }),
  ],
  controllers: [ClientAuthController],
  providers: [ClientAuthService, G.ClientJwtStrategy],
  exports: [ClientAuthService],
})
export class ClientAuthModule {}
