import { ObjectType, Field } from '@nestjs/graphql';
import mongoose from 'mongoose';

export type ComposantDocument = Composant & Document;

export const ComposantSchema = new mongoose.Schema(
  {
    _id: String,
    _idTicket: String,
    nameComposant: String,
    purchasePrice: String,
    sellingPrice: String,
    statusMagasin: String,
    pdfInfo: String,
  },
  { _id: false, timestamps: true },
);

@ObjectType()
export class Composant {
  @Field({ nullable: true })
  _id: string;
  @Field({ nullable: true })
  _idTicket: string;
  @Field({ nullable: true })
  statusMagasin: string;
  @Field({ nullable: true })
  nameComposant: string;
  @Field({ nullable: true })
  purchasePrice: string;
  @Field({ nullable: true })
  sellingPrice: string;
  @Field({ nullable: true })
  pdfInfo: string;
}
