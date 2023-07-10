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
  sendTicket(client: Socket, payload: any) {
    console.log(payload, 'Test purpuse');

    let notification = {
      title: payload.designiation,
      assignedTo: payload.assignedTo,
    };
    this.ticketService.create(payload);
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
    await this.ticketService
      .toMagasin(payload._id)
      .then((res) => {
        this.server.emit('magasin', notification);
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  @SubscribeMessage('send-to-tech')
  async sendTicketToTechByCoordinator(client: Socket, payload: any) {
    console.log(payload, 'by Coo');
    if (payload) {
      this.ticketService.affectTechToTechByCoordinator(
        payload._id,
        payload.sentTo,
      );
      client.emit('tech-recieve-coordinator', payload);
    }
  }
}
