import * as CV from 'class-validator';
import * as M from 'src/modules/panel/admin/admin_mdl';

export class SignInPD {
  //
  constructor(init: SignInPD) {
    Object.assign(this, init);
  }

  @CV.IsMobilePhone('fa-IR')
  mobileNumber: string;

  @CV.IsStrongPassword({})
  @CV.ValidateIf((o) => o.password != o.mobileNumber.slice(-4))
  password: string;
}

export class SignInDTO implements M.AdminDTO {
  //
  constructor(init: SignInDTO) {
    Object.assign(this, init);
  }

  id: number;

  role: number;

  firstName: string;

  lastName: string;

  nationalCode: string;

  mobileNumber: string;

  email: string | null;

  token: string | null;

  isActive: boolean;

  isUsed: boolean;

  static fromEntity(init: M.Admin) {
    return new SignInDTO({
      id: init.id,
      firstName: init.firstName,
      lastName: init.lastName,
      nationalCode: init.nationalCode,
      mobileNumber: init.mobileNumber,
      email: init.email ?? null,
      role: init.role,
      token: init.token ?? null,
      isActive: init.isActive,
      isUsed: init.isUsed,
    });
  }
}
