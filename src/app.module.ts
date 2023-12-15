import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@Database/database.module';
import { AuthModal } from '@auth/auth.module';
import { JwtMiddleware } from '@Middlewares/jwt.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModal,
  ],
  providers: [JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: '/api/profile/register', method: RequestMethod.ALL },
        { path: '/api/profile/login', method: RequestMethod.ALL },
      )
      .forRoutes('/*');
  }
}
