import { Injectable } from '@nestjs/common';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket, TicketDocument } from './entities/ticket.entity';
import { Model } from 'mongoose';

@Injectable()
export class TicketService {
  constructor(@InjectModel('Ticket') private ticketModel: Model<Ticket>) {}
  async create(createTicketInput: CreateTicketInput) {
    return await new this.ticketModel(createTicketInput).save().then((res) => {
      console.log(res, 'ticket added');
      return res;
    });
  }

  findAll() {
    return `This action returns all ticket`;
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
