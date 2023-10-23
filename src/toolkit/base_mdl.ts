export class Response<T, K> {
  //
  constructor(init: Response<T, K>) {
    Object.assign(this, init);
  }

  result: boolean;

  status: number;

  data: T;

  messages: {
    general: string | null;
    validations: K;
  } | null;
}
