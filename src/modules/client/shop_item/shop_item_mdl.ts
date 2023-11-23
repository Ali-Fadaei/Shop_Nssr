import * as N from '@nestjs/common';
import * as TO from 'typeorm';
import * as NTO from '@nestjs/typeorm';
import * as CV from 'class-validator';
import { User } from 'src/modules/panel/user/user_mdl';
import { Product } from 'src/modules/common/product/product_mdl';

@TO.Entity()
export class ShopItem {
  //
  @TO.PrimaryGeneratedColumn()
  id: number;

  @TO.ManyToOne(() => User)
  user: User;

  @TO.ManyToOne(() => Product)
  product: Product;

  @TO.Column()
  count: number;

  @TO.CreateDateColumn()
  created?: Date;

  @TO.UpdateDateColumn()
  edited?: Date;

  static toDto(init: ShopItem) {
    return {
      product: Product.toDto(init.product),
      count: init.count,
    };
  }
}

export class ShopItemPD {
  //
  @CV.IsInt()
  productId: number;

  toEntity(user: User, product: Product): TO.DeepPartial<ShopItem> {
    return {
      id: -1,
      user: user,
      product: product,
    };
  }
}
