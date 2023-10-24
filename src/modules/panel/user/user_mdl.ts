import * as CV from 'class-validator';
import * as TO from 'typeorm';
import * as CT from 'class-transformer';
@TO.Entity()
export class User {
  //
  @TO.PrimaryGeneratedColumn()
  id: number;

  @TO.Column()
  firstName: string;

  @TO.Column()
  lastName: string;

  @TO.Column({ unique: true })
  mobileNumber: string;

  @TO.Column({ nullable: true, unique: true })
  email?: string;

  @TO.Column()
  address: string;

  @TO.Column({ nullable: true })
  password?: string;

  @TO.Column({ nullable: true })
  token?: string;

  @TO.Column()
  isRegistered: boolean;

  @TO.Column()
  isActive: boolean;

  @TO.Column()
  isUsed: boolean;

  @TO.CreateDateColumn()
  created?: Date;

  @TO.UpdateDateColumn()
  edited?: Date;

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

  static toDto(entity: User) {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      mobileNumber: entity.mobileNumber,
      email: entity.email,
      address: entity.address,
      isRegistered: entity.isRegistered,
      isActive: entity.isActive,
      isUsed: entity.isUsed,
    };
  }

  static toTokenDto(entity: User) {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      mobileNumber: entity.mobileNumber,
      email: entity.email,
      address: entity.address,
      token: entity.token,
      isRegistered: entity.isRegistered,
      isActive: entity.isActive,
      isUsed: entity.isUsed,
    };
  }
}
export class UserPD {
  //
  @CV.IsString()
  firstName: string;

  @CV.IsString()
  lastName: string;

  @CV.IsMobilePhone('fa-IR')
  mobileNumber: string;

  @CV.IsEmail()
  @CV.IsOptional()
  email?: string;

  @CV.IsString()
  @CV.MaxLength(100)
  address: string;

  @CV.IsBoolean()
  isActive: boolean;

  toEntity(): User {
    return {
      id: -1,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      mobileNumber: this.mobileNumber,
      address: this.address,
      isRegistered: true,
      isActive: this.isActive,
      isUsed: false,
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
  @CV.MaxLength(100)
  @CV.IsOptional()
  address?: string;

  @CV.IsBoolean()
  @CV.IsOptional()
  isActive?: boolean;

  toEntity(id: number): Partial<User> {
    return {
      id: id,
      firstName: this.firstName,
      lastName: this.lastName,
      mobileNumber: this.mobileNumber,
      email: this.email,
      address: this.address,
      isActive: this.isActive,
    };
  }
}

export class UserQP {
  //
  @CV.Min(0)
  @CV.IsInt()
  @CV.IsOptional()
  @CT.Type(() => Number)
  start?: number;

  @CV.Min(1)
  @CV.Max(100)
  @CV.IsInt()
  @CV.IsOptional()
  @CT.Type(() => Number)
  offset?: number;

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

  @CV.IsBoolean()
  @CV.IsOptional()
  isActive?: boolean;

  toFindOptions(): TO.FindManyOptions<User> {
    return {
      skip: this.start,
      take: this.offset,
      where: {
        firstName: this.firstName ? TO.Like(`%${this.firstName}%`) : undefined,
        lastName: this.lastName ? TO.Like(`%${this.lastName}%`) : undefined,
        email: this.email ? TO.Like(`%${this.email}%`) : undefined,
        mobileNumber: this.mobileNumber
          ? TO.Like(`%${this.mobileNumber}%`)
          : undefined,
        isActive: this.isActive,
      },
    };
  }
}

export class UserDD {
  //
  @CV.IsNumber({}, { each: true })
  ids: number[];
}
