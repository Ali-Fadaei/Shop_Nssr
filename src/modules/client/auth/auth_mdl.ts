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
