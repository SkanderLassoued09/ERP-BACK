import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ClientService } from './client.service';
import { CalendarChart, ChartType, Client } from './entities/client.entity';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { Role, Roles } from 'src/ticket/role-decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { RolesGuard } from 'src/auth/role-guard';
import { ClientByRegionChart } from 'src/profile/entities/profile.entity';

@Resolver(() => Client)
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  @Mutation(() => Client)
  async createClient(
    @Args('createClientInput') createClientInput: CreateClientInput,
    @Args('compClient') type: string,
  ) {
    return this.clientService.create(createClientInput, type);
  }
  // @Roles(Role.ADMIN_MANAGER, Role.ADMIN_TECH)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Query(() => [Client])
  // async getAllClientCompany() {
  //   return await this.clientService.getAllClientCompany();
  // }

  // @Roles(Role.ADMIN_MANAGER, Role.ADMIN_TECH,Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Client])
  async getAllClient() {
    return await this.clientService.getListOfClient();
  }

  // @Roles(Role.ADMIN_MANAGER, Role.ADMIN_TECH)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Client])
  async getAllCompany() {
    return await this.clientService.getListOfCompany();
  }

  @Query(() => [ClientByRegionChart])
  async getClientByRegion() {
    return await this.clientService.getClientByRegion();
  }

  @Query(() => [ChartType])
  getClientCompanyChart() {
    return this.clientService.getClientCompanyChart();
  }

  @Query(() => [CalendarChart])
  getClientLastMonth() {
    return this.clientService.getClientLastMonth();
  }

  @Query(() => Client, { name: 'client' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.clientService.findOne(id);
  }

  @Mutation(() => Client)
  updateClient(
    @Args('updateClientInput') updateClientInput: UpdateClientInput,
  ) {
    return this.clientService.update(updateClientInput.id, updateClientInput);
  }

  @Mutation(() => Client)
  removeClient(@Args('id', { type: () => Int }) id: number) {
    return this.clientService.remove(id);
  }
}
