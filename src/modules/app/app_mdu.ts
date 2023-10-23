import * as N from '@nestjs/common';
import * as NTO from '@nestjs/typeorm';
import I from 'src/interceptors/interceptors';
import { UserModule } from 'src/modules/panel/user/user_mdu';
import { User } from 'src/modules/panel/user/user_mdl';
import { ClientAuthModule } from '../client/auth/auth_mdu';
import { PanelAuthModule } from 'src/modules/panel/auth/auth_mdu';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AdminModule } from '../panel/admin/admin_mdu';
import { Admin } from '../panel/admin/admin_mdl';
import { PanelOtp } from '../panel/otp/otp_mdl';
import { PanelOtpModule } from '../panel/otp/otp_mdu';

@N.Module({
  imports: [
    NTO.TypeOrmModule.forRoot({
      type: 'postgres',
      logger: 'advanced-console',
      host: process.env.DataBaseHost,
      port: Number.parseInt(process.env.DataBasePort),
      database: process.env.DataBaseName,
      username: process.env.DataBaseUser,
      password: process.env.DataBasePassword,
      entities: [Admin, User, PanelOtp],
      synchronize: true,
    }),
    ClientAuthModule,
    PanelAuthModule,
    AdminModule,
    UserModule,
    PanelOtpModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: I.BaseResponseInterceptor,
    },
  ],
})
export class AppModule {}
