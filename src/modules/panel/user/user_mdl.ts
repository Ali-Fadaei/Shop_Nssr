import * as CV from 'class-validator';
import * as TO from 'typeorm';
import { randomBytes } from 'crypto';

@TO.Entity()
export class User {
  //
  @TO.PrimaryGeneratedColumn()
  id: number;

  @TO.Column()
  firstName: string;

  @TO.Column()
  lastName: string;

  @TO.Column()
  mobileNumber: string;

  @TO.Column({ nullable: true })
  email?: string;

  @TO.Column()
  password: string;

  @TO.Column({ nullable: true })
  token?: string;

  @TO.CreateDateColumn()
  created?: never;

  @TO.UpdateDateColumn()
  edited?: never;

  @TO.AfterLoad()
  afterLoadLog?() {
    console.log('id:', this.id, 'loaded!');
  }

  @TO.AfterInsert()
  afterInsertLog?() {
    console.log('id:', this.id, 'inserted!');
  }

  @TO.AfterUpdate()
  afterUpdateLog?() {
    console.warn('id:', this.id, 'Updated!');
  }

  @TO.AfterRemove()
  afterDeleteLog?() {
    console.warn('id:', this.id, 'deleted!');
  }

  static toDto(init: User) {
    return {
      id: init.id,
      firstName: init.firstName,
      lastName: init.lastName,
      email: init.email ?? null,
      mobileNumber: init.mobileNumber,
    };
  }
}
export class UserPD {
  //
  @CV.IsString()
  firstName: string;

  @CV.IsString()
  lastName: string;

  @CV.IsEmail()
  @CV.IsOptional()
  email?: string;

  @CV.IsMobilePhone('fa-IR')
  mobileNumber: string;

  @CV.IsString()
  password: string;

  toEntity(): User {
    return {
      id: -1,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      mobileNumber: this.mobileNumber,
      password: this.password,
    };
  }
}

export class UserQP {
  //
  @CV.IsNumber()
  @CV.IsOptional()
  start?: number;

  @CV.IsNumber()
  @CV.IsOptional()
  offset?: number;

  @CV.IsEmail()
  @CV.IsOptional()
  email?: string;

  @CV.IsMobilePhone()
  @CV.IsOptional()
  phone_number?: string;

  toFindOptions(): TO.FindManyOptions<User> {
    return {
      where: { email: this.email } || { mobileNumber: this.phone_number },
      skip: this.start,
      take: this.offset,
    };
  }
}

export class UserPUD {
  //
  @CV.IsString()
  @CV.IsOptional()
  firstName?: string;

  @CV.IsString()
  @CV.IsOptional()
  lastName?: string;

  @CV.IsMobilePhone()
  @CV.IsOptional()
  mobileNumber?: string;

  @CV.IsEmail()
  @CV.IsOptional()
  email?: string;

  @CV.IsString()
  @CV.IsOptional()
  password?: string;

  toEntity(id: number): Partial<User> {
    return {
      id: id,
      email: this.email,
      mobileNumber: this.mobileNumber,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }
}

export class UserDD {
  //
  @CV.IsNumber({}, { each: true })
  ids: number[];
}
