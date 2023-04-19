import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { ProfileModule } from 'src/profile/profile.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ProfileService } from 'src/profile/profile.service';
import { LocalStrategy } from './local.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileSchema } from 'src/profile/entities/profile.entity';

@Module({
  imports: [
    ProfileModule,
    PassportModule,
    JwtModule.register({
      signOptions: { expiresIn: '365d' },
      secret: 'hide-me',
    }),
    MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }]),
  ],
  providers: [AuthResolver, AuthService, ProfileService, LocalStrategy],
})
export class AuthModule {}
