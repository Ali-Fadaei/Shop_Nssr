import * as N from '@nestjs/common';
import * as M from './product_category_mdl';
import G from 'src/guards/guards';
import { ProductCategoryService } from './product_category_srv';

@G.PanelRole(0)
@G.UsePanelGuards()
@N.Controller('panel/product-category')
export class ProductCategoryController {
  //
  constructor(private service: ProductCategoryService) {}

  @N.Get()
  async getCategories(@N.Query() qp: M.ProductCategoryQP) {
    const categories = await this.service.read(qp.toFindOptions());
    return categories.map((e) => M.ProductCategory.toDto(e));
  }

  @N.Get(':id')
  async getCategory(@N.Param('id') id: number) {
    return M.ProductCategory.toDto(await this.service.readOne(id));
  }

  @N.Post()
  async createCategory(@N.Body() data: M.ProductCategoryPD) {
    return M.ProductCategory.toDto(await this.service.create(data.toEntity()));
  }

  @N.Put(':id')
  async editCategory(
    @N.Param('id') id: number,
    @N.Body() data: M.ProductCategoryPUD,
  ) {
    return M.ProductCategory.toDto(
      await this.service.update(data.toEntity(id)),
    );
  }

  @N.Delete()
  async deleteCategory(@N.Body() body: M.ProductCategoryDD) {
    return await this.service.delete(body.ids);
  }
}
