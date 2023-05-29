import { Injectable } from '@nestjs/common';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './entities/client.entity';
import { Args } from '@nestjs/graphql';
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
      createClientInput._id = `C${index}`;
      createClientInput.type = CLIENT_TYPE.COMPANY;
      return await new this.clientModel(createClientInput)
        .save()
        .then((res) => {
          console.log(res, 'res');
          return res;
        });
    }
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

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientInput: UpdateClientInput) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
