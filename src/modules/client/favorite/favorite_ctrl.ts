import * as N from '@nestjs/common';
import * as M from './favorite_mdl';
import G from 'src/guards/guards';
import { FavoriteService } from './favorite_srv';
import { ClientJwtPayload } from 'src/guards/client_grds';
import { UserService } from 'src/modules/panel/user/user_srv';
import { ProductService } from 'src/modules/common/product/product_srv';

@G.UseClientGuards()
@N.Controller('/client/favorite')
export class FavoriteController {
  //
  constructor(
    private service: FavoriteService,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  @N.Get()
  async getFavorites(@G.BearerTokenPayload() payload: ClientJwtPayload) {
    const favorites = await this.service.read(payload.id);
    return favorites.map((e) => M.Favorite.toDto(e));
  }

  @N.Post()
  async addFavorite(
    @G.BearerTokenPayload() payload: ClientJwtPayload,
    @N.Body() data: M.FavoritePD,
  ) {
    const user = await this.userService.readOne(payload.id);
    const product = await this.productService.readOne(data.productId);
    return M.Favorite.toDto(
      await this.service.create(data.toEntity(user, product)),
    );
  }

  @N.Delete()
  async RemoveFavorite(
    @G.BearerTokenPayload() payload: ClientJwtPayload,
    @N.Body() data: M.FavoriteDD,
  ) {
    return M.Favorite.toDto(
      await this.service.deleteOne(payload.id, data.ids[0]),
    );
  }
}
