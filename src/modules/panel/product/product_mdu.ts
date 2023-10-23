import * as N from '@nestjs/common';
import * as NTO from '@nestjs/typeorm';
import { Product } from './product_mdl';
import { ProductCategoryModule } from '../product_category/product_cateogry_mdu';
import { ProductController } from './product_ctrl';
import { ProductService } from './product_srv';

@N.Module({
  imports: [NTO.TypeOrmModule.forFeature([Product]), ProductCategoryModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
