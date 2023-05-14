import { Logger } from '@nestjs/common';
import {
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { CreateClientInput } from 'src/client/dto/create-client.input';
import { CreateTicketInput } from 'src/ticket/dto/create-ticket.input';
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
    throw new Error('Method not implemented.');
  }

  @SubscribeMessage('send-ticket')
  sendTicket(client: Socket, payload: CreateTicketInput) {
    console.log('payload info', payload);
    let notification = {
      title: payload.title,
      assignedTo: payload.assignedTo,
    };
    this.server.to(payload.assignedTo).emit('ticket', notification);
  }
}
