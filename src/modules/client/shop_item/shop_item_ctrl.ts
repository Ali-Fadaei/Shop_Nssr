import * as N from '@nestjs/common';
import * as M from './shop_item_mdl';
import G from 'src/guards/guards';
import { ShopItemService } from './shop_item_srv';
import { ClientJwtPayload } from 'src/guards/client_grds';

@G.UseClientGuards()
@N.Controller('/client/shopitem')
export class ShopItemController {
  //
  constructor(private service: ShopItemService) {}

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
    return M.ShopItem.toDto(
      await this.service.incCount(payload.id, data.productId),
    );
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
