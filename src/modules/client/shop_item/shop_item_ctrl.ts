import * as N from '@nestjs/common';
import * as M from './shop_item_mdl';
import G from 'src/guards/guards';
import { ShopItemService } from './shop_item_srv';
import { ClientJwtPayload } from 'src/guards/client_grds';
import { UserService } from 'src/modules/panel/user/user_srv';
import { ProductService } from 'src/modules/common/product/product_srv';

@G.UseClientGuards()
@N.Controller('/client/shopitem')
export class ShopItemController {
  //
  constructor(
    private service: ShopItemService,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  @N.Get()
  async getShopItems(@G.BearerTokenPayload() payload: ClientJwtPayload) {
    const shopItems = await this.service.readByUserId(payload.id);
    return shopItems.map((e) => M.ShopItem.toDto(e));
  }

  @N.Post('/inc')
  async addShopItem(
    @G.BearerTokenPayload() payload: ClientJwtPayload,
    @N.Body() data: M.ShopItemPD,
  ) {
    const user = await this.userService.readOne(payload.id);
    const product = await this.productService.readOne(data.productId);
    return M.ShopItem.toDto(await this.service.incCount(user, product));
  }

  @N.Post('/dec')
  async RemoveShopItem(
    @G.BearerTokenPayload() payload: ClientJwtPayload,
    @N.Body() data: M.ShopItemPD,
  ) {
    return M.ShopItem.toDto(
      await this.service.decCount(payload.id, data.productId),
    );
  }
}
