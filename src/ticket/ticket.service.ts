import { Injectable } from '@nestjs/common';
import {
  CreateTicketInput,
  MagasinUpdateData,
} from './dto/create-ticket.input';
import {
  UpdateTicketInput,
  UpdateTicketManager,
} from './dto/update-ticket.input';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from './entities/ticket.entity';
import { Model } from 'mongoose';
import { STATUS_TICKET } from './ticket';
import { ROLE } from 'src/auth/roles';
import * as randomstring from 'randomstring';
import * as fs from 'fs';
import { join } from 'path';

function getFileExtension(base64) {
  const metaData = base64.split(',')[0];
  const fileType = metaData.split(':')[1].split(';')[0];
  const extension = fileType.split('/')[1];
  return extension;
}

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
    const extension = getFileExtension(createTicketInput.image);
    console.log(createTicketInput.image, 'bufferr11');
    const buffer = Buffer.from(createTicketInput.image.split(',')[1], 'base64');
    const randompdfFile = randomstring.generate({
      length: 12,
      charset: 'alphabetic',
    });
    fs.writeFileSync(
      join(__dirname, `../../pdf/${randompdfFile}.${extension}`),
      buffer,
    );
    const index = await this.generateClientId();
    console.log('index ticket', index);
    createTicketInput._id = `T${index}`;
    console.log(createTicketInput._id, 'for saving');
    createTicketInput.image = `${randompdfFile}.${extension}`;
    console.log(createTicketInput.image, 'image');
    return await new this.ticketModel(createTicketInput)
      .save()
      .then((res) => {
        console.log(res, 'ticket added');
        return res;
      })
      .catch((err) => {
        console.log(err, 'ticket error');
        return err;
      });
  }

  async checkedByCoordinator(_id: string) {
    return await this.ticketModel
      .updateOne({ _id }, { $set: { toCoordinator: true } })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async getTickets() {
    return await this.ticketModel.find().then((res) => {
      console.log(res, 'all ticket');
      return res;
    });
  }

  async getTicketForCoordinator() {
    return await this.ticketModel
      .find({ toCoordinator: false })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async updateTicketBytechForDiagnostic(
    _id: string,
    updateTicketInput: UpdateTicketInput,
  ) {
    console.log(updateTicketInput, 'data coming');
    return this.ticketModel
      .updateOne(
        { _id },
        {
          $set: {
            emplacement: updateTicketInput.emplacement,
            numero: updateTicketInput.numero,
            remarqueTech: updateTicketInput.remarqueTech,
            reparable: updateTicketInput.reparable,
            pdr: updateTicketInput.pdr,
            diagnosticTimeByTech: updateTicketInput.diagnosticTimeByTech,
            toMagasin: true,
            composants: updateTicketInput.composants.map((item) => ({
              nameComposant: item.nameComposant,
              quantity: item.quantity,
            })),
          },
        },
      )
      .then((res) => {
        console.log(res, 'ticket updated');
        return res;
      })
      .catch((err) => {
        console.log(err, 'err update ticket');
        return err;
      });
  }

  //"tickets": { "$elemMatch": { "_id": 0 } }

  async updateMagasin(magasinUpdateData: MagasinUpdateData) {
    return await this.ticketModel
      .updateOne(
        {
          _id: magasinUpdateData._id,
          'composants.nameComposant': magasinUpdateData.nameComposant,
        },
        {
          $set: {
            toCoordinator: false,
            'composants.$.sellPrice': magasinUpdateData.sellPrice,
            'composants.$.purchasePrice': magasinUpdateData.purchasePrice,
            'composants.$.statusComposant': magasinUpdateData.statusComposant,
            'composants.$.comingDate': magasinUpdateData.comingDate,
            'composants.$.isAffected': true,
          },
        },
      )
      .then((res) => {
        console.log(res, 'update composant');
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async makeTicketAvailableForAdmin(_id: string) {
    return await this.ticketModel
      .updateOne(
        { _id },
        {
          $set: {
            magasinDone: true,
          },
        },
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
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
      })
      .catch((err) => {
        return err;
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

    if (
      role === ROLE.ADMIN_MANAGER ||
      role === ROLE.ADMIN_TECH ||
      role === ROLE.MANAGER
    ) {
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

  async updateGlag() {
    return await this.ticketModel.updateMany(
      {},
      {
        $set: {
          isOpenByTech: false,
        },
      },
    );
  }

  async getTicketMagasinFinie() {
    return await this.ticketModel
      .find({ magasinDone: true })
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }

  async affectationFinalPrice(_id: string, finalPrice: string) {
    return await this.ticketModel
      .updateOne(
        { _id },
        {
          $set: {
            finalPrice,
          },
        },
      )
      .then((res) => {
        console.log('price affected', res);
        if (res) {
          this.adminsPriceFinished(_id);
        }

        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async adminsPriceFinished(_id: string) {
    return await this.ticketModel
      .updateOne({ _id }, { $set: { IsFinishedAdmins: true } })
      .then((res) => {
        console.log(res, 'adminsPrice Value');
        return res;
      });
  }

  async getFinishedTicket() {
    return await this.ticketModel
      .find({ IsFinishedAdmins: true })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async updateTicketManager(updateTicketManager: UpdateTicketManager) {
    const extension = getFileExtension(updateTicketManager.bc);
    console.log(updateTicketManager.bc, 'bufferr11');
    const buffer = Buffer.from(updateTicketManager.bc.split(',')[1], 'base64');
    const randompdfFile = randomstring.generate({
      length: 12,
      charset: 'alphabetic',
    });
    fs.writeFileSync(
      join(__dirname, `../../pdf/${randompdfFile}.${extension}`),
      buffer,
    );
    // //---------------------------------------------
    const extensionBl = getFileExtension(updateTicketManager.bl);
    console.log(updateTicketManager.bl, 'bl');
    const bufferBl = Buffer.from(
      updateTicketManager.bl.split(',')[1],
      'base64',
    );
    const randompdfFileBl = randomstring.generate({
      length: 12,
      charset: 'alphabetic',
    });
    fs.writeFileSync(
      join(__dirname, `../../pdf/${randompdfFileBl}.${extensionBl}`),
      bufferBl,
    );

    // //---------------------------------------------
    const extensionDevis = getFileExtension(updateTicketManager.Devis);
    console.log(updateTicketManager.Devis);
    const bufferDevis = Buffer.from(
      updateTicketManager.Devis.split(',')[1],
      'base64',
    );
    const randompdfFileDevis = randomstring.generate({
      length: 12,
      charset: 'alphabetic',
    });
    fs.writeFileSync(
      join(__dirname, `../../pdf/${randompdfFileDevis}.${extensionDevis}`),
      bufferDevis,
    );

    // //---------------------------------------------
    const extensionFacture = getFileExtension(updateTicketManager.facture);

    const bufferFacture = Buffer.from(
      updateTicketManager.facture.split(',')[1],
      'base64',
    );
    const randompdfFileFacture = randomstring.generate({
      length: 12,
      charset: 'alphabetic',
    });
    fs.writeFileSync(
      join(__dirname, `../../pdf/${randompdfFileFacture}.${extensionFacture}`),
      bufferFacture,
    );
    let ticketValidated = await this.ticketModel
      .updateOne(
        { _id: updateTicketManager._id },
        {
          $set: {
            finalPrice: updateTicketManager.remise,
            // isReparable: updateTicketManager.statusFinal,
            bc: `${randompdfFile}.${extension}`,
            bl: `${randompdfFileBl}.${extensionBl}`,
            facture: `${randompdfFileFacture}.${extensionFacture}`,
            Devis: `${randompdfFileDevis}.${extensionDevis}`,
            toCoordinator: false,
          },
        },
      )
      .then((res) => {
        console.log(res, 'res buffer');
        return res;
      })
      .catch((err) => {
        console.log(err, 'err buffer');
        return err;
      });

    let ticketIgnored = this.ticketModel
      .updateOne(
        {
          _id: updateTicketManager._id,
        },
        { $set: { finalStatusTicket: STATUS_TICKET.IGNORED } },
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });

    if (updateTicketManager.statusFinal) {
      return ticketValidated;
    } else {
      return ticketIgnored;
    }
  }

  async setIsReparable(_id) {
    return await this.ticketModel
      .updateOne({ _id }, { $set: { isReparable: true } })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  reopenDiagnostique(_id: string) {
    return this.ticketModel
      .updateOne(
        { _id },
        {
          $set: {
            isOpenByTech: false,
          },
        },
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  updateRemarqueTechReparation(
    _id: string,
    remarqueTech: string,
    reparationTimeByTech: string,
  ) {
    return this.ticketModel
      .updateOne(
        { _id },
        {
          $set: {
            remarqueTech,
            reparationTimeByTech,
            finalStatusTicket: STATUS_TICKET.FINISHED,
          },
        },
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  // to change status ticket to [return]
  isReturnTicket(_id: string, status: boolean) {
    let finalStatus;
    if (status) {
      finalStatus = STATUS_TICKET.RETURN;
    } else {
      finalStatus = STATUS_TICKET.FINISHED;
    }
    return this.ticketModel
      .updateOne(
        { _id },
        {
          $set: {
            finalStatusTicket: finalStatus,
          },
        },
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  // pass ticket in case of no pdr or not reparable
  toAdminTech(_id: string) {
    console.log(_id, '_id to magasin');
    return this.ticketModel
      .updateOne(
        { _id },
        {
          $set: {
            toMagasin: false,
          },
        },
      )
      .then((res) => {
        console.log('to magasin is fired', res);
        return res;
      })
      .catch((err) => {
        console.log('to magasin is fired error', err);
        return err;
      });
  }

  async affectTechToTechByCoordinator(_id: string, sentTo: string) {
    return await this.ticketModel
      .updateOne(
        { _id },
        {
          $set: {
            assignedTo: sentTo,
            toCoordinator: true,
          },
        },
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
}
