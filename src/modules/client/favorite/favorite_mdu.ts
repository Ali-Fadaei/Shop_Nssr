import * as N from '@nestjs/common';
import * as NTO from '@nestjs/typeorm';
import { Favorite } from './favorite_mdl';
import { FavoriteService } from './favorite_srv';
import { FavoriteController } from './favorite_ctrl';
import { ProductModule } from 'src/modules/common/product/product_mdu';
import { UserModule } from 'src/modules/panel/user/user_mdu';

@N.Module({
  imports: [
    NTO.TypeOrmModule.forFeature([Favorite]),
    UserModule,
    ProductModule,
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
