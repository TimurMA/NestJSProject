import { createHmac } from 'crypto';

export const createHmacKey = (
  secret: string,
  algorithm: string = 'sha256',
): string => {
  return createHmac(algorithm, secret).digest('hex');
};
