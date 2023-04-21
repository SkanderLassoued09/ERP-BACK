import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { LoginAuthInput, LoginResponse } from './dto/create-auth.input';
import { JwtAuthGuard } from './jwt-auth-guard';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth-guard';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  async login(@Args('LoginAuthInput') loginAuthInput: LoginAuthInput) {
    let data = await this.authService.login(loginAuthInput);
    console.log('login', data);
    return data;
  }
}
