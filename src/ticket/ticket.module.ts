import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketResolver } from './ticket.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketSchema } from './entities/ticket.entity';

@Module({
  providers: [TicketResolver, TicketService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Ticket',
        schema: TicketSchema,
      },
    ]),
  ],
})
export class TicketModule {}
