import { ObjectType, Field, Int } from '@nestjs/graphql';
import mongoose, { Document } from 'mongoose';

export type ClientDocument = Client & Document;

export const ClientSchema = new mongoose.Schema(
  {
    _id: String,
    firstName: String,
    lastName: String,
    companyName: String,
    email: String,
    phone: String,
    address: String,
    type: String,
    region: String,
    codePostal: String,
    localOrshore: String,
    tva: String,
    etat: String,
    fax: String,
    ibanRib: String,
    swiftBic: String,
    nattestation: String,
    codeFiscal: String,
    conPayment: String,
    website: String,
    techContact: String,
    nRegisterCommerce: String,
  },
  { _id: false, timestamps: true },
);
@ObjectType()
export class Client extends Document {
  @Field()
  _id: string;
  @Field({ nullable: true })
  firstName: string;
  @Field({ nullable: true })
  lastName: string;
  @Field()
  email: string;
  @Field()
  phone: string;
  @Field()
  address: string;
  @Field()
  type: string;
  @Field({ nullable: true })
  companyName: string;
  @Field()
  region: string;
  @Field()
  codePostal: string;
  @Field()
  tva: string;
  @Field()
  etat: string;
  @Field()
  fax: string;
  @Field()
  ibanRib: string;
  @Field()
  swiftBic: string;
  @Field()
  nattestation: string;
  @Field()
  codeFiscal: string;
  @Field()
  conPayment: string;
  @Field()
  website: string;
  @Field()
  techContact: string;
  @Field()
  nRegisterCommerce: string;
}
