import * as TO from 'typeorm';
import * as CV from 'class-validator';

@TO.Entity()
export class ProductCategory {
  //
  @TO.PrimaryGeneratedColumn()
  id: number;

  @TO.Column({ unique: true })
  title: string;

  @TO.Column({
    type: 'bigint',
    default: 0,
  })
  color: number;

  @TO.Column({
    default:
      'https://ali-fadaei.storage.iran.liara.space/shop_app/products/zenbook_14x.png',
  })
  image: string;

  @TO.Column()
  isActive: boolean;

  @TO.Column()
  isUsed: boolean;

  @TO.CreateDateColumn()
  created?: Date;

  @TO.UpdateDateColumn()
  edited?: Date;

  static toDto(entity: ProductCategory) {
    return {
      id: entity.id,
      title: entity.title,
      color: entity.color,
      Image: entity.image,
      isActive: entity.isActive,
      isUsed: entity.isUsed,
    };
  }
}

export class ProductCategoryPD {
  //
  @CV.IsString()
  @CV.MaxLength(30)
  title: string;

  @CV.IsInt()
  @CV.Max(4294967295)
  color: number;

  @CV.IsUrl()
  image: string;

  @CV.IsBoolean()
  isActive: boolean;

  toEntity(): ProductCategory {
    return {
      id: -1,
      title: this.title,
      color: this.color,
      image: this.image,
      isActive: this.isActive,
      isUsed: false,
    };
  }
}

export class ProductCategoryPUD {
  //
  @CV.IsString()
  @CV.MaxLength(30)
  @CV.IsOptional()
  title?: string;

  @CV.IsInt()
  @CV.Max(4294967295)
  @CV.IsOptional()
  color?: number;

  @CV.IsUrl()
  @CV.IsOptional()
  image?: string;

  @CV.IsBoolean()
  @CV.IsOptional()
  isActive?: boolean;

  toEntity(id: number): Partial<ProductCategory> {
    return {
      id: id,
      title: this.title,
      color: this.color,
      image: this.image,
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

  toFindOptions(): TO.FindManyOptions<ProductCategory> {
    return {
      skip: this.start,
      take: this.offset,
      where: {
        title: this.title,
      },
    };
  }
}

export class ProductCategoryDD {
  //
  @CV.IsNumber({}, { each: true })
  ids: number[];
}
