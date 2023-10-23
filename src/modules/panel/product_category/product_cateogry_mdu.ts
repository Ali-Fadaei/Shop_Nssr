import * as N from '@nestjs/common';
import * as NTO from '@nestjs/typeorm';
import { ProductCategory } from '../product_category/product_category_mdl';
import { ProductCategoryController } from '../product_category/product_category_ctrl';
import { ProductCategoryService } from '../product_category/product_category_srv';

@N.Module({
  imports: [NTO.TypeOrmModule.forFeature([ProductCategory])],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService],
  exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
