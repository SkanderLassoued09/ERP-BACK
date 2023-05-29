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
  async create(createComposantInput: CreateComposantInput) {
    return await new this.composantModel(createComposantInput)
      .save()
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
