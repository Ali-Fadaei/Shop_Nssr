import * as N from '@nestjs/common';
import * as NTO from '@nestjs/typeorm';
import * as TO from 'typeorm';
import T from 'src/toolkit/toolkit';
import { ShopItem } from './shop_item_mdl';
import { User } from 'src/modules/panel/user/user_mdl';
import { Product } from 'src/modules/common/product/product_mdl';
import { UserService } from 'src/modules/panel/user/user_srv';
import { ProductService } from 'src/modules/common/product/product_srv';

@N.Injectable()
export class ShopItemService {
  //
  constructor(
    @NTO.InjectRepository(ShopItem)
    readonly repo: TO.Repository<ShopItem>,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  async exist(data: TO.DeepPartial<ShopItem>): Promise<boolean> {
    return await this.repo.exist({
      relations: { user: true, product: true },
      where: [
        { id: data.id },
        { user: { id: data.user.id }, product: { id: data.product.id } },
      ],
    });
  }

  async create(entity: ShopItem): Promise<ShopItem> {
    if (await this.exist(entity))
      throw new T.Exceptions.BadRequest({
        message: 'این علاقه‌مندی تکراری است',
      });
    return await this.repo.save(this.repo.create(entity));
  }

  async read(findOptions: TO.FindManyOptions<ShopItem>): Promise<ShopItem[]> {
    return await this.repo.find(findOptions);
  }

  async readOne(id: number): Promise<ShopItem> {
    const shopItem = await this.repo.findOne({
      relations: { user: true, product: true },
      where: { id: id },
    });
    if (shopItem === null) throw new T.Exceptions.NotFound();
    return shopItem;
  }

  async deleteOne(id: number): Promise<ShopItem> {
    const user = await this.readOne(id);
    if (user === null) throw new T.Exceptions.NotFound();
    return this.repo.remove(user);
  }

  async readByUserId(userId: number): Promise<ShopItem[]> {
    return await this.repo.find({
      relations: { product: { category: true } },
      where: { user: { id: userId } },
      order: { created: 'asc' },
    });
  }

  async incCount(userId: number, productId: number): Promise<ShopItem> {
    const shopItem = await this.repo.findOne({
      relations: { product: { category: true } },
      where: { user: { id: userId }, product: { id: productId } },
    });
    if (shopItem === null) {
      const user = await this.userService.readOne(userId);
      const product = await this.productService.readOne(productId);
      return await this.create({
        id: -1,
        user: user,
        product: product,
        count: 1,
      });
    }
    if (shopItem.count >= 10)
      throw new T.Exceptions.BadRequest({
        message: 'تعداد نمیتواند بیشتر از 10 باشد',
      });
    shopItem.count = shopItem.count + 1;
    return await this.repo.save(shopItem);
  }

  async decCount(userId: number, productId: number): Promise<ShopItem> {
    const shopItem = await this.repo.findOne({
      relations: { product: { category: true } },
      where: { user: { id: userId }, product: { id: productId } },
    });
    if (shopItem === null) throw new T.Exceptions.NotFound();
    if (shopItem.count <= 1) {
      await this.deleteOne(shopItem.id);
      return shopItem;
    }
    shopItem.count = shopItem.count - 1;
    return await this.repo.save(shopItem);
  }
}
