import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePriceTechInput } from './dto/create-price-tech.input';
import { PriceTech } from './entities/price-tech.entity';

@Injectable()
export class PriceTechService {
  constructor(
    @InjectModel(PriceTech.name)
    private readonly priceTechModel: Model<PriceTech>,
  ) {}

  async create(createPriceTechInput: CreatePriceTechInput): Promise<PriceTech> {
    const createdPriceTech = new this.priceTechModel(createPriceTechInput);
    return createdPriceTech.save();
  }

  async getPriceTech(): Promise<number | null> {
    const priceTechEntity = await this.priceTechModel.findOne().exec();
    return priceTechEntity ? priceTechEntity.priceTech : null;
  }

  async updatePriceTech(newPriceTech: number): Promise<number | null> {
    const priceTechEntity = await this.priceTechModel
      .findOneAndUpdate({}, { priceTech: newPriceTech }, { new: true })
      .exec();

    return priceTechEntity ? priceTechEntity.priceTech : null;
  }
}
