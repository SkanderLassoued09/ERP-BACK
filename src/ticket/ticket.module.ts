import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketResolver } from './ticket.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketSchema } from './entities/ticket.entity';
import { ProfileService } from 'src/profile/profile.service';
import { ProfileSchema } from 'src/profile/entities/profile.entity';

@Module({
  providers: [TicketResolver, TicketService, ProfileService],
  imports: [
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
