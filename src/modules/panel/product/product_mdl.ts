import * as TO from 'typeorm';
import * as CV from 'class-validator';
import { ProductCategory } from '../product_category/product_category_mdl';

@TO.Entity()
export class Product {
  //
  @TO.PrimaryGeneratedColumn()
  id: number;

  @TO.Column({
    unique: true,
  })
  title: string;

  @TO.Column({
    type: 'float',
  })
  rating: number;

  @TO.Column({
    type: 'int',
  })
  price: number;

  @TO.Column({
    default:
      'https://ali-fadaei.storage.iran.liara.space/shop_app/products/zenbook_14x.png',
  })
  image: string;

  @TO.Column({
    default: '',
  })
  description: string;

  @TO.ManyToOne(() => ProductCategory, { eager: true })
  @TO.JoinColumn()
  category: ProductCategory;

  @TO.Column()
  isActive: boolean;

  @TO.Column()
  isUsed: boolean;

  @TO.CreateDateColumn()
  created?: Date;

  @TO.UpdateDateColumn()
  edited?: Date;

  static toDto(entity: Product) {
    return {
      id: entity.id,
      title: entity.title,
      rating: entity.rating,
      price: entity.price,
      Image: entity.image,
      description: entity.description,
      category: ProductCategory.toDto(entity.category),
      isActive: entity.isActive,
      isUsed: entity.isUsed,
    };
  }
}

export class ProductPD {
  //
  @CV.IsString()
  @CV.MaxLength(30)
  title: string;

  @CV.IsNumber()
  @CV.Max(5)
  @CV.Min(0)
  rating: number;

  @CV.IsNumber()
  price: number;

  @CV.IsUrl()
  image: string;

  @CV.IsString()
  description: string;

  @CV.IsInt()
  categoryId: number;

  @CV.IsBoolean()
  isActive: boolean;

  toEntity(category: ProductCategory): Product {
    return {
      id: -1,
      title: this.title,
      rating: this.rating,
      price: this.price,
      image: this.image,
      description: this.description,
      category: category,
      isActive: this.isActive,
      isUsed: false,
    };
  }
}

export class ProductPUD {
  //
  @CV.IsString()
  @CV.MaxLength(30)
  @CV.IsOptional()
  title?: string;

  @CV.IsNumber()
  @CV.Max(5)
  @CV.Min(0)
  @CV.IsOptional()
  rating?: number;

  @CV.IsNumber()
  @CV.IsOptional()
  price?: number;

  @CV.IsUrl()
  @CV.IsOptional()
  image?: string;

  @CV.IsString()
  @CV.IsOptional()
  description?: string;

  @CV.IsInt()
  @CV.IsOptional()
  categoryId: number;

  @CV.IsBoolean()
  @CV.IsOptional()
  isActive?: boolean;

  toEntity(id: number, category?: ProductCategory): Partial<Product> {
    return {
      id: id,
      title: this.title,
      rating: this.rating,
      price: this.price,
      image: this.image,
      description: this.description,
      category: category,
      isActive: this.isActive,
    };
  }
}

export class ProductCategoryQP {
  //
  @CV.IsInt()
  @CV.IsPositive()
  @CV.Min(0)
  @CV.IsOptional()
  start?: number;

  @CV.IsInt()
  @CV.IsPositive()
  @CV.Min(10)
  @CV.Max(100)
  @CV.IsOptional()
  offset?: number;

  @CV.IsString()
  @CV.MaxLength(30)
  @CV.IsOptional()
  title?: string;

  // @CV.IsNumber()
  // @CV.Max(5)
  // @CV.Min(0)
  @CV.IsOptional()
  maxRate?: number;

  // @CV.IsNumber()
  // @CV.Max(5)
  // @CV.Min(0)
  @CV.IsOptional()
  minRate?: number;

  // @CV.IsNumber()
  @CV.IsOptional()
  minPrice?: number;

  // @CV.IsNumber()
  @CV.IsOptional()
  maxPrice?: number;

  // @CV.MaxLength(2)
  @CV.IsOptional()
  sort?: number;

  // @CV.MaxLength(2)
  @CV.IsOptional()
  order?: number;

  @CV.IsOptional()
  categoryId: number;

  // @CV.IsBoolean()
  @CV.IsOptional()
  isActive?: boolean;

  toFindOptions(): TO.FindManyOptions<Product> {
    let order: TO.FindOptionsOrder<Product> =
      this.sort === 1
        ? {
            price: { direction: this.order === 1 ? 'ASC' : 'DESC' },
          }
        : {
            rating: {
              direction: this.order === 1 ? 'ASC' : 'DESC',
            },
          };
    return {
      skip: this.start,
      take: this.offset,
      order: order,
      where: {
        category: { id: this.categoryId },
        title: this.title ? TO.Like(`%${this.title}%`) : undefined,
        rating: TO.Between(this.minRate ?? 0, this.maxRate ?? 5),
        price: TO.Between(this.minPrice ?? 0, this.maxPrice ?? 900000000),
        isActive: this.isActive,
      },
    };
  }
}

export class ProductDD {
  //
  @CV.IsNumber({}, { each: true })
  ids: number[];
}
