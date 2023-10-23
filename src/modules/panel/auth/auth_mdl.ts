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
