import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TicketService } from './ticket.service';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { Role, Roles } from './role-decorator';
import { RolesGuard } from 'src/auth/role-guard';

@Resolver(() => Ticket)
export class TicketResolver {
  constructor(private readonly ticketService: TicketService) {}

  @Mutation(() => Ticket)
  async createTicket(
    @Args('createTicketInput') createTicketInput: CreateTicketInput,
  ) {
    return await this.ticketService.create(createTicketInput);
  }

  @Roles(Role.ADMIN_MANAGER, Role.ADMIN_TECH)
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

  @Mutation(() => Ticket)
  removeTicket(@Args('id', { type: () => Int }) id: number) {
    return this.ticketService.remove(id);
  }
}
