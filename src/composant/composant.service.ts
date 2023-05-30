import { Injectable } from '@nestjs/common';
import { CreateComposantInput } from './dto/create-composant.input';
import { UpdateComposantInput } from './dto/update-composant.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Composant } from './entities/composant.entity';

@Injectable()
export class ComposantService {
  constructor(
    @InjectModel('Composant') private composantModel: Model<Composant>,
  ) {}

  async generateClientId(): Promise<number> {
    let index = 0;
    const lastTicket = await this.composantModel.findOne(
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
  async create(createComposantInput: CreateComposantInput) {
    let index = await this.generateClientId();
    createComposantInput._id = `F${index}`;
    return await new this.composantModel(createComposantInput)
      .save()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async getComposantByTicket(_idTicket: string) {
    return await this.composantModel
      .find({ _idTicket })
      .sort({ createdAt: -1 })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  findAll() {
    return `This action returns all composant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} composant`;
  }

  update(id: number, updateComposantInput: UpdateComposantInput) {
    return `This action updates a #${id} composant`;
  }

  remove(id: number) {
    return `This action removes a #${id} composant`;
  }
}
