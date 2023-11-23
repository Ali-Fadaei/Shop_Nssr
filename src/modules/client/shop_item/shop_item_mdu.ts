import * as N from '@nestjs/common';
import * as NTO from '@nestjs/typeorm';
import { ProductModule } from 'src/modules/common/product/product_mdu';
import { UserModule } from 'src/modules/panel/user/user_mdu';
import { ShopItem } from './shop_item_mdl';
import { ShopItemController } from './shop_item_ctrl';
import { ShopItemService } from './shop_item_srv';

@N.Module({
  imports: [
    NTO.TypeOrmModule.forFeature([ShopItem]),
    UserModule,
    ProductModule,
  ],
  controllers: [ShopItemController],
  providers: [ShopItemService],
  exports: [ShopItemService],
})
export class ShopItemModule {}
