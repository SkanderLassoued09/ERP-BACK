import { Injectable } from '@nestjs/common';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket, TicketDocument } from './entities/ticket.entity';
import { Model } from 'mongoose';

@Injectable()
export class TicketService {
  constructor(@InjectModel('Ticket') private ticketModel: Model<Ticket>) {}

  async generateClientId(): Promise<number> {
    let index = 0;
    const lastTicket = await this.ticketModel.findOne(
      {},
      {},
      { sort: { createdAt: -1 } },
    );

    if (lastTicket) {
      console.log('is entered');
      index = +lastTicket._id.substring(1);

      return index + 1;
    }

    return index;
  }

  async create(createTicketInput: CreateTicketInput) {
    const index = await this.generateClientId();
    console.log('index ticket', index);
    createTicketInput._id = `T${index}`;
    console.log(createTicketInput._id, 'for saving');
    return await new this.ticketModel(createTicketInput).save().then((res) => {
      console.log(res, 'ticket added');
      return res;
    });
  }

  async getTickets() {
    return await this.ticketModel.find().then((res) => {
      console.log(res, 'all ticket');
      return res;
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketInput: UpdateTicketInput) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
