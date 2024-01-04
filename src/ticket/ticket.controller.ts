import { Controller, Get, Query, Req } from '@nestjs/common';
import { TicketService } from './ticket.service';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get('/getTicketAdmins')
  async getAllTicket(
    @Query('indexPage') indexPage: number,
    @Query('nbOfDocument') nbOfDocument: number,
    @Req() req: any,
  ) {
    let responseData = await this.ticketService.getTicketByTechForController(
      indexPage,
      nbOfDocument,
    );

    let all = await this.ticketService.getAllTicketCount();

    return { getAllTicket: responseData, allTicketCount: all };
  }

  @Get('/getTicketMagasin')
  async getAllTicketForMagasin(
    @Query('indexPage') indexPage: number,
    @Query('nbOfDocument') nbOfDocument: number,
    @Req() req: any,
  ) {
    let responseData = await this.ticketService.getTicketForMagasinController(
      indexPage,
      nbOfDocument,
    );

    let all = await this.ticketService.getAllTicketCount();

    return { getAllTicketMagasin: responseData, allTicketCount: all };
  }

  @Get('/getTicketCoordinator')
  async getAllTicketForCoordinator(
    @Query('indexPage') indexPage: number,
    @Query('nbOfDocument') nbOfDocument: number,
    @Req() req: any,
  ) {
    let responseData = await this.ticketService.getTicketForCoordinator(
      indexPage,
      nbOfDocument,
    );

    let all = await this.ticketService.getAllTicketCount();

    return { getAllTicketCoorinator: responseData, allTicketCount: all };
  }
}
