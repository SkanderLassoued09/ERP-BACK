import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketSchema } from 'src/ticket/entities/ticket.entity';
import { TicketService } from 'src/ticket/ticket.service';
import { ProfileSchema } from 'src/profile/entities/profile.entity';
import { ProfileService } from 'src/profile/profile.service';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Ticket',
        schema: TicketSchema,
      },
      { name: 'Profile', schema: ProfileSchema },
    ]),
  ],
  providers: [NotificationsGateway, TicketService, ProfileService, PubSub],
})
export class NotificationHatewayModule {}
