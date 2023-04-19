import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { LoginAuthInput, LoginResponse } from './dto/create-auth.input';
import { JwtAuthGuard } from './jwt-auth-guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(JwtAuthGuard)
  async login(@Args('LoginAuthInput') loginAuthInput: LoginAuthInput) {
    return this.authService.signIn(loginAuthInput);
  }
}
