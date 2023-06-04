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
    this.logger.log('Disconnect', client);
  }

  @SubscribeMessage('send-ticket')
  sendTicket(client: Socket, payload: CreateTicketInput) {
    console.log(client.id, 'id');
    console.log('payload info', payload);
    let notification = {
      title: payload.designiation,
      assignedTo: payload.assignedTo,
    };
    this.ticketService
      .create(payload)
      .then((res) => {
        console.log(res, 'ticket added');
        return res;
      })
      .catch((err) => {
        console.log(err, 'err add ticket');
        return err;
      });
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
