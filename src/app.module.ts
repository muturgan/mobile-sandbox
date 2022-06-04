import { Module } from '@nestjs/common';
import { HelloController } from './hello.controller';
import { AuthController } from './auth.controller';
import { Dal } from './dal';
import { JwtService } from './jwt.service';
import { JwtAuthGuard } from './jwt.guard';


@Module({
   controllers: [
      HelloController,
      AuthController,
   ],
   providers: [
      Dal,
      JwtService,
      JwtAuthGuard,
   ],
})
export class AppModule {}
