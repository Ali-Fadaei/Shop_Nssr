import * as N from '@nestjs/common';
import * as NTO from '@nestjs/typeorm';
import * as TO from 'typeorm';
import T from 'src/toolkit/toolkit';
import G from 'src/guards/guards';
import { User } from './user_mdl';

@N.Injectable()
export class UserService {
  //
  constructor(@NTO.InjectRepository(User) private repo: TO.Repository<User>) {}

  async exist(user: Partial<User>): Promise<boolean> {
    return await this.repo.exist({
      where: [{ email: user.email }, { mobileNumber: user.mobileNumber }],
    });
  }

  async create(user: User): Promise<User> {
    if (await this.exist(user))
      throw new T.Exceptions.BadRequest({ message: 'کاربر تکراری است' });
    return await this.repo.save(this.repo.create(user));
  }

  async read(findOptions: TO.FindManyOptions<User>): Promise<User[]> {
    return await this.repo.find(findOptions);
  }

  async readOne(id: number): Promise<User> {
    const user = await this.repo.findOne({ where: { id: id } });
    if (user === null) throw new T.Exceptions.NotFound();
    return user;
  }

  async update(changes: Partial<User>): Promise<User> {
    const user = await this.readOne(changes.id!);
    if (user === null) throw new T.Exceptions.NotFound();
    Object.assign(user, this.repo.create(changes));
    return await this.repo.save(user);
  }

  async delete(ids: number[]) {
    return await this.repo.delete(ids);
  }

  async deleteOne(id: number): Promise<User> {
    const user = await this.readOne(id);
    if (user === null) throw new T.Exceptions.NotFound();
    return this.repo.remove(user);
  }
}
