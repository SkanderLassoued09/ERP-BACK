import { ObjectType, Field } from '@nestjs/graphql';
import mongoose from 'mongoose';

export type ComposantDocument = Composant & Document;

export const ComposantSchema = new mongoose.Schema({
  _id: String,
  nameComposant: String,
  purchasePrice: String,
  sellingPrice: String,
});

@ObjectType()
export class Composant {
  @Field({ nullable: true })
  _id: string;
  @Field({ nullable: true })
  nameComposant: string;
  @Field({ nullable: true })
  purchasePrice: string;
  @Field({ nullable: true })
  sellingPrice: string;
}
