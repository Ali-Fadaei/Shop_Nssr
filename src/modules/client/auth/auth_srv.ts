import * as N from '@nestjs/common';
import T from 'src/toolkit/toolkit';
import G from 'src/guards/guards';
import { User } from 'src/modules/panel/user/user_mdl';
import { UserService } from 'src/modules/panel/user/user_srv';
import { JwtService } from '@nestjs/jwt';
import { SignInPD } from './auth_mdl';
import { instanceToPlain } from 'class-transformer';
import { ClientJwtPayload } from 'src/guards/client_grds';

@N.Injectable()
export class ClientAuthService {
  //
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(user: User): Promise<User> {
    return await this.userService.create(user);
  }

  payloadToToken(payload: ClientJwtPayload) {
    return this.jwtService.sign(instanceToPlain(payload));
  }

  tokenToPayload(token: string) {
    return G.ClientJwtPayload.fromDecodedJwt(
      this.jwtService.decode(token) as { [key: string]: any },
    );
  }

  async signIn(info: SignInPD): Promise<User> {
    const [user] = await this.userService.read({
      where: [{ email: info.email }, { mobileNumber: info.mobileNumber }],
    });
    if (user === null) throw new T.Exceptions.NotFound();
    const [storedSalt, storedHash] = user.password.split(T.Consts.spliter);
    const hash = await T.Crypto.hashPassword(info.password, storedSalt);
    if (storedHash !== hash) throw new T.Exceptions.UnAuthorized();
    user.token = this.payloadToToken(
      new ClientJwtPayload({ id: user.id, role: 1 }),
    );
    return await this.userService.update(user);
  }

  async otpSignIn(info: string): Promise<User> {
    const [user] = await this.userService.read({
      where: { mobileNumber: info },
    });
    if (user === null) throw new T.Exceptions.NotFound();
    user.token = this.payloadToToken(
      new ClientJwtPayload({ id: user.id, role: 1 }),
    );
    return await this.userService.update(user);
  }

  async refreshToken(token: string) {
    const payload = this.tokenToPayload(token);
    const user = await this.userService.readOne(payload.id);
    if (token !== user.token) throw new T.Exceptions.UnAuthorized();
    return this.userService.update({
      id: payload.id,
      token: this.payloadToToken(payload),
    });
  }

  async logOut(token: string) {
    const payload = this.tokenToPayload(token);
    await this.userService.update({ id: payload.id, token: null! });
    return;
  }
}
