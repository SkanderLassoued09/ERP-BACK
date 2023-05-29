import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { RolesGuard } from 'src/auth/role-guard';
import { CreateTicketInput } from 'src/ticket/dto/create-ticket.input';
import { Role } from 'src/ticket/role-decorator';
import { TicketService } from 'src/ticket/ticket.service';
@WebSocketGateway()
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayDisconnect
{
  constructor(private ticketService: TicketService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('Notification service');
  afterInit(server: any) {
    this.logger.log('Notifications');
  }
  handleDisconnect(client: any) {
    this.logger.log('Disconnect', client);
  }

  @SubscribeMessage('send-ticket')
  async sendTicket(client: Socket, payload: CreateTicketInput) {
    console.log('payload info', payload);
    let notification = {
      title: payload.designiation,
      assignedTo: payload.assignedTo,
    };
    await this.ticketService.create(payload);
    this.server.emit('ticket', notification);
  }

  // to send data to magasin

  @SubscribeMessage('send-data-magasin')
  async sendTicketMagasin(client: Socket, payload: any) {
    console.log('payload info', payload);
    let notification = {
      title: payload.designiation,
      assignedTo: payload.assignedTo,
      role: payload.role,
    };
    await this.ticketService.toMagasin(payload._id);
    this.server.emit('magasin', notification);
  }
}
