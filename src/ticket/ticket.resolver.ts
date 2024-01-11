import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
} from '@nestjs/graphql';
import { TicketService } from './ticket.service';
import {
  NotificationTech,
  ResponseDelete,
  Ticket,
  Totality,
} from './entities/ticket.entity';
import {
  CreateTicketInput,
  Filter,
  MagasinUpdateData,
} from './dto/create-ticket.input';
import {
  UpdateDevisOnlyEntity,
  UpdateTicket,
  UpdateTicketInput,
  UpdateTicketManager,
} from './dto/update-ticket.input';
import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { Role, Roles } from './role-decorator';
import { RolesGuard } from 'src/auth/role-guard';
import { User as CurrentUser } from 'src/auth/profile.decorator';
import { Profile } from 'src/profile/entities/profile.entity';
import { IssueChart } from 'src/issue/entities/issue.entity';
import { ROLE } from 'src/auth/roles';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => Ticket)
export class TicketResolver {
  constructor(
    private readonly ticketService: TicketService,
    private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => Ticket)
  async createTicket(
    @Args('createTicketInput') createTicketInput: CreateTicketInput,
  ) {
    console.log(createTicketInput, 'In resolver ticket');
    return await this.ticketService.create(createTicketInput);
  }

  // @Roles(Role.ADMIN_MANAGER, Role.ADMIN_TECH)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Ticket])
  async getTickets(
    @Args('numberOfTicketPerPage') numberOfTicketPerPage: number,
    @Args('page') page: number,
  ) {
    try {
      return await this.ticketService.getTickets(numberOfTicketPerPage, page);
    } catch (error) {
      console.error('Error in getTickets resolver:', error);
      throw new Error('Error fetching tickets'); // Adjust the error message as needed
    }
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Query(() => [Ticket])
  // async getTicketForCoordinator() {
  //   return await this.ticketService.getTicketForCoordinator();
  // }

  @Query(() => Ticket, { name: 'ticket' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.ticketService.findOne(id);
  }

  @Query(() => [IssueChart])
  getIssuesChart() {
    return this.ticketService.getIssuesChart();
  }

  @Query(() => [Totality])
  async totality() {
    return await this.ticketService.getTotality();
  }

  @Mutation(() => Boolean)
  updateTicket(
    @Args('updateTicketInput') updateTicketInput: UpdateTicketInput,
    @Args('_id') _id: string,
  ) {
    console.log(updateTicketInput, 'updateTicketInput');
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
  async getTicketByTech(
    @CurrentUser() profile: Profile,
    // @Args('numberOfTicketPerPage') numberOfTicketPerPage: number,
    // @Args('skip') skip: number,
  ) {
    return await this.ticketService.getTicketByTech(
      profile.username,
      profile.role,
      // numberOfTicketPerPage,
      // skip,
    );
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Ticket])
  async getTicketForAdminTech(
    @CurrentUser() profile: Profile,
    // @Args('numberOfTicketPerPage') numberOfTicketPerPage: number,
    // @Args('skip') skip: number,
  ) {
    return await this.ticketService.getTicketForAdminTech(
      profile.username,
      // profile.role,
      // numberOfTicketPerPage,
      // skip,
    );
  }

  @Mutation(() => Boolean)
  async magasinUpdate(
    @Args('magasinUpdateData') magasinUpdateData: MagasinUpdateData,
  ) {
    let magasin = this.ticketService.updateMagasin(magasinUpdateData);
    if (magasin) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async makeTicketAvailableForAdmin(@Args('_id') _id: string) {
    let magasin = this.ticketService.makeTicketAvailableForAdmin(_id);
    if (magasin) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async noReparableNoPDR(@Args('_id') _id: string) {
    let magasin = this.ticketService.noReparableNoPDR(_id);
    if (magasin) {
      return true;
    } else {
      return false;
    }
  }

  // @Roles(Role.ADMIN_MANAGER,Role.ADMIN_TECH)
  // @UseGuards(JwtAuthGuard,RolesGuard)
  @Query(() => [Ticket])
  async getTicketMagasinFinie() {
    return this.ticketService.getTicketMagasinFinie();
  }

  @Query(() => [Ticket])
  async getFinishedTicket() {
    return this.ticketService.getFinishedTicket();
  }

  @Mutation(() => Boolean)
  affectationFinalPrice(
    @Args('_id', { nullable: true }) _id: string,
    @Args('finalPrice', { nullable: true }) finalPrice: string,
  ) {
    let affectationPrice = this.ticketService.affectationFinalPrice(
      _id,
      finalPrice,
    );
    console.log(affectationPrice, 'affectationPrice');
    if (affectationPrice) {
      console.log(affectationPrice, 'aff');
      return true;
    } else {
      return false;
    }
  }
  @Mutation(() => Boolean)
  affectPrice(@Args('_id') _id: string, @Args('price') price: string) {
    let affectationPrice = this.ticketService.affectPrice(_id, price);
    if (affectationPrice) {
      return true;
    } else {
      return false;
    }
  }
  @Mutation(() => Boolean)
  updateTicketManager(
    @Args('updateTicketManager') updateTicketManager: UpdateTicketManager,
  ) {
    let updateManager =
      this.ticketService.updateTicketManager(updateTicketManager);

    if (updateManager) {
      return true;
    } else {
      return false;
    }
  }

  //new resolver for the Devis change
  @Mutation(() => Boolean)
  async updateDevisOnly(
    @Args('updateDevisOnly') updateDevisOnlyEntity: UpdateDevisOnlyEntity,
  ) {
    try {
      const updateResult = await this.ticketService.updateDevisOnly(
        updateDevisOnlyEntity,
      );
      return !!updateResult; // Converts truthy/falsy to boolean
    } catch (error) {
      console.error('Error updating Devis:', error);
      return false;
    }
  }
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  discount(@Args('_id') _id: string, @CurrentUser() profile: Profile) {
    let discount = this.ticketService.discount(_id, profile.role);
    if (discount) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  setIsReparable(@Args('_id') _id: string, @Args('techname') techname: string) {
    let update = this.ticketService.setIsReparable(_id, techname);
    if (update) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  reopenDiagnostique(@Args('_id') _id: string) {
    let toggle = this.ticketService.reopenDiagnostique(_id);
    if (toggle) {
      return true;
    } else {
      return false;
    }
  }
  @Mutation(() => Boolean)
  checkedByCoordinator(@Args('_id') _id: string) {
    let coo = this.ticketService.checkedByCoordinator(_id);
    if (coo) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  updateRemarqueTechReparation(
    @Args('_id') _id: string,
    @Args('remarqueTech') remarqueTech: string,
    @Args('reparationTimeByTech') reparationTimeByTech: string,
  ) {
    let remqrqueFinal = this.ticketService.updateRemarqueTechReparation(
      _id,
      remarqueTech,
      reparationTimeByTech,
    );
    if (remqrqueFinal) {
      return true;
    } else {
      return false;
    }
  }
  @Mutation(() => Boolean)
  isReturnTicket(@Args('_id') _id: string, @Args('stauts') status: boolean) {
    let isReturn = this.ticketService.isReturnTicket(_id, status);
    if (isReturn) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  toAdminTech(@Args('_id') _id: string) {
    let toAdminTech = this.ticketService.toAdminTech(_id);
    if (toAdminTech) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async affectTechToTechByCoordinator(
    @Args('_id') _id: string,
    @Args('sentTo') sentTo: string,
  ) {
    let affect = await this.ticketService.affectTechToTechByCoordinator(
      _id,
      sentTo,
    );

    if (affect.modifiedCount > 0) {
      console.log('🍸[affect]:', affect);
      let infoToSend = { techname: sentTo, message: 'You have new ticket' };
      console.log('🌮[infoToSend]:', infoToSend);
      await this.pubSub.publish('send', {
        notificationTech: { techname: sentTo, message: 'New notifcation' },
      });

      return true;
    } else {
      return false;
    }
  }

  /**
   *
   * SUBSCRIPTION NOTIFICATION TO SENT DATA TO TECH
   */

  @Subscription(() => NotificationTech)
  notificationTech() {
    return this.pubSub.asyncIterator('send');
  }
  @Mutation(() => Boolean)
  setfinalPriceToAdminTechtoFalseAfterManagerAffectFinalPrice(
    @Args('_id') _id: string,
  ) {
    let affect =
      this.ticketService.setfinalPriceToAdminTechtoFalseAfterManagerAffectFinalPrice(
        _id,
      );
    if (affect) {
      return true;
    } else {
      return false;
    }
  }
  @Mutation(() => Boolean)
  setfinalPriceToAdminManafertoFalseAfterAdlinManagerAffectFinalPrice(
    @Args('_id') _id: string,
  ) {
    let affect =
      this.ticketService.setfinalPriceToAdminManafertoFalseAfterAdlinManagerAffectFinalPrice(
        _id,
      );
    if (affect) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  setFinalPriceAvaiblableToAdminManager(@Args('_id') _id: string) {
    let affect = this.ticketService.setFinalPriceAvaiblableToAdminManager(_id);
    if (affect) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => [Ticket])
  filterGain(@Args('filter') filterGain: Filter) {
    return this.ticketService.filterGain(filterGain);
  }
  @Mutation(() => Ticket)
  getTicketById(@Args('id') id: string) {
    return this.ticketService.getTicketbyId(id);
  }

  @Mutation(() => Boolean)
  async updateTicketcField(@Args('updateTicket') updateTicket: UpdateTicket) {
    const update = await this.ticketService.updateTicket(updateTicket);
    if (update) {
      return true;
    } else {
      return false;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseDelete)
  async deleteTicket(
    @Args('_id') _id: string,
    @CurrentUser() profile: Profile,
  ) {
    try {
      if (profile.role === ROLE.ADMIN_MANAGER) {
        const deleteTicket = await this.ticketService.deleteTicket(
          _id,
          profile.role,
        );

        if (deleteTicket.deletedCount === 1) {
          return { deleteTicket };
        } else {
          return {
            responseError: { message: 'Failed to delete ticket', code: 500 },
          };
        }
      } else {
        // deleteTicket: null, // Set deleteTicket to null for unauthorized user
        throw new UnauthorizedException();
      }
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  @Mutation(() => Ticket)
  async updateBl(@Args('_id') _id: string, @Args('file') file: string) {
    return await this.ticketService.updateBl(_id, file);
  }

  @Mutation(() => Ticket)
  async updateBc(@Args('_id') _id: string, @Args('file') file: string) {
    return await this.ticketService.updateBc(_id, file);
  }
  @Mutation(() => Ticket)
  async updateFacture(@Args('_id') _id: string, @Args('file') file: string) {
    return await this.ticketService.updateFacture(_id, file);
  }

  @Mutation(() => Ticket)
  async updateDevis(@Args('_id') _id: string, @Args('file') file: string) {
    return await this.ticketService.updateDevis(_id, file);
  }
}
