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
import { ProductModule } from '../common/product/product_mdu';
import { ProductCategory } from '../common/product_category/product_category_mdl';
import { ProductCategoryModule } from '../common/product_category/product_cateogry_mdu';
import { Product } from '../common/product/product_mdl';
import { ClientOtp } from '../client/otp/otp_mdl';
import { ClientOtpModule } from '../client/otp/otp_mdu';
import { Favorite } from '../client/favorite/favorite_mdl';
import { FavoriteModule } from '../client/favorite/favorite_mdu';
import { ShopItem } from '../client/shop_item/shop_item_mdl';
import { ShopItemModule } from '../client/shop_item/shop_item_mdu';

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
      entities: [
        Admin,
        User,
        PanelOtp,
        ProductCategory,
        Product,
        ClientOtp,
        Favorite,
        ShopItem,
      ],
      synchronize: true,
    }),
    ClientAuthModule,
    PanelAuthModule,
    AdminModule,
    UserModule,
    PanelOtpModule,
    ProductCategoryModule,
    ProductModule,
    ClientOtpModule,
    FavoriteModule,
    ShopItemModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: I.BaseResponseInterceptor,
    },
  ],
})
export class AppModule {}
