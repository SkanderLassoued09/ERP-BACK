import { Injectable } from '@nestjs/common';
import {
  CreateTicketInput,
  Filter,
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
import { start } from 'repl';

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
    console.log(createTicketInput, 'add service');
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

  async getTicketForCoordinator(filterGain) {
    console.log(filterGain.start, 'filter  start');
    console.log(typeof filterGain.end, 'filter gain end');
    const startDate =
      filterGain.start !== (null || 'null') ? new Date(filterGain.start) : null;
    const endDate =
      filterGain.end !== (null || 'null') ? new Date(filterGain.end) : null;

    let match = {};
    if (startDate && endDate === null) {
      match['$gte'] = startDate;
    }

    if (startDate && endDate) {
      match['$gte'] = startDate;
      match['$lte'] = endDate;
    }

    console.log(match, 'condition');
    return this.ticketModel
      .find({
        // Use createdAt field for date filtering
        createdAt: match,
      })
      .exec()
      .then((res) => {
        console.log(res, 'res');
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  convertFile(file: any) {
    // const extension = getFileExtension(
    //   file.map((el) => {
    //     return el.pdfComposant;
    //   }),
    // );
    // console.log(
    //   file.map((el) => {
    //     return el.pdfComposant;
    //   }),
    //   'bufferr11',
    // );

    // const base64Strings = file.map((item) => item.pdfComposant.split(',')[1]);
    // const concatenatedBase64 = base64Strings.join('');

    // const buffer = Buffer.from(concatenatedBase64, 'base64');
    // const randompdfFile = randomstring.generate({
    //   length: 12,
    //   charset: 'alphabetic',
    // });
    // fs.writeFileSync(
    //   join(__dirname, `../../pdf/${randompdfFile}.${extension}`),
    //   buffer,
    // );

    // return `${randompdfFile}.${extension}`;
    const extension = getFileExtension(file);
    console.log(file, 'file');
    console.log('---------------------------');
    console.log(file, 'bufferr11');
    console.log('----------------------------');
    const buffer = Buffer.from(file.split(',')[1], 'base64');
    const randompdfFile = randomstring.generate({
      length: 12,
      charset: 'alphabetic',
    });
    fs.writeFileSync(
      join(__dirname, `../../pdf/${randompdfFile}.${extension}`),
      buffer,
    );
    return `${randompdfFile}.${extension}`;
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
            status: STATUS_TICKET.PENDING,
            emplacement: updateTicketInput.emplacement,
            numero: updateTicketInput.numero,
            remarqueTech: updateTicketInput.remarqueTech,
            reparable: updateTicketInput.reparable,
            pdr: updateTicketInput.pdr,
            diagnosticTimeByTech: updateTicketInput.diagnosticTimeByTech,
            issue: updateTicketInput.issue,

            toMagasin: true,
            composants: updateTicketInput.composants.map((item) => ({
              nameComposant: item.nameComposant,
              quantity: item.quantity,
              package: item.package,
              pdfComposant: this.convertFile(item.pdfComposant),
              linkProvider: item.linkProvider,
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
            // magasin is done to enable btns
            magasinDone: true,
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
    console.log(_id, 'id makeTicketAvailableForAdmin ');
    return await this.ticketModel
      .updateOne(
        { _id },
        {
          $set: {
            coordinatorToAdmin: true,
          },
        },
      )
      .then((res) => {
        console.log(res, 'res');
        return res;
      })
      .catch((err) => {
        console.log(err, 'err');
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

  getOldestOneTicket(res: Array<any>) {
    // Find the oldest item based on the 'createdAt' timestamp
    let oldestTimestamp: number = Infinity;

    const updatedData = res.map((item) => {
      const createdAtTimestamp = item.createdAt.getTime();
      if (createdAtTimestamp < oldestTimestamp) {
        oldestTimestamp = createdAtTimestamp;
      }

      return item;
    });

    // Update the 'isReadyForDiag' property of the oldest item to true
    updatedData.forEach((item) => {
      if (item.createdAt.getTime() === oldestTimestamp) {
        item.isReadyForDiag = true;
      }
    });

    console.log(updatedData);
    return updatedData;
  }

  getTicketReturned() {
    return this.ticketModel
      .find({ status: 'RETURN' })
      .sort({ createdAt: -1 })
      .limit(1)
      .then((res) => {
        console.log('-------------');
        console.log(res, 'return stage');
        console.log('--------------');
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async getTicketByTech(name: string, role: string) {
    console.log('##########################');
    let returnTicket = await this.getTicketReturned();
    console.log('Returned ticket is fired', returnTicket);
    console.log('##########################');
    //  -------------------------------------------------
    let admin = await this.ticketModel
      .find({})
      .sort({ createdAt: 1 })

      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
    //  -------------------------------------------------
    let tech = await this.ticketModel
      .find({
        assignedTo: name,
        status: { $ne: STATUS_TICKET.FINISHED },
        $and: [
          {
            $or: [{ isOpenByTech: false }, { isReparable: true }],
          },
        ],
      })
      .sort({ createdAt: -1 })
      .limit(3)
      .then((res) => {
        if (returnTicket.length > 0) {
          console.log('ticket is returned entred');
          let [returnObj] = returnTicket;
          returnObj['isReadyForDiag'] = true;
          console.log(returnObj, 'spreaded arr');
          res.shift();
          res.unshift(returnObj);
          return res;
        } else if (returnTicket) {
          console.log('FIFO start');
          this.getOldestOneTicket(res);
          return this.getOldestOneTicket(res);
        }
      })
      .catch((err) => {
        return err;
      });

    let magasin = await this.ticketModel
      .find({ toMagasin: true })
      .sort({ createdAt: -1 })
      .then((res) => {
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

  noReparableNoPDR(_id: string) {
    return this.ticketModel
      .updateOne({ _id }, { $set: { magasinDone: true } })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
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
  affectPrice(_id: string, price: string) {
    return this.ticketModel
      .updateOne(
        { _id },
        {
          $set: {
            price,
          },
        },
      )
      .then((res) => {
        if (res) {
          this.adminsPriceFinished(_id);
        }
        return res;
      })
      .catch((err) => {
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
    if (updateTicketManager.statusFinal === true) {
      console.log('vzlider is fired');
      return await this.ticketModel
        .updateOne(
          { _id: updateTicketManager._id },
          {
            $set: {
              status: STATUS_TICKET.PENDING,
              finalPrice: updateTicketManager.remise,
              statusFinal: updateTicketManager.statusFinal,
              bc: `${randompdfFile}.${extension}`,
              bl: `${randompdfFileBl}.${extensionBl}`,
              facture: `${randompdfFileFacture}.${extensionFacture}`,
              Devis: `${randompdfFileDevis}.${extensionDevis}`,
              toCoordinator: false,
              isFinalPriceAffected: true,
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
    }

    if (updateTicketManager.statusFinal === false) {
      console.log('annuler is fired');
      return this.ticketModel

        .updateOne(
          {
            _id: updateTicketManager._id,
          },
          {
            $set: {
              status: STATUS_TICKET.IGNORED,
              finalPrice: updateTicketManager.remise,
              statusFinal: updateTicketManager.statusFinal,
              bc: `${randompdfFile}.${extension}`,
              bl: `${randompdfFileBl}.${extensionBl}`,
              facture: `${randompdfFileFacture}.${extensionFacture}`,
              Devis: `${randompdfFileDevis}.${extensionDevis}`,
              toCoordinator: false,
              isFinalPriceAffected: true,
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

  async setIsReparable(_id, techname: string) {
    return await this.ticketModel
      .updateOne(
        { _id },
        { $set: { isReparable: true, assignedToRep: techname } },
      )
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
  // When tech finishs ticket reparation
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
            status: STATUS_TICKET.FINISHED,
            isReparationFinishedByTech: true,
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
            status: finalStatus,
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

  async discount(_id: string, role: string) {
    if (role === ROLE.MANAGER) {
      return this.ticketModel
        .updateOne(
          { _id },
          {
            $set: {
              openDiscount: ROLE.ADMIN_TECH,
            },
          },
        )
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err;
        });
    } else if (role === ROLE.ADMIN_TECH) {
      return this.ticketModel
        .updateOne(
          { _id },
          {
            $set: {
              openDiscount: ROLE.ADMIN_MANAGER,
            },
          },
        )
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err;
        });
    } else {
      return this.ticketModel
        .updateOne(
          { _id },
          {
            $set: {
              openDiscount: 'TO_UPDATE_PRICE',
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

  getIssuesChart() {
    return this.ticketModel
      .aggregate([
        {
          $group: {
            _id: '$issue',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            name: '$_id',
            value: '$count',
            _id: 0,
          },
        },
      ])
      .then((res) => {
        console.log(res, 'res');
        return res;
      })
      .catch((err) => {
        console.log(err, 'err');
        return err;
      });
  }

  getTotality() {
    let totalityTypes = this.ticketModel
      .aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },

        {
          $project: {
            name: '$_id',
            value: '$count',
            _id: 0,
          },
        },
      ])
      .then((res) => {
        console.log(res, 'totality');
        return res;
      })
      .catch((err) => {
        console.log(err, 'err');
        return err;
      });

    let totalTicketCount = this.ticketModel
      .find()
      .count()
      .then((res) => {
        console.log(res, 'count');
        return res;
      })
      .catch((err) => {
        return err;
      });
    return Promise.all([{ totality: totalityTypes, count: totalTicketCount }]);
  }

  setFinalPriceAvaiblableToAdminTech(_id: string) {
    return this.ticketModel
      .updateOne(
        { _id },
        {
          $set: {
            finalPriceToAdminTech: true,
          },
        },
      )
      .then((res) => {
        console.log(res, 'set admin tech');
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  setFinalPriceAvaiblableToAdminManager(_id: string) {
    return this.ticketModel
      .updateOne(
        { _id },
        {
          $set: {
            finalPriceToAdminManager: true,
          },
        },
      )
      .then((res) => {
        console.log(res, 'set admin tech');
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  filterGain(filterGain: Filter) {
    console.log(filterGain.start, 'filter  start');
    console.log(typeof filterGain.end, 'filter gain end');
    const startDate =
      filterGain.start !==
      (null || 'null' || 'undefined' || typeof filterGain.end === undefined)
        ? new Date(filterGain.start)
        : null;
    const endDate =
      filterGain.end !==
      (null || 'null' || 'undefined' || typeof filterGain.end === undefined)
        ? new Date(filterGain.end)
        : null;

    let match = {};
    if (startDate && endDate === null) {
      match['$gte'] = startDate;
    }

    if (startDate && endDate) {
      match['$gte'] = startDate;
      match['$lte'] = endDate;
    }

    console.log(match, 'condition');
    return this.ticketModel
      .find({
        // Use createdAt field for date filtering
        createdAt: match,
      })
      .exec()
      .then((res) => {
        console.log(res, 'res');
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  getTicketbyId(id: string) {
    return this.ticketModel
      .findById(id)
      .then((res) => {
        console.log(res, 'ticket by id');
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
}
