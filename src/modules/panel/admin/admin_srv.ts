import * as N from '@nestjs/common';
import * as NTO from '@nestjs/typeorm';
import * as TO from 'typeorm';
import T from 'src/toolkit/toolkit';
import { Admin } from './admin_mdl';

@N.Injectable()
export class AdminService {
  //
  constructor(
    @NTO.InjectRepository(Admin) readonly repo: TO.Repository<Admin>,
  ) {
    const superAdmin = new Admin({
      id: -1,
      role: 0,
      firstName: 'super',
      lastName: 'admin',
      mobileNumber: '09144154202',
      nationalCode: '1362137626',
      password: '4202',
      email: 'ali.fadaei.424@gmail.com',
      isActive: true,
      isUsed: true,
    });
    this.isAdminExist(superAdmin).then((exist) => {
      if (!exist) this.create(superAdmin);
    });
  }

  async isAdminExist(admin: Partial<Admin>): Promise<boolean> {
    return await this.repo.exist({
      where: [
        { id: admin.id },
        { mobileNumber: admin.mobileNumber },
        { nationalCode: admin.nationalCode },
        { email: admin.email },
      ],
    });
  }

  async create(admin: Admin): Promise<Admin> {
    if (await this.isAdminExist(admin))
      throw new T.Exceptions.BadRequest({ message: 'این کاربر تکراری است' });
    admin.password = await T.Crypto.hashPassword(admin.password);
    return await this.repo.save(this.repo.create(admin));
  }

  async read(findOptions: TO.FindManyOptions<Admin>): Promise<Admin[]> {
    return await this.repo.find(findOptions);
  }

  async readOne(id: number): Promise<Admin> {
    const admin = await this.repo.findOne({ where: { id: id } });
    if (admin === null) throw new T.Exceptions.NotFound();
    return admin;
  }

  async update(changes: Partial<Admin>): Promise<Admin> {
    const admin = await this.readOne(changes.id!);
    if (admin === null) throw new T.Exceptions.NotFound();
    Object.assign(admin, this.repo.create(changes));
    return await this.repo.save(admin);
  }

  async delete(ids: number[]) {
    return await this.repo.delete(ids);
  }

  async deleteOne(id: number): Promise<Admin> {
    const admin = await this.readOne(id);
    if (admin === null) throw new T.Exceptions.NotFound();
    return this.repo.remove(admin);
  }
}
