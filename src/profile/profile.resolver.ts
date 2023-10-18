import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import {
  ClientByRegionChart,
  GetTicketByProfile,
  Profile,
  TechTickets,
} from './entities/profile.entity';
import { CreateProfileInput, TokenData } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { UseGuards } from '@nestjs/common';
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
    console.log('#################IN SUM#################');
    if (!Array.isArray(times)) {
      // console.log('');
      return '00:00:00';
    }
    if (times.length === 0) {
      console.log('Input array is empty');
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
    console.log('#################IN SUM#################');
  }

  avgTime(times: string[]): string {
    console.log(times, 'times');
    if (!Array.isArray(times)) {
      // console.log('Input is not array');
      return '00:00:00';
    }
    if (times.length === 0) {
      return '00:00:00';
    }

    if (Array.isArray(times) && times.length > 0) {
      console.log('All conditions are true :D');
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

  calculateTechCoast(time: string) {
    console.log(time, 'test');
    const [hh, mm, ss] = time.split(':').map(Number);
    const totalMilliseconds = hh * 3600000 + mm * 60000 + ss * 1000;
    const totalHours = totalMilliseconds / 3600000;
    const totalCost = totalHours * 5;
    return totalCost.toFixed(3);
  }

  @Query(() => [GetTicketByProfile])
  async getTicketByProfile() {
    let dataDiag = await this.profileService.getTicketByProfileDiag();
    let dataRep = await this.profileService.getTicketByProfileRep();
    // Combine the data from both arrays
    const combinedData = dataDiag.map((diag) => {
      const rep = dataRep.find((rep) => rep.techName === diag.techName);
      let diagCost = this.sumTimes(diag.totalDiag);
      let repCost = this.sumTimes(rep.totalRep);
      return {
        techName: diag.techName,
        totalDiag: this.sumTimes(diag.totalDiag),
        totalRep: this.sumTimes(rep.totalRep),
        techCostDiag: this.calculateTechCoast(diagCost),
        techCostRep: this.calculateTechCoast(repCost),
        moyRep: this.avgTime(rep.totalRep),
        moyDiag: this.avgTime(diag.totalDiag),
      };
    });
    console.log(combinedData, 'res');
    return combinedData;
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
