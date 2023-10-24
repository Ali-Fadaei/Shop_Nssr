import T from './toolkit';
import { randomUUID, randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export async function hashPassword(password: string, salt?: string) {
  const _salt = salt ?? randomBytes(8).toString('hex');
  const hash = (
    (await scrypt(password, _salt, T.Consts.cryptoLength)) as Buffer
  ).toString('hex');
  return salt ? hash : _salt.concat(T.Consts.spliter, hash);
}

export function generateId() {
  return randomUUID();
}

export function generateOtpCode() {
  return (Math.floor(Math.random() * 9000) + 1000).toString();
}
