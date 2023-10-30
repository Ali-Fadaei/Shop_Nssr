import * as N from '@nestjs/common';
import * as NTO from '@nestjs/typeorm';
import * as TO from 'typeorm';
import T from 'src/toolkit/toolkit';
import { Product } from './product_mdl';

@N.Injectable()
export class ProductService {
  //
  constructor(
    @NTO.InjectRepository(Product)
    readonly repo: TO.Repository<Product>,
  ) {}

  async exist(data: Partial<Product>): Promise<boolean> {
    return await this.repo.exist({
      where: [{ id: data.id }, { title: data.title }],
    });
  }

  async create(entity: Product): Promise<Product> {
    if (await this.exist(entity))
      throw new T.Exceptions.BadRequest({
        message: 'این محصول تکراری است',
        validations: { title: 'این عنوان قبلا استفاده شده' },
      });
    return await this.repo.save(this.repo.create(entity));
  }

  async read(findOptions: TO.FindManyOptions<Product>): Promise<Product[]> {
    return await this.repo.find(findOptions);
  }

  async readOne(id: number): Promise<Product> {
    const product = await this.repo.findOne({
      relations: { category: true },
      where: { id: id },
    });
    if (product === null) throw new T.Exceptions.NotFound();
    return product;
  }

  async update(changes: Partial<Product>): Promise<Product> {
    const product = await this.readOne(changes.id!);
    if (product === null) throw new T.Exceptions.NotFound();
    Object.assign(product, this.repo.create(changes));
    return await this.repo.save(product);
  }

  async delete(ids: number[]) {
    return await this.repo.delete(ids);
  }

  async deleteOne(id: number): Promise<Product> {
    const product = await this.readOne(id);
    if (product === null) throw new T.Exceptions.NotFound();
    return this.repo.remove(product);
  }
}
