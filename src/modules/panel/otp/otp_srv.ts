import * as N from '@nestjs/common';
import * as TO from 'typeorm';
import * as NTO from '@nestjs/typeorm';
import * as M from './otp_mdl';
import T from 'src/toolkit/toolkit';
import { AdminService } from '../admin/admin_srv';
import { createTransport } from 'nodemailer';

@N.Injectable()
export class PanelOtpService {
  //
  constructor(
    @NTO.InjectRepository(M.PanelOtp)
    private panelOtpRepo: TO.Repository<M.PanelOtp>,
    private adminService: AdminService,
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

  async generate(mobileNumber: string): Promise<M.PanelOtp> {
    const lastOtp = await this.panelOtpRepo.findOne({
      relations: { admin: true },
      where: { admin: { mobileNumber: mobileNumber } },
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
        await this.panelOtpRepo.remove(lastOtp);
      }
    }
    const [admin] = await this.adminService.read({
      where: { mobileNumber: mobileNumber },
    });
    if (admin == null)
      throw new T.Exceptions.NotFound('شماره موبایل در سیستم وجود ندارد');
    const code = T.Crypto.generateOtpCode();
    const otp = this.panelOtpRepo.create(
      new M.PanelOtp({
        id: T.Crypto.generateId(),
        code: code,
        admin: admin,
        expireTime: 120,
        isConfirmed: false,
      }),
    );
    await this.panelOtpRepo.save(otp);
    await this.mailTransporter.sendMail({
      from: 'X-Gate Security <security@ali-fadaei.ir>',
      to: otp.admin.email ?? 'info@ali-fadaei.ir',
      subject: 'X-Gate Panel OTP Code',
      html: `<h1>${otp.code}</h1>`,
    });
    return otp;
  }

  async confirm(info: M.PanelOtpConfirmPD) {
    const otp = await this.panelOtpRepo.findOne({ where: { id: info.id } });
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
    otp.isConfirmed = true;
    otp.confirmExpire = new Date(new Date().getTime() + 15 * 60 * 1000);
    return await this.panelOtpRepo.save(otp);
  }

  async changePassword(info: M.PanelOtpResetPasswordPD) {
    const otp = await this.panelOtpRepo.findOne({
      relations: { admin: true },
      where: { id: info.id },
    });
    if (otp === null) throw new T.Exceptions.NotFound('شناسه یافت نشد');
    if (!otp.isConfirmed)
      throw new T.Exceptions.BadRequest({ message: 'شناسه تایید نشده' });
    if (new Date().getTime() > otp.confirmExpire!.getTime()) {
      this.panelOtpRepo.remove(otp);
      throw new T.Exceptions.BadRequest({
        message: 'شناسه منقضی شده.\n برای دریافت مجدد اقدام نمایید ',
      });
    }
    otp.admin.password = await T.Crypto.hashPassword(info.password);
    otp.admin.isUsed = true;
    await this.adminService.update(otp.admin);
    await this.panelOtpRepo.remove(otp);
    return;
  }
}
