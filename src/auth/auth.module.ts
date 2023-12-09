import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@auth/models/entities/user.entity';
import { AuthRepository } from '@auth/auth.repository';
import { AuthService } from '@auth/auth.service';

import { AuthController } from '@auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { loadJwtConstant } from '@utils/loadJwtConstant';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: loadJwtConstant(configService),
        signOptions: { expiresIn: '12h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AuthRepository],
  controllers: [AuthController],
})
export class AuthModal {}
