import * as TO from 'typeorm';
import * as CV from 'class-validator';

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

  static toDto(init: Admin) {
    return {
      id: init.id,
      firstName: init.firstName,
      lastName: init.lastName,
      nationalCode: init.nationalCode,
      mobileNumber: init.mobileNumber,
      email: init.email ?? null,
      role: init.role,
      isActive: init.isActive,
      isUsed: init.isUsed,
    };
  }

  static toTokenDto(init: Admin) {
    return {
      id: init.id,
      firstName: init.firstName,
      lastName: init.lastName,
      nationalCode: init.nationalCode,
      mobileNumber: init.mobileNumber,
      email: init.email ?? null,
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
  @CV.MinLength(10)
  @CV.MaxLength(10, { message: 'کد ملی درست نیست!' })
  // @CV.Length(10)
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

export class AdminQP {
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
  @CV.MaxLength(50)
  @CV.IsOptional()
  firstName?: string;

  @CV.IsString()
  @CV.MaxLength(50)
  @CV.IsOptional()
  lastName?: string;

  @CV.IsString()
  // @CV.MaxLength(10)
  // @CV.MinLength(10)
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

export class AdminPUD {
  //
  constructor(init: AdminPUD) {
    Object.assign(this, init);
  }

  @CV.IsString()
  @CV.MaxLength(50)
  @CV.IsOptional()
  @CV.IsNotEmpty()
  //todo: make @CV.IsNotNull
  firstName?: string;

  @CV.IsString()
  @CV.MaxLength(50)
  @CV.IsOptional()
  lastName?: string;

  @CV.IsString()
  // @CV.MaxLength(10)
  // @CV.MinLength(10)
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

  @CV.IsStrongPassword()
  @CV.IsOptional()
  password?: string;

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
      password: this.password,
      isActive: this.isActive,
    };
  }
}

export class AdminDD {
  //
  @CV.IsNumber({}, { each: true })
  ids: number[];
}
