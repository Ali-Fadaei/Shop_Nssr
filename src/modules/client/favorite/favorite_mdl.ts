import * as TO from 'typeorm';
import * as CV from 'class-validator';
import { User } from 'src/modules/panel/user/user_mdl';
import { Product } from 'src/modules/common/product/product_mdl';

@TO.Entity()
export class Favorite {
  //
  @TO.PrimaryGeneratedColumn()
  id: number;

  @TO.ManyToOne(() => User)
  user: User;

  @TO.ManyToOne(() => Product)
  product: Product;

  @TO.CreateDateColumn()
  created?: Date;

  @TO.UpdateDateColumn()
  edited?: Date;

  static toDto(init: Favorite) {
    return Product.toDto(init.product);
  }
}

export class FavoritePD {
  //
  @CV.IsInt()
  productId: number;

  toEntity(user: User, product: Product): Favorite {
    return {
      id: -1,
      user: user,
      product: product,
    };
  }
}

export class FavoriteDD {
  //
  @CV.IsNumber({}, { each: true })
  ids: number[];
}
