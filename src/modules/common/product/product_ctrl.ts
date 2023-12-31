import * as N from '@nestjs/common';
import * as M from './product_mdl';
import G from 'src/guards/guards';
import { ProductService } from './product_srv';
import { ProductCategoryService } from '../product_category/product_category_srv';

@N.Controller('/product')
export class ProductController {
  //
  constructor(
    private service: ProductService,
    private categorySevice: ProductCategoryService,
  ) {}

  @N.Get()
  async getProducts(@N.Query() qp: M.ProductCategoryQP) {
    const products = await this.service.read(qp.toFindOptions());
    return products.map((e) => M.Product.toDto(e));
  }

  @N.Get(':id')
  async getProduct(@N.Param('id') id: number) {
    return M.Product.toDto(await this.service.readOne(id));
  }

  @G.PanelRole(0)
  @G.UsePanelGuards()
  @N.Post()
  async createProduct(@N.Body() data: M.ProductPD) {
    const category = await this.categorySevice.readOne(data.categoryId);
    return M.Product.toDto(await this.service.create(data.toEntity(category)));
  }

  @G.PanelRole(0)
  @G.UsePanelGuards()
  @N.Put(':id')
  async editProduct(@N.Param('id') id: number, @N.Body() data: M.ProductPUD) {
    let category = undefined;
    if (data.categoryId)
      category = await this.categorySevice.readOne(data.categoryId);
    return M.Product.toDto(
      await this.service.update(data.toEntity(id, category)),
    );
  }

  @G.PanelRole(0)
  @G.UsePanelGuards()
  @N.Delete()
  async deleteProduct(@N.Body() body: M.ProductDD) {
    return await this.service.delete(body.ids);
  }
}
