export class Response<T, K> {
  //
  constructor(init: Response<T, K>) {
    Object.assign(this, init);
  }

  result: boolean;

  status: number;

  data: T;

  message: {
    general: string | null;
    validation: K;
  } | null;
}
