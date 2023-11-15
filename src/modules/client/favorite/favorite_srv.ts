import * as N from '@nestjs/common';
import * as NTO from '@nestjs/typeorm';
import * as TO from 'typeorm';
import T from 'src/toolkit/toolkit';
import { Favorite } from './favorite_mdl';

@N.Injectable()
export class FavoriteService {
  //
  constructor(
    @NTO.InjectRepository(Favorite)
    readonly repo: TO.Repository<Favorite>,
  ) {}

  async exist(data: Partial<Favorite>): Promise<boolean> {
    return await this.repo.exist({
      relations: { user: true, product: true },
      where: [
        { id: data.id },
        { user: { id: data.user.id }, product: { id: data.product.id } },
      ],
    });
  }

  async create(entity: Favorite): Promise<Favorite> {
    if (await this.exist(entity))
      throw new T.Exceptions.BadRequest({
        message: 'این علاقه‌مندی تکراری است',
      });
    return await this.repo.save(this.repo.create(entity));
  }

  async read(userId: number): Promise<Favorite[]> {
    return await this.repo.find({
      relations: { product: { category: true } },
      where: { user: { id: userId } },
    });
  }

  async readOne(id: number): Promise<Favorite> {
    const product = await this.repo.findOne({
      relations: { user: true, product: true },
      where: { id: id },
    });
    if (product === null) throw new T.Exceptions.NotFound();
    return product;
  }

  async delete(ids: number[]) {
    return await this.repo.delete(ids);
  }

  async deleteOne(id: number): Promise<Favorite> {
    const favorite = await this.readOne(id);
    if (favorite === null) throw new T.Exceptions.NotFound();
    return this.repo.remove(favorite);
  }
}
