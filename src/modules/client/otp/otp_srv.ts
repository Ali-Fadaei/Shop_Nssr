import * as N from '@nestjs/common';
import * as NTO from '@nestjs/typeorm';
import * as TO from 'typeorm';
import * as M from './otp_mdl';
import T from 'src/toolkit/toolkit';
import { UserService } from 'src/modules/panel/user/user_srv';
import { ClientAuthService } from '../auth/auth_srv';
import { createTransport } from 'nodemailer';

@N.Injectable()
export class ClientOtpService {
  //
  constructor(
    @NTO.InjectRepository(M.ClientOtp)
    private clientOtpRepo: TO.Repository<M.ClientOtp>,
    private userService: UserService,
    private clientAuthService: ClientAuthService,
  ) {}

  mailTransporter = createTransport({
    host: process.env.MailServerHost,
    port: Number.parseInt(process.env.MailServerPort!),
    secure: false,
    auth: {
      user: process.env.MailServerUser,
      pass: process.env.MailServerPass,
    },
  });

  async generate(mobileNumber: string): Promise<M.ClientOtp> {
    const lastOtp = await this.clientOtpRepo.findOne({
      relations: { user: true },
      where: { user: { mobileNumber: mobileNumber } },
    });
    if (lastOtp !== null) {
      const durationDate = new Date(
        new Date().getTime() - lastOtp.created!.getTime(),
      );
      const durationSeconds =
        durationDate.getMinutes() * 60 + durationDate.getSeconds();
      if (durationSeconds <= lastOtp.expireTime) {
        lastOtp.expireTime = lastOtp.expireTime - durationSeconds;
        return lastOtp;
      } else {
        await this.clientOtpRepo.remove(lastOtp);
      }
    }
    let [user] = await this.userService.read({
      where: { mobileNumber: mobileNumber },
    });
    if (!user) {
      user = await this.userService.create({
        id: -1,
        mobileNumber: mobileNumber,
        firstName: 'notRegistered',
        lastName: 'notRegistered',
        address: 'notRegistered',
        isRegistered: false,
        isActive: false,
        isUsed: false,
      });
    }
    const code = T.Crypto.generateOtpCode();
    const otp = this.clientOtpRepo.create({
      id: T.Crypto.generateId(),
      code: code,
      user: user,
      expireTime: 120,
      isConfirmed: false,
    });
    return await this.clientOtpRepo.save(otp);
  }

  async confirm(info: M.ClientOtpConfirmPD) {
    const otp = await this.clientOtpRepo.findOne({
      relations: { user: true },
      where: { id: info.id },
    });
    if (otp === null) throw new T.Exceptions.NotFound('شناسه یافت نشد');
    const duration = new Date(
      new Date().getTime() - otp.created!.getTime(),
    ).getSeconds();
    if (otp.isConfirmed || duration >= otp.expireTime)
      throw new T.Exceptions.BadRequest({
        message: 'کد ورود منقضی شده.\n برای دریافت مجدد اقدام نمایید ',
      });
    if (info.code !== otp.code)
      throw new T.Exceptions.BadRequest({
        message: 'کد ورود اشتباه است.',
      });
    if (otp.user.isRegistered) {
      otp.user = await this.clientAuthService.otpSignIn(otp.user.mobileNumber);
      await this.clientOtpRepo.remove(otp);
    } else {
      otp.isConfirmed = true;
      otp.registerTime = new Date(new Date().getTime() + 15 * 60 * 1000);
      await this.clientOtpRepo.save(otp);
    }
    return otp.user;
  }

  async register(info: M.ClientRegisterPUD) {
    const otp = await this.clientOtpRepo.findOne({
      relations: { user: true },
      where: { id: info.id },
    });
    if (otp === null) throw new T.Exceptions.NotFound('شناسه یافت نشد');
    if (!otp.isConfirmed)
      throw new T.Exceptions.BadRequest({ message: 'شناسه تایید نشده' });
    if (new Date().getTime() > otp.registerTime!.getTime()) {
      this.clientOtpRepo.remove(otp);
      throw new T.Exceptions.BadRequest({
        message: 'شناسه منقضی شده.\n برای دریافت مجدد اقدام نمایید ',
      });
    }
    await this.userService.update(info.toEntity(otp.user.id));
    otp.user = await this.clientAuthService.otpSignIn(otp.user.mobileNumber);
    await this.clientOtpRepo.remove(otp);
    return otp.user;
  }
}
