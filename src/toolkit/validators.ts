import * as N from '@nestjs/common';
import T from './toolkit';
export class ValidationPipe extends N.ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        let temp = {};
        errors.forEach((e) => {
          if (e.constraints) {
            const firstMessage = Object.entries(e.constraints!)[0][1];
            temp = { ...temp, [e.property]: firstMessage };
          }
        });
        return new T.Exceptions.BadRequest({ validations: temp });
      },
    });
  }
}
