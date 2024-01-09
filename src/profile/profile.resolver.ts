import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import {
  GetTicket_Diag_Rep_ByProfile,
  Profile,
  TechTickets,
} from './entities/profile.entity';
import { CreateProfileInput, TokenData } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { User as CurrentUser } from 'src/auth/profile.decorator';
import { Role, Roles } from 'src/ticket/role-decorator';
import { RolesGuard } from 'src/auth/role-guard';

@Resolver()
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Mutation(() => Profile)
  async createProfile(
    @Args('createProfileInput') createProfileInput: CreateProfileInput,
  ) {
    let data = await this.profileService.create(createProfileInput);
    // console.log(data, 'in resolver');
    return data;
  }

  @Query(() => TokenData)
  @UseGuards(JwtAuthGuard)
  getTokenData(@CurrentUser() profile: TokenData) {
    // console.log(profile);
    if (profile !== null) {
      return profile;
    }
  }

  // @Roles(Role.ADMIN_MANAGER, Role.ADMIN_TECH)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [TechTickets])
  async getAllTech() {
    return await this.profileService.getAllTech();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [TechTickets])
  async getAllAdmins() {
    return await this.profileService.getAllAdmins();
  }

  @Roles(Role.ADMIN_MANAGER, Role.ADMIN_TECH)
  @Query(() => [Profile])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllProfiles() {
    return await this.profileService.getAllProfile();
  }

  @Query(() => Profile)
  async findOne(@Args('username') username: string) {
    return await this.profileService.findOneForAuth(username);
  }

  sumTimes(times: string[]): string {
    if (!Array.isArray(times)) {
      // console.log('');
      return '00:00:00';
    }
    if (times.length === 0) {
      return '00:00:00';
    }
    if (Array.isArray(times) && times.length > 0) {
      const totalMilliseconds = times.reduce((acc, time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return acc + hours * 3600000 + minutes * 60000 + seconds * 1000;
      }, 0);

      const sumDate = new Date(totalMilliseconds);
      const sumTimeString = `${String(sumDate.getUTCHours()).padStart(
        2,
        '0',
      )}:${String(sumDate.getUTCMinutes()).padStart(2, '0')}:${String(
        sumDate.getUTCSeconds(),
      ).padStart(2, '0')}`;

      return sumTimeString;
    }
  }

  avgTime(times: string[]): string {
    if (!Array.isArray(times)) {
      // console.log('Input is not array');
      return '00:00:00';
    }
    if (times.length === 0) {
      return '00:00:00';
    }

    if (Array.isArray(times) && times.length > 0) {
      const totalMilliseconds = times.reduce((acc, time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return acc + hours * 3600000 + minutes * 60000 + seconds * 1000;
      }, 0);

      const avgDate = new Date(totalMilliseconds / times.length);
      const sumTimeString = `${String(avgDate.getUTCHours()).padStart(
        2,
        '0',
      )}:${String(avgDate.getUTCMinutes()).padStart(2, '0')}:${String(
        avgDate.getUTCSeconds(),
      ).padStart(2, '0')}`;

      return sumTimeString;
    }
  }

  @Query(() => [GetTicket_Diag_Rep_ByProfile])
  async getTechWorkVolume(@Args('givenPrice') givenPrice: number) {
    let dataDiag = await this.profileService.getTicketByProfileDiag();
    let dataRep = await this.profileService.getTicketByProfileRep();

    function calculateTotalTime(arr) {
      if (arr.length === 0) {
        return 0;
      }
      const totalMinutes = arr.reduce((acc, timeStr) => {
        const [hours, minutes, seconds] = timeStr.trim().split(':').map(Number);
        return acc + hours * 60 + minutes + seconds / 60;
      }, 0);
      return Math.round(totalMinutes);
    }

    const result: GetTicket_Diag_Rep_ByProfile[] = [];
    dataDiag.forEach((diag) => {
      const profile = new GetTicket_Diag_Rep_ByProfile();

      profile.techName = diag.techName;
      profile.totalDiag = calculateTotalTime(diag.totalDiag);
      profile.moyDiag =
        diag.totalDiag.length === 0
          ? 0
          : calculateTotalTime(diag.totalDiag) / diag.totalDiag.length;

      profile.techCostDiag =
        (calculateTotalTime(diag.totalDiag) / 60) * givenPrice;

      const rep = dataRep.forEach((r) => r.techName === diag.techName);
      if (rep) {
        profile.totalRep = calculateTotalTime(rep.totalRep);
        profile.moyRep =
          diag.totalRep.length === 0
            ? 0
            : calculateTotalTime(diag.totalRep) / diag.totalRep.length;
        profile.techCostRep =
          (calculateTotalTime(diag.totalRep) / 60) * givenPrice;
      }
      result.push(profile);
    });

    return result;
  }

  @Mutation(() => Boolean)
  updateProfile(
    @Args('_id') _id: string,
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
  ) {
    const update = this.profileService.updateProfile(_id, updateProfileInput);
    if (update) {
      return true;
    } else {
      return false;
    }
  }
  @Mutation(() => Boolean)
  deleteProfile(@Args('_id') _id: string) {
    const update = this.profileService.deleteUser(_id);
    if (update) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Profile)
  removeProfile(@Args('id', { type: () => Int }) id: number) {
    return this.profileService.remove(id);
  }
}
