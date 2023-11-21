import * as N from '@nestjs/common';
import T from './toolkit';

export class NotFound extends N.NotFoundException {
  constructor(message?: string) {
    super(
      new T.BaseModels.Response<null, undefined>({
        result: false,
        status: 404,
        data: null,
        message: {
          general: message ?? ' محتوای مورد نظر یافت نشد',
          validation: undefined,
        },
      }),
    );
  }
}

export class BadRequest extends N.BadRequestException {
  constructor(info?: { message?: string; validations?: object }) {
    super(
      new T.BaseModels.Response<null, object | undefined>({
        result: false,
        status: 400,
        data: null,
        message: {
          general:
            info?.message ??
            'درخواست نامعتبر!\nلطفاً درخواست را اصلاح و دوباره تلاش کنید',
          validation: info?.validations ?? undefined,
        },
      }),
    );
  }
}

export class UnAuthorized extends N.UnauthorizedException {
  constructor(message?: string) {
    super(
      new T.BaseModels.Response<null, undefined>({
        result: false,
        status: 401,
        data: null,
        message: {
          general:
            message ?? 'دسترسی غیرمجاز!\nبرای دسترسی، باید احراز هویت کنید.',
          validation: undefined,
        },
      }),
    );
  }
}

export class Forbidden extends N.ForbiddenException {
  constructor(message?: string) {
    super(
      new T.BaseModels.Response<null, undefined>({
        result: false,
        status: 403,
        data: null,
        message: {
          general:
            message ?? 'دسترسی ممنوع!\nشما اجازه دسترسی به این قسمت را ندارید',
          validation: undefined,
        },
      }),
    );
  }
}
