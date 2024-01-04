import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketResolver } from './ticket.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketSchema } from './entities/ticket.entity';
import { ProfileService } from 'src/profile/profile.service';
import { ProfileSchema } from 'src/profile/entities/profile.entity';
import { TicketController } from './ticket.controller';
import { PubSubModule } from 'src/pub-sub/pub-sub.module';
import { PubSub } from 'graphql-subscriptions';

@Module({
  providers: [TicketResolver, TicketService, ProfileService],

  controllers: [TicketController],
  imports: [
    PubSubModule,
    MongooseModule.forFeature([
      {
        name: 'Ticket',
        schema: TicketSchema,
      },
      { name: 'Profile', schema: ProfileSchema },
    ]),
  ],
})
export class TicketModule {}
