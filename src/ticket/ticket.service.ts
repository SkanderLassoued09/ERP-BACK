import { Injectable } from '@nestjs/common';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket, TicketDocument } from './entities/ticket.entity';
import { Model } from 'mongoose';
import { STATUS_TICKET } from './ticket';
import { find } from 'rxjs';
import { ROLE } from 'src/auth/roles';

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

  async updateTicketBytechForDiagnostic(
    _id: string,
    updateTicketInput: UpdateTicketInput,
  ) {
    return this.ticketModel.updateOne(
      { _id },
      {
        $set: {
          designiation: updateTicketInput.designiation,
          emplacement: updateTicketInput.emplacement,
          numero: updateTicketInput.numero,
          remarque: updateTicketInput.remarque,
          reparable: updateTicketInput.reparable,
          pdr: updateTicketInput.pdr,
          diagnosticTimeByTech: updateTicketInput.diagnosticTimeByTech,
          composant: updateTicketInput.composant.map((c) => ({
            nameComposant: c.nameComposant,
            quantity: c.quantity,
          })),
        },
      },
    );
  }

  async updateStatus(_id: string) {
    return await this.ticketModel
      .updateOne({ _id }, { $set: { status: STATUS_TICKET.IN_PROGRESS } })
      .then((res) => {
        console.log(res, 'update status');
        return res;
      });
  }

  async updateStatusInFinish(_id: string) {
    return await this.ticketModel
      .updateOne({ _id }, { $set: { status: STATUS_TICKET.FINISHED } })
      .then((res) => {
        console.log(res, 'finish status updated');
        return res;
      });
  }
  // change status selectable for magasin
  async changeSelectedStatus(_id: string, status: string) {
    return await this.ticketModel
      .updateOne(
        { _id },
        {
          $set: {
            status,
          },
        },
      )
      .then((res) => {
        return res;
      });
  }

  async isOpen(_id: string) {
    return await this.ticketModel
      .updateOne(
        { _id },
        {
          $set: {
            isOpenByTech: true,
          },
        },
      )
      .then((res) => {
        return res;
      });
  }

  async toMagasin(_id: string) {
    return await this.ticketModel
      .updateOne(
        { _id },
        {
          $set: {
            toMagasin: true,
          },
        },
      )
      .then((res) => {
        return res;
      });
  }

  async getTicketByTech(name: string, role: string) {
    console.log(name, 'name logged in');

    let admin = await this.ticketModel
      .find({})
      .sort({ createdAt: -1 })
      .then((res) => {
        console.log(res, 'res');
        return res;
      })
      .catch((err) => {
        return err;
      });

    let tech = await this.ticketModel
      .find({ assignedTo: name })
      .sort({ createdAt: -1 })
      .then((res) => {
        console.log(res, 'res');
        return res;
      })
      .catch((err) => {
        return err;
      });

    let magasin = await this.ticketModel
      .find({ toMagasin: true })
      .sort({ createdAt: -1 })
      .then((res) => {
        console.log(res, 'res');
        return res;
      })
      .catch((err) => {
        return err;
      });

    if (role === ROLE.ADMIN_MANAGER || role === ROLE.ADMIN_TECH) {
      return admin;
    }

    if (role === ROLE.TECH) {
      return tech;
    }

    if (role === ROLE.MAGASIN) {
      return magasin;
    }
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
