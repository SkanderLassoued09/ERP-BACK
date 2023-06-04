import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TicketService } from './ticket.service';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { Role, Roles } from './role-decorator';
import { RolesGuard } from 'src/auth/role-guard';
import { User as CurrentUser } from 'src/auth/profile.decorator';
import { Profile } from 'src/profile/entities/profile.entity';

@Resolver(() => Ticket)
export class TicketResolver {
  constructor(private readonly ticketService: TicketService) {}

  @Mutation(() => Ticket)
  async createTicket(
    @Args('createTicketInput') createTicketInput: CreateTicketInput,
  ) {
    return await this.ticketService.create(createTicketInput);
  }

  // @Roles(Role.ADMIN_MANAGER, Role.ADMIN_TECH)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Ticket])
  async getTickets() {
    return await this.ticketService.getTickets();
  }

  @Query(() => Ticket, { name: 'ticket' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.ticketService.findOne(id);
  }

  @Mutation(() => Boolean)
  updateTicket(
    @Args('updateTicketInput') updateTicketInput: UpdateTicketInput,
    @Args('_id') _id: string,
  ) {
    let updateTicket = this.ticketService.updateTicketBytechForDiagnostic(
      _id,
      updateTicketInput,
    );

    if (updateTicket) {
      console.log('ticket update');
      return true;
    } else {
      false;
    }
  }

  @Mutation(() => Boolean)
  updateStatusToInProgress(@Args('_id') _id: string) {
    let updateStatus = this.ticketService.updateStatus(_id);
    if (updateStatus) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  updateStatusToFinish(@Args('_id') _id: string) {
    let updateStatus = this.ticketService.updateStatusInFinish(_id);
    if (updateStatus) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async isOpen(@Args('_id') _id: string) {
    let isOpen = await this.ticketService.isOpen(_id);

    if (isOpen) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async changeStatus(@Args('_id') _id: string, @Args('status') status: string) {
    let change = await this.ticketService.changeSelectedStatus(_id, status);

    if (change) {
      return true;
    } else {
      return false;
    }
  }
  // @Roles(Role.TECH, Role.ADMIN_MANAGER, Role.ADMIN_TECH, Role.MAGASIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Ticket])
  async getTicketByTech(@CurrentUser() profile: Profile) {
    return await this.ticketService.getTicketByTech(
      profile.username,
      profile.role,
    );
  }

  @Mutation(() => Ticket)
  update() {
    return this.ticketService.updateGlag();
  }
}
