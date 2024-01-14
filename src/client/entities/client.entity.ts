import { ObjectType, Field } from '@nestjs/graphql';
import mongoose, { Document } from 'mongoose';

export type ClientDocument = Client & Document;

@ObjectType()
export class DetailsClient {
  @Field({ nullable: true })
  fullName: string;
  @Field({ nullable: true })
  email: string;
  @Field({ nullable: true })
  phone: string;
}

export const ClientSchema = new mongoose.Schema(
  {
    //Type and id
    _id: String,
    type: String,
    isDeleted: Boolean,
    //Field in commun
    region: String,
    email: String,
    phone: String,
    address: String,

    //Simple client fields
    firstName: String,
    lastName: String,
    //Company fields
    companyName: String,
    Exoneration: String,
    raisonSociale: String,
    activitePrincipale: String,
    activiteSecondaire: String,
    fax: String,
    website: String,
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
  //Type and id
  @Field()
  _id: string;
  @Field({ nullable: true })
  type: string;
  @Field()
  isDeleted: boolean;
  //Field in commun
  @Field({ nullable: true })
  region: string;
  @Field({ nullable: true })
  address: string;
  @Field({ nullable: true })
  email: string;
  @Field({ nullable: true })
  phone: string;

  //Simple client fields
  @Field({ nullable: true })
  firstName: string;
  @Field({ nullable: true })
  lastName: string;

  //Company fields
  @Field({ nullable: true })
  activitePrincipale: string;
  @Field({ nullable: true })
  activiteSecondaire: string;
  @Field({ nullable: true })
  raisonSociale: string;
  @Field({ nullable: true })
  companyName: string;
  @Field({ nullable: true })
  Exoneration: string;
  @Field({ nullable: true })
  fax: string;
  @Field({ nullable: true })
  website: string;
  @Field(() => DetailsClient, { nullable: true })
  achat: DetailsClient;
  @Field(() => DetailsClient, { nullable: true })
  financier: DetailsClient;
  @Field(() => DetailsClient, { nullable: true })
  technique: DetailsClient;
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
