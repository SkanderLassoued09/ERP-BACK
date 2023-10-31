import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Schema } from '@nestjs/mongoose';
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
    achat: {
      fullName: String,
      email: String,
      phone: String,
    },
    financier: {
      fullName: String,
      email: String,
      phone: String,
    },
    technique: {
      fullName: String,
      email: String,
      phone: String,
    },
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
  @Field({ nullable: true })
  email: string;
  @Field({ nullable: true })
  phone: string;
  @Field({ nullable: true })
  address: string;
  @Field({ nullable: true })
  type: string;
  @Field({ nullable: true })
  companyName: string;
  @Field({ nullable: true })
  region: string;
  @Field({ nullable: true })
  codePostal: string;
  @Field({ nullable: true })
  tva: string;
  @Field({ nullable: true })
  etat: string;
  @Field({ nullable: true })
  fax: string;
  @Field({ nullable: true })
  ibanRib: string;
  @Field({ nullable: true })
  swiftBic: string;
  @Field({ nullable: true })
  nattestation: string;
  @Field({ nullable: true })
  codeFiscal: string;
  @Field({ nullable: true })
  conPayment: string;
  @Field({ nullable: true })
  website: string;
  @Field({ nullable: true })
  techContact: string;
  @Field({ nullable: true })
  nRegisterCommerce: string;
}

@ObjectType()
export class ChartType {
  @Field()
  name: string;
  @Field()
  value: number;
}

@ObjectType()
export class CalendarChart {
  @Field({ nullable: true })
  date: string;
  // @Field({ nullable: true })
  // COMPANY: number;
  // @Field({ nullable: true })
  // CLIENT: number;
  @Field()
  value: number;
}
