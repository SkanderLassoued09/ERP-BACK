import { ObjectType, Field, Int } from '@nestjs/graphql';
import mongoose, { Document } from 'mongoose';

export const PriceTechSchema = new mongoose.Schema({
  priceTech: Number,
});

@ObjectType()
export class PriceTech extends Document {
  @Field(() => Int)
  priceTech: number;
}
