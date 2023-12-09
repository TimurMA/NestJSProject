import { ConfigService } from '@nestjs/config';
import { createHmacKey } from '@utils/createHmacKey';

export const loadJwtConstant = (
  configService: ConfigService,
  algorithm: string = 'sha256',
) => {
  return createHmacKey(configService.getOrThrow('JWT_SECRET'), algorithm);
};
