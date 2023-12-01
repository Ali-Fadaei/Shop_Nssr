import * as N from '@nestjs/common';
import * as NTO from '@nestjs/typeorm';
import * as TO from 'typeorm';
import T from 'src/toolkit/toolkit';
import { Favorite } from './favorite_mdl';
import { UserService } from 'src/modules/panel/user/user_srv';
import { ProductService } from 'src/modules/common/product/product_srv';

@N.Injectable()
export class FavoriteService {
  //
  constructor(
    @NTO.InjectRepository(Favorite)
    readonly repo: TO.Repository<Favorite>,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  async exist(
    id?: number,
    userId?: number,
    productId?: number,
  ): Promise<boolean> {
    return await this.repo.exist({
      relations: { user: true, product: true },
      where: [{ id: id }, { user: { id: userId }, product: { id: productId } }],
    });
  }

  async create(userId: number, productId: number): Promise<Favorite> {
    if (await this.exist(null, userId, productId))
      throw new T.Exceptions.BadRequest({
        message: 'این علاقه‌مندی تکراری است',
      });
    const user = await this.userService.readOne(userId);
    const product = await this.productService.readOne(productId);
    return await this.repo.save(
      this.repo.create({ id: -1, user: user, product: product }),
    );
  }

  async read(findOptions: TO.FindManyOptions<Favorite>): Promise<Favorite[]> {
    return await this.repo.find(findOptions);
  }

  async readOne(id: number): Promise<Favorite> {
    const favorite = await this.repo.findOne({
      relations: { user: true, product: true },
      where: { id: id },
    });
    if (favorite === null) throw new T.Exceptions.NotFound();
    return favorite;
  }

  async delete(ids: number[]) {
    return await this.repo.delete(ids);
  }

  async deleteOne(id: number): Promise<Favorite> {
    const favorite = await this.readOne(id);
    if (favorite === null) throw new T.Exceptions.NotFound();
    return this.repo.remove(favorite);
  }

  async readByUserId(userId: number): Promise<Favorite[]> {
    return await this.repo.find({
      relations: { product: { category: true } },
      where: { user: { id: userId } },
    });
  }

  async remove(userId: number, productId: number): Promise<Favorite> {
    const favorite = await this.repo.findOne({
      relations: { product: { category: true } },
      where: { user: { id: userId }, product: { id: productId } },
    });
    if (favorite === null) throw new T.Exceptions.NotFound();
    return await this.repo.remove(favorite);
  }
}
