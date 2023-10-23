import * as TO from 'typeorm';
import * as CV from 'class-validator';
import { Admin } from '../admin/admin_mdl';

@TO.Entity()
export class PanelOtp {
  //
  constructor(init: PanelOtp) {
    Object.assign(this, init);
  }

  @TO.PrimaryColumn({ type: 'uuid' })
  id: string;

  @TO.Column()
  code: number;

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
}

export class PanelOtpGeneratePD {
  //
  constructor(init: PanelOtpGeneratePD) {
    Object.assign(this, init);
  }

  @CV.IsMobilePhone('fa-IR')
  mobileNumber: string;
}

export class PanelOtpGenerateDTO {
  //
  constructor(init: PanelOtpGenerateDTO) {
    Object.assign(this, init);
  }

  id: string;

  expireTime: number;

  static fromEntity(init: PanelOtp) {
    return new PanelOtpGenerateDTO({
      id: init.id!,
      expireTime: init.expireTime,
    });
  }
}

export class PanelOtpConfirmPD {
  //
  constructor(init: PanelOtpConfirmPD) {
    Object.assign(this, init);
  }

  @CV.IsUUID()
  id: string;

  @CV.IsNumber()
  code: number;
}

export class PanelOtpConfirmDTO {
  //
  constructor(init: PanelOtpConfirmDTO) {
    Object.assign(this, init);
  }

  @CV.IsUUID()
  id: string;

  static fromEntity(init: PanelOtp) {
    return new PanelOtpConfirmDTO({
      id: init.id!,
    });
  }
}

export class PanelOtpResetPasswordPD {
  //
  constructor(init: PanelOtpResetPasswordPD) {
    Object.assign(this, init);
  }

  @CV.IsUUID()
  id: string;

  @CV.IsStrongPassword()
  password: string;
}
