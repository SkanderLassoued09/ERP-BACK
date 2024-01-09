import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import {
  CreateTicketInput,
  FiltreWorking,
  MagasinUpdateData,
} from './dto/create-ticket.input';
import {
  UpdateDevisOnlyEntity,
  UpdateTicket,
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
import { PubSub } from 'graphql-subscriptions';

function getFileExtension(base64) {
  const metaData = base64.split(',')[0];
  const fileType = metaData.split(':')[1].split(';')[0];
  const extension = fileType.split('/')[1];
  return extension;
}

@Injectable()
export class TicketService {
  constructor(
    @InjectModel('Ticket') private ticketModel: Model<Ticket>,
    private readonly pubSub: PubSub,
  ) {}

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
    const logger = new Logger('Ticker service');
    logger.log(createTicketInput, 'ticket from client');
    console.log(createTicketInput, 'add Ticket service');
    const index = await this.generateClientId();
    console.log('index ticket', index);
    createTicketInput._id = `T${index}`;
    console.log(createTicketInput._id, 'for saving');
    if (createTicketInput.image) {
      console.log(createTicketInput.image, 'path');
      const extension = getFileExtension(createTicketInput.image);
      console.log(createTicketInput.image, 'bufferr11');
      const buffer = Buffer.from(
        createTicketInput.image.split(',')[1],
        'base64',
      );
      const randompdfFile = randomstring.generate({
        length: 12,
        charset: 'alphabetic',
      });
      fs.writeFileSync(
        join(__dirname, `../../pdf/${randompdfFile}.${extension}`),
        buffer,
      );
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
    } else {
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
  //Nezih
  async getTickets(numberOfTicketPerPage: number, page: number) {
    const skip = (page - 1) * numberOfTicketPerPage;
    return await this.ticketModel
      .find({})
      .limit(numberOfTicketPerPage)
      .skip(skip)
      .then((res) => {
        console.log(res, 'all ticket');
        return res;
      });
  }
  /**
 * 
    
 
  ) {
    


    let returnTicket = await this.getTicketReturned();

    //  -------------------------------------------------
    await this.ticketModel
      .find({})
      .sort({ createdAt: 1 })
      .limit(numberOfTicketPerPage)
      .skip(skip)

      .then((res) => {
        console.log('🍬[res]:', res);

        return res;
      })
      .catch((err) => {
        return err;
      });
  
  }
 * 
 */
  async getTicketForCoordinator(page: number, nbOfDocument: number) {
    const skip = (page - 1) * nbOfDocument;
    return await this.ticketModel
      .find({ statusFinal: true })
      .limit(nbOfDocument)
      .skip(skip) // { toCoordinator: false }
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  convertFile(file: any) {
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
    console.log(updateTicketInput, 'data coming from Diagnostique tech');

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
              pdfComposant:
                item.pdfComposant !== 'undefined'
                  ? this.convertFile(item.pdfComposant)
                  : null,
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
    let returnTicket = await this.getTicketReturned();

    let admintech = await this.ticketModel
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

    // --------
    let tech = await this.ticketModel
      .find({
        $or: [{ assignedTo: name }, { assignedToRep: name }],
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
    // --------

    let magasin = await this.ticketModel
      .find({ toMagasin: true })
      .sort({ createdAt: -1 })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });

    // if (
    //   role === ROLE.ADMIN_MANAGER ||
    //   // role === ROLE.ADMIN_TECH ||
    //   role === ROLE.MANAGER
    // ) {
    //   return admin;
    // }

    if (role === ROLE.TECH) {
      return tech;
    }
    if (role === ROLE.ADMIN_TECH) {
      return admintech;
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
            isFinalPriceAffected: true,
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
              // bc: `${randompdfFile}.${extension}`,
              // bl: `${randompdfFileBl}.${extensionBl}`,
              // facture: `${randompdfFileFacture}.${extensionFacture}`,
              // Devis: `${randompdfFileDevis}.${extensionDevis}`,
              toCoordinator: false,
              // isFinalPriceAffected: true,
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
              // bc: `${randompdfFile}.${extension}`,
              // bl: `${randompdfFileBl}.${extensionBl}`,
              // facture: `${randompdfFileFacture}.${extensionFacture}`,
              // Devis: `${randompdfFileDevis}.${extensionDevis}`,
              toCoordinator: false,
              // isFinalPriceAffected: true,
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
  //////////////////
  // New service for changing only Devis
  async updateDevisOnly(updateDevisOnlyEntity: UpdateDevisOnlyEntity) {
    // //---------------------------------------------
    const extensionDevis = getFileExtension(updateDevisOnlyEntity.Devis);
    console.log(updateDevisOnlyEntity.Devis);
    const bufferDevis = Buffer.from(
      updateDevisOnlyEntity.Devis.split(',')[1],
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
    console.log('Change the Devis is fired');
    return await this.ticketModel
      .updateOne(
        { _id: updateDevisOnlyEntity._id },
        {
          $set: {
            Devis: `${randompdfFileDevis}.${extensionDevis}`,
          },
        },
      )
      .then((res) => {
        console.log(res, 'res Devis buffer');
        return res;
      })
      .catch((err) => {
        console.log(err, 'err Devis buffer');
        return err;
      });
  }
  //////////////////
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
        console.log(res, 'set admin manager');
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async filterGainWorking(filter: FiltreWorking) {
    const startDate = filter.start || new Date().toISOString;
    const endDate = filter.end || new Date().toISOString;

    try {
      const res = await this.ticketModel
        .find({
          createdAt: { $gte: startDate, $lte: endDate },
        })
        .select('composants _id createdAt price finalPrice status')
        .exec();
      console.log(res, 'res');
      return res;
    } catch (err) {
      throw err;
    }
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

  async deleteTicket(_id: string, role: string) {
    return await this.ticketModel
      .deleteOne({ _id })
      .then((res) => {
        console.log(res, 'res');
        return res;
      })
      .catch((err) => {
        console.log(err, 'err');
        return err;
      });
  }

  async updateTicket(updateTicket: UpdateTicket) {
    return this.ticketModel
      .updateOne(
        { _id: updateTicket._id },
        {
          $set: {
            numero: updateTicket.numero,
            emplacement: updateTicket.emplacement,
            designiation: updateTicket.designiation,
            title: updateTicket.title,
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

  async updateBl(_id: string, file: any) {
    // to convert
    const extension = getFileExtension(file);
    console.log(file, 'bufferr11');
    const buffer = Buffer.from(file.split(',')[1], 'base64');
    const randompdfFile = randomstring.generate({
      length: 12,
      charset: 'alphabetic',
    });
    fs.writeFileSync(
      join(__dirname, `../../pdf/${randompdfFile}.${extension}`),
      buffer,
    );

    const blFile = `${randompdfFile}.${extension}`;

    return this.ticketModel.updateOne(
      { _id },
      {
        $set: {
          bl: blFile,
        },
      },
    );
  }
  async updateBc(_id: string, file: any) {
    const extension = getFileExtension(file);
    console.log(file, 'bufferr11');
    const buffer = Buffer.from(file.split(',')[1], 'base64');
    const randompdfFile = randomstring.generate({
      length: 12,
      charset: 'alphabetic',
    });
    fs.writeFileSync(
      join(__dirname, `../../pdf/${randompdfFile}.${extension}`),
      buffer,
    );
    const bcFile = `${randompdfFile}.${extension}`;

    return this.ticketModel.updateOne(
      { _id },
      {
        $set: {
          bc: bcFile,
        },
      },
    );
  }
  async updateFacture(_id: string, file: any) {
    const extension = getFileExtension(file);
    console.log(file, 'bufferr11');
    const buffer = Buffer.from(file.split(',')[1], 'base64');
    const randompdfFile = randomstring.generate({
      length: 12,
      charset: 'alphabetic',
    });
    fs.writeFileSync(
      join(__dirname, `../../pdf/${randompdfFile}.${extension}`),
      buffer,
    );
    const factureFile = `${randompdfFile}.${extension}`;
    return this.ticketModel.updateOne(
      { _id },
      {
        $set: {
          facture: factureFile,
        },
      },
    );
  }

  async updateDevis(_id: string, file: any) {
    let devisFile: string;
    if (file) {
      const extension = getFileExtension(file);
      console.log(file, 'bufferr11');
      const buffer = Buffer.from(file.split(',')[1], 'base64');
      const randompdfFile = randomstring.generate({
        length: 12,
        charset: 'alphabetic',
      });
      fs.writeFileSync(
        join(__dirname, `../../pdf/${randompdfFile}.${extension}`),
        buffer,
      );
      devisFile = `${randompdfFile}.${extension}`;
    }
    return this.ticketModel.updateOne(
      { _id },
      {
        $set: {
          Devis: devisFile,
        },
      },
    );
  }

  /** For controller testing purpose */

  async getAllTicketCount() {
    return this.ticketModel
      .countDocuments()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async getAllTicketCountMagasin() {
    return this.ticketModel
      .countDocuments({ toMagasin: true })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async getTicketByTechForController(page: number, nbOfDocument: number) {
    console.log('🍼️[nbOfDocument]:', nbOfDocument);
    console.log('🥫[page]:', page);

    const skip = (page - 1) * nbOfDocument;
    console.log('🍦[skip]:', skip);

    // let returnTicket = await this.getTicketReturned();

    //  -------------------------------------------------
    let admin = await this.ticketModel
      .find({})
      .sort({ createdAt: 1 })
      .limit(nbOfDocument)
      .skip(skip)

      .then((res) => {
        // console.log('🍬[res]:', res);

        return res;
      })
      .catch((err) => {
        return err;
      });
    //  -------------------------------------------------

    // if (
    //   role === ROLE.ADMIN_MANAGER ||
    //   // role === ROLE.ADMIN_TECH ||
    //   role === ROLE.MANAGER
    // ) {
    //   return admin;
    // }
    return admin;
  }

  async getTicketForMagasinController(page: number, nbOfDocument: number) {
    const skip = (page - 1) * nbOfDocument;
    let magasin = await this.ticketModel
      .find({ toMagasin: true })
      .limit(nbOfDocument)
      .skip(skip)
      .sort({ createdAt: -1 })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });

    return magasin;
  }

  async getFinishedTicketController(page: number, nbOfDocument: number) {
    const skip = (page - 1) * nbOfDocument;
    return await this.ticketModel
      .find({ IsFinishedAdmins: true })
      .limit(nbOfDocument)
      .skip(skip)
      .then((res) => {
        console.log(res, 'manager');
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async getCountFoManager() {
    return await this.ticketModel
      .countDocuments({ IsFinishedAdmins: true })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  /** For controller testing purpose */

  async getTicketForAdminTech(name: string) {
    let returnTicket = await this.getTicketReturned();

    let admintech = await this.ticketModel
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

    return admintech;
  }
}
