import * as N from '@nestjs/common';
import { ServerResponse } from 'http';
import { map, Observable } from 'rxjs';
import T from 'src/toolkit/toolkit';

export class BaseResponseInterceptor implements N.NestInterceptor {
  intercept(
    context: N.ExecutionContext,
    next: N.CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //Before Request Sent to RouteHandler
    return next.handle().pipe(
      map((data: any) => {
        //After executed Route Handler , before response sent to client.
        const ctx = context.switchToHttp();
        const res: ServerResponse = ctx.getResponse();
        const resStatusCode = res.statusCode;
        const dataIsMessage = typeof data == 'string';
        return new T.BaseModels.Response<any, undefined>({
          result: resStatusCode === 200 || resStatusCode === 201,
          status: resStatusCode,
          data: dataIsMessage ? null : data,
          message: dataIsMessage
            ? { general: data, validation: undefined }
            : null,
        });
      }),
    );
  }
}

//Decorator Definition
export function UseBaseResponse() {
  return N.UseInterceptors(new BaseResponseInterceptor());
}
