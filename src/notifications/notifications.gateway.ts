import { Logger } from '@nestjs/common';
import {
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
@WebSocketGateway()
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('Notification service');
  afterInit(server: any) {
    this.logger.log('Notifications');
  }
  handleDisconnect(client: any) {
    throw new Error('Method not implemented.');
  }
}
