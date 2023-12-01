import * as CV from 'class-validator';
import * as M from 'src/modules/panel/user/user_mdl';

export class SignUpPD extends M.UserPD {
  //
}

export class SignInPD {
  //
  constructor(init: SignInPD) {
    Object.assign(this, init);
  }

  @CV.IsEmail()
  @CV.ValidateIf((o) => o.email || !o.mobileNumber)
  email: string;

  @CV.IsMobilePhone()
  @CV.ValidateIf((o) => o.mobileNumber || !o.email)
  mobileNumber: string;

  @CV.IsString()
  password: string;
}

export class ProfileUpdatePUD {
  //
  @CV.IsString()
  @CV.IsOptional()
  firstName: string;

  @CV.IsString()
  @CV.IsOptional()
  lastName: string;

  @CV.IsEmail()
  @CV.IsOptional()
  email?: string;

  @CV.IsString()
  @CV.MaxLength(100)
  @CV.IsOptional()
  address: string;

  toEntity(id: number): Partial<M.User> {
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
