import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketSchema } from 'src/ticket/entities/ticket.entity';
import { TicketService } from 'src/ticket/ticket.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Ticket',
        schema: TicketSchema,
      },
    ]),
  ],
  providers: [NotificationsGateway, TicketService],
})
export class NotificationHatewayModule {}
