import * as N from '@nestjs/common';
import T from 'src/toolkit/toolkit';
import G from 'src/guards/guards';
import { AdminService } from '../admin/admin_srv';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import { PanelJwtPayload } from 'src/guards/panel_grds';
import { Admin } from '../admin/admin_mdl';
import * as M from './auth_mdl';

@N.Injectable()
export class PanelAuthService {
  //
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  payloadToToken(payload: PanelJwtPayload) {
    return this.jwtService.sign(instanceToPlain(payload));
  }

  tokenToPayload(token: string) {
    return G.PanelJwtPayload.fromDecodedJwt(
      this.jwtService.decode(token) as { [key: string]: any },
    );
  }

  async signIn(info: M.SignInPD): Promise<Admin> {
    const [admin] = await this.adminService.read({
      where: [{ mobileNumber: info.mobileNumber }],
    });
    if (admin == null)
      throw new T.Exceptions.NotFound('کاربر مورد نظر یافت نشد');
    const [storedSalt, storedHash] = admin.password.split(T.Consts.spliter);
    const hash = await T.Crypto.hashPassword(info.password, storedSalt);
    if (storedHash !== hash)
      throw new T.Exceptions.BadRequest({
        message: 'نام کاربری یا رمزعبور اشتباه است',
      });
    if (admin.isUsed) {
      admin.token = this.payloadToToken(
        new PanelJwtPayload({ id: admin.id, role: admin.role }),
      );
    }
    return await this.adminService.update(admin);
  }

  async refresh(token: string) {
    const payload = this.tokenToPayload(token);
    const admin = await this.adminService.readOne(payload.id);
    if (token !== admin.token) throw new T.Exceptions.UnAuthorized();
    return this.adminService.update({
      id: payload.id,
      token: this.payloadToToken(payload),
    });
  }

  async logOut(token: string) {
    const payload = this.tokenToPayload(token);
    await this.adminService.update({ id: payload.id, token: null! });
    return;
  }
}
