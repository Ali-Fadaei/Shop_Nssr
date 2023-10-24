import * as TO from 'typeorm';
import * as CV from 'class-validator';
import * as CT from 'class-transformer';

export enum AdminlRole {
  superAdmin,
  admin,
  support,
}

@TO.Entity()
export class Admin {
  //
  @TO.PrimaryGeneratedColumn()
  id: number;

  @TO.Column()
  firstName: string;

  @TO.Column()
  lastName: string;

  @TO.Column({ unique: true })
  nationalCode: string;

  @TO.Column({ unique: true })
  mobileNumber: string;

  @TO.Column({ nullable: true, unique: true })
  email?: string;

  @TO.Column()
  password: string;

  @TO.Column()
  role: number;

  @TO.Column({ nullable: true })
  token?: string;

  @TO.Column()
  isActive: boolean;

  @TO.Column()
  isUsed: boolean;

  @TO.CreateDateColumn()
  created?: Date;

  @TO.UpdateDateColumn()
  edited?: Date;

  static toDto(entity: Admin) {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      nationalCode: entity.nationalCode,
      mobileNumber: entity.mobileNumber,
      email: entity.email,
      role: entity.role,
      isActive: entity.isActive,
      isUsed: entity.isUsed,
    };
  }

  static toTokenDto(init: Admin) {
    return {
      id: init.id,
      firstName: init.firstName,
      lastName: init.lastName,
      nationalCode: init.nationalCode,
      mobileNumber: init.mobileNumber,
      email: init.email,
      role: init.role,
      token: init.token,
      isActive: init.isActive,
      isUsed: init.isUsed,
    };
  }
}

export class AdminPD {
  //
  constructor(init: AdminPD) {
    Object.assign(this, init);
  }

  @CV.IsString()
  @CV.MaxLength(50)
  firstName: string;

  @CV.IsString()
  @CV.MaxLength(50)
  lastName: string;

  @CV.IsString()
  @CV.Length(10, 10, { message: 'کد ملی درست نیست!' })
  nationalCode: string;

  @CV.IsMobilePhone('fa-IR')
  mobileNumber: string;

  @CV.IsEmail()
  @CV.IsOptional()
  email?: string;

  @CV.IsEnum(AdminlRole)
  @CV.IsDefined()
  role: number;

  @CV.IsBoolean()
  isActive: boolean;

  toEntity(): Admin {
    return {
      id: -1,
      firstName: this.firstName,
      lastName: this.lastName,
      nationalCode: this.nationalCode,
      mobileNumber: this.mobileNumber,
      email: this.email,
      role: this.role,
      password: this.mobileNumber.slice(-4),
      isActive: this.isActive,
      isUsed: false,
    };
  }
}

export class AdminPUD {
  //
  constructor(init: AdminPUD) {
    Object.assign(this, init);
  }

  @CV.IsString()
  @CV.MaxLength(50)
  @CV.IsOptional()
  @CV.IsNotEmpty()
  firstName?: string;

  @CV.IsString()
  @CV.MaxLength(50)
  @CV.IsOptional()
  lastName?: string;

  @CV.IsString()
  @CV.Length(10)
  @CV.IsOptional()
  nationalCode?: string;

  @CV.IsMobilePhone('fa-IR')
  @CV.IsOptional()
  mobileNumber?: string;

  @CV.IsString()
  @CV.IsEmail()
  @CV.IsOptional()
  email?: string;

  @CV.IsEnum(AdminlRole)
  @CV.IsOptional()
  role?: number;

  @CV.IsBoolean()
  @CV.IsOptional()
  isActive?: boolean;

  toEntity(id: number): Partial<Admin> {
    return {
      id: id,
      firstName: this.firstName,
      lastName: this.lastName,
      nationalCode: this.nationalCode,
      mobileNumber: this.mobileNumber,
      email: this.email,
      role: this.role,
      isActive: this.isActive,
    };
  }
}

export class AdminQP {
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

  @CV.IsString()
  @CV.Length(10)
  @CV.IsOptional()
  nationalCode?: string;

  @CV.IsMobilePhone('fa-IR')
  @CV.IsOptional()
  mobileNumber?: string;

  @CV.IsEmail()
  @CV.IsOptional()
  email?: string;

  @CV.IsEnum(AdminlRole)
  @CV.IsOptional()
  role?: number;

  @CV.IsBoolean()
  @CV.IsOptional()
  isActive?: boolean;

  toFindOptions(): TO.FindManyOptions<Admin> {
    return {
      skip: this.start,
      take: this.offset,
      where: {
        firstName: this.firstName,
        lastName: this.lastName,
        nationalCode: this.nationalCode,
        mobileNumber: this.mobileNumber,
        email: this.email,
        role: this.role,
        isActive: this.isActive,
      },
    };
  }
}

export class AdminDD {
  //
  @CV.IsNumber({}, { each: true })
  ids: number[];
}
