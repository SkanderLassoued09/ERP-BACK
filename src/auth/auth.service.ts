import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthInput, LoginAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { ProfileService } from 'src/profile/profile.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private profileService: ProfileService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.profileService.findOneForAuth(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signIn(loginAuthInput: LoginAuthInput) {
    const profile = await this.profileService.findOneForAuth(
      loginAuthInput.username,
    );
    if (!profile) {
      throw new HttpException('E-mail introuvable', HttpStatus.UNAUTHORIZED);
    } else {
      const matchPassword = await bcrypt.compare(
        loginAuthInput.pass,
        profile.password,
      );
      if (!matchPassword) {
        throw new HttpException(
          'le mot de passe est erroné',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }

    if (profile) {
      const matchpassword = await bcrypt.compare(
        loginAuthInput.pass,
        profile.password,
      );
      if (matchpassword) {
        const { password, ...rest } = profile;

        return rest;
      }
    }

    return {
      token: this.jwtService.sign({
        email: profile.email,
        role: profile.role,
        firstName: profile.firstName,
      }),
      profile,
    };
    // // TODO: Generate a JWT and return it here
    // // instead of the user object
  }
}
