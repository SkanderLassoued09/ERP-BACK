import { Injectable } from '@nestjs/common';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './entities/client.entity';

import { CLIENT_TYPE } from './clientType';

@Injectable()
export class ClientService {
  constructor(@InjectModel('Client') private clientModel: Model<Client>) {}

  async generateClientId(): Promise<number> {
    let index = 0;
    const lastClient = await this.clientModel.findOne(
      {},
      {},
      { sort: { createdAt: -1 } },
    );

    if (lastClient) {
      console.log('is entered');
      index = +lastClient._id.substring(1);
      return index + 1;
    }

    return index;
  }

  async create(createClientInput: CreateClientInput, type: string) {
    const index = await this.generateClientId();
    console.log('from function', index);
    if (type === CLIENT_TYPE.CLIENT) {
      createClientInput._id = `C${index}`;

      createClientInput.type = CLIENT_TYPE.CLIENT;

      return await new this.clientModel(createClientInput)
        .save()
        .then((res) => {
          console.log(res, 'res');
          return res;
        });
    }

    if (type === CLIENT_TYPE.COMPANY) {
      createClientInput._id = `S${index}`;
      createClientInput.type = CLIENT_TYPE.COMPANY;
      return await new this.clientModel(createClientInput)
        .save()
        .then((res) => {
          console.log(res, 'res');
          return res;
        });
    }
  }

  getClientByRegion() {
    return this.clientModel
      .aggregate([
        {
          $group: {
            _id: '$region',
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

  getClientByDate() {
    return this.clientModel
      .aggregate([
        {
          $group: {
            _id: '$createdAt',
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

  async getAllClientCompany() {
    return await this.clientModel.find({}).then((res) => {
      console.log(res, 'client');
      return res;
    });
  }

  async getListOfClient() {
    return await this.clientModel
      .find({ type: CLIENT_TYPE.CLIENT })
      .then((res) => {
        console.log(res, 'client');
        return res;
      });
  }

  async getListOfCompany() {
    return await this.clientModel
      .find({ type: CLIENT_TYPE.COMPANY })
      .then((res) => {
        return res;
      });
  }

  async getClientCompanyChart() {
    return await this.clientModel
      .aggregate([
        {
          $group: {
            _id: '$type',
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
        console.log(res, 'chart');
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  getClientLastMonth() {
    const currentDate = new Date();
    const lastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      currentDate.getDate(),
    );

    return this.clientModel
      .aggregate([
        {
          $group: {
            _id: {
              date: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
              },
              type: '$type',
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: '$_id.date',
            counts: {
              $push: {
                type: '$_id.type',
                count: '$count',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            date: '$_id',
            companyCount: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    '$counts.count',
                    { $indexOfArray: ['$counts.type', 'société'] },
                  ],
                },
                0,
              ],
            },
            clientCount: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    '$counts.count',
                    { $indexOfArray: ['$counts.type', 'client'] },
                  ],
                },
                0,
              ],
            },
          },
        },
        {
          $project: {
            date: 1,
            value: { $add: ['$companyCount', '$clientCount'] },
          },
        },
        {
          $sort: { date: 1 },
        },
      ])
      .then((res) => {
        console.log(res, 'res');
        return res;
      });
  }

  update(id: number, updateClientInput: UpdateClientInput) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
