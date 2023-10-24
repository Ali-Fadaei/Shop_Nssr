import * as TO from 'typeorm';
import * as CV from 'class-validator';
import { User } from 'src/modules/panel/user/user_mdl';

@TO.Entity()
export class ClientOtp {
  //
  @TO.PrimaryColumn({ type: 'uuid' })
  id: string;

  @TO.Column()
  code: string;

  @TO.Column()
  expireTime: number;

  @TO.OneToOne(() => User)
  @TO.JoinColumn()
  user: User;

  @TO.Column()
  isConfirmed: boolean;

  @TO.Column({ nullable: true })
  registerTime?: Date;

  @TO.CreateDateColumn()
  created?: Date;

  @TO.UpdateDateColumn()
  edited?: Date;

  static toDto(init: ClientOtp) {
    return {
      id: init.id!,
      expireTime: init.expireTime,
    };
  }
}

export class ClientOtpGeneratePD {
  //
  @CV.IsMobilePhone('fa-IR')
  mobileNumber: string;
}

export class ClientOtpConfirmPD {
  //
  @CV.IsUUID()
  id: string;

  @CV.IsString()
  @CV.Length(4, 4)
  code: string;
}

export class ClientRegisterPUD {
  //
  @CV.IsUUID()
  id: string;

  @CV.IsString()
  firstName: string;

  @CV.IsString()
  lastName: string;

  @CV.IsEmail()
  @CV.IsOptional()
  email?: string;

  @CV.IsString()
  @CV.MaxLength(100)
  address: string;

  toEntity(id: number): Partial<User> {
    return {
      id: id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      address: this.address,
      isRegistered: true,
      isActive: true,
      isUsed: false,
    };
  }
}
