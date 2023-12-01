import * as N from '@nestjs/common';
import * as M from './favorite_mdl';
import G from 'src/guards/guards';
import { FavoriteService } from './favorite_srv';
import { ClientJwtPayload } from 'src/guards/client_grds';

@G.UseClientGuards()
@N.Controller('/client/favorite')
export class FavoriteController {
  //
  constructor(private service: FavoriteService) {}

  @N.Get()
  async getFavorites(@G.BearerTokenPayload() payload: ClientJwtPayload) {
    const favorites = await this.service.readByUserId(payload.id);
    return favorites.map((e) => M.Favorite.toDto(e));
  }

  @N.Post()
  async addFavorite(
    @G.BearerTokenPayload() payload: ClientJwtPayload,
    @N.Body() data: M.FavoritePD,
  ) {
    return M.Favorite.toDto(
      await this.service.create(payload.id, data.productId),
    );
  }

  @N.Delete()
  async RemoveFavorite(
    @G.BearerTokenPayload() payload: ClientJwtPayload,
    @N.Body() data: M.FavoriteDD,
  ) {
    return M.Favorite.toDto(await this.service.remove(payload.id, data.ids[0]));
  }
}
