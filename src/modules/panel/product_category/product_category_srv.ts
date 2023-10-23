import * as N from '@nestjs/common';
import * as NTO from '@nestjs/typeorm';
import * as TO from 'typeorm';
import T from 'src/toolkit/toolkit';
import { ProductCategory } from './product_category_mdl';

@N.Injectable()
export class ProductCategoryService {
  //
  constructor(
    @NTO.InjectRepository(ProductCategory)
    readonly repo: TO.Repository<ProductCategory>,
  ) {}

  async exist(data: Partial<ProductCategory>): Promise<boolean> {
    return await this.repo.exist({
      where: [{ id: data.id }, { title: data.title }],
    });
  }

  async create(productCategory: ProductCategory): Promise<ProductCategory> {
    if (await this.exist(productCategory))
      throw new T.Exceptions.BadRequest({
        message: 'این دسته‌بندی تکراری است',
        validations: { title: 'این عنوان قبلا استفاده شده' },
      });
    return await this.repo.save(this.repo.create(productCategory));
  }

  async read(
    findOptions: TO.FindManyOptions<ProductCategory>,
  ): Promise<ProductCategory[]> {
    return await this.repo.find(findOptions);
  }

  async readOne(id: number): Promise<ProductCategory> {
    const ProductCategory = await this.repo.findOne({ where: { id: id } });
    if (ProductCategory === null) throw new T.Exceptions.NotFound();
    return ProductCategory;
  }

  async update(changes: Partial<ProductCategory>): Promise<ProductCategory> {
    const ProductCategory = await this.readOne(changes.id!);
    if (ProductCategory === null) throw new T.Exceptions.NotFound();
    Object.assign(ProductCategory, this.repo.create(changes));
    return await this.repo.save(ProductCategory);
  }

  async delete(ids: number[]) {
    return await this.repo.delete(ids);
  }

  async deleteOne(id: number): Promise<ProductCategory> {
    const ProductCategory = await this.readOne(id);
    if (ProductCategory === null) throw new T.Exceptions.NotFound();
    return this.repo.remove(ProductCategory);
  }
}
