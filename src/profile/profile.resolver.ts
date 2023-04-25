import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { Profile } from './entities/profile.entity';
import { CreateProfileInput, TokenData } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { UseGuards } from '@nestjs/common';
import { User as CurrentUser } from 'src/auth/profile.decorator';
import { profile } from 'console';

@Resolver()
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Mutation(() => Profile)
  async createProfile(
    @Args('createProfileInput') createProfileInput: CreateProfileInput,
  ) {
    let data = await this.profileService.create(createProfileInput);
    console.log(data, 'in resolver');
    return data;
  }

  @Query(() => TokenData)
  @UseGuards(JwtAuthGuard)
  getTokenData(@CurrentUser() profile: TokenData) {
    console.log(profile);
    if (profile !== null) {
      return profile;
    }
  }

  @Query(() => Profile)
  async findOne(@Args('username') username: string) {
    return await this.profileService.findOneForAuth(username);
  }

  @Mutation(() => Profile)
  updateProfile(
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
  ) {
    return this.profileService.update(
      updateProfileInput.id,
      updateProfileInput,
    );
  }

  @Mutation(() => Profile)
  removeProfile(@Args('id', { type: () => Int }) id: number) {
    return this.profileService.remove(id);
  }
}
