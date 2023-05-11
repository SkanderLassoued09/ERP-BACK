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

  async create(createClientInput: CreateClientInput, type: string) {
    if (type === CLIENT_TYPE.CLIENT) {
      createClientInput.type = CLIENT_TYPE.CLIENT;

      return await new this.clientModel(createClientInput)
        .save()
        .then((res) => {
          console.log(res, 'res');
          return res;
        });
    }

    if (type === CLIENT_TYPE.COMPANY) {
      createClientInput.type = CLIENT_TYPE.COMPANY;
      return await new this.clientModel(createClientInput)
        .save()
        .then((res) => {
          console.log(res, 'res');
          return res;
        });
    }
  }

  findAll() {
    return `This action returns all client`;
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
