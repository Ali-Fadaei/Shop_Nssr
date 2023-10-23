import * as CV from 'class-validator';
import * as M from 'src/modules/panel/user/user_mdl';

export class SignUpPD extends M.UserPD {
  //
  constructor(init: M.UserPD) {
    super(init);
  }
}

export class SignUpDTO extends M.UserDTO {
  //
  constructor(init: M.UserDTO) {
    super(init);
  }
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

export class SignInDTO implements M.UserDTO {
  //
  constructor(init: SignInDTO) {
    Object.assign(this, init);
  }
  id: number;

  firstName: string;

  lastName: string;

  mobileNumber: string;

  email: string | null;

  token: string | null;

  static fromEntity(init: M.User) {
    return new SignInDTO({
      id: init.id,
      firstName: init.firstName,
      lastName: init.lastName,
      mobileNumber: init.mobileNumber,
      email: init.email ?? null,
      token: init.token ?? null,
    });
  }
}
