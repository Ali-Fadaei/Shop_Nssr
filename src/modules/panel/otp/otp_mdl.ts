import * as TO from 'typeorm';
import * as CV from 'class-validator';
import { Admin } from '../admin/admin_mdl';

@TO.Entity()
export class PanelOtp {
  //
  @TO.PrimaryColumn({ type: 'uuid' })
  id: string;

  @TO.Column()
  code: string;

  @TO.Column()
  expireTime: number;

  @TO.OneToOne(() => Admin)
  @TO.JoinColumn()
  admin: Admin;

  @TO.Column()
  isConfirmed: boolean;

  @TO.Column({ nullable: true })
  confirmExpire?: Date;

  @TO.CreateDateColumn()
  created?: Date;

  @TO.UpdateDateColumn()
  edited?: Date;

  static toGenerateDto(init: PanelOtp) {
    return {
      id: init.id!,
      expireTime: init.expireTime,
    };
  }
}

export class PanelOtpGeneratePD {
  //
  @CV.IsMobilePhone('fa-IR')
  mobileNumber: string;
}

export class PanelOtpConfirmPD {
  //
  @CV.IsUUID()
  id: string;

  @CV.IsString()
  @CV.Length(4, 4)
  code: string;
}
export class PanelOtpResetPasswordPD {
  //
  @CV.IsUUID()
  id: string;

  @CV.IsStrongPassword()
  password: string;
}
