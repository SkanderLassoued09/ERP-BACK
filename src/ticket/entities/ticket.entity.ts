import { ObjectType, Field, Int } from '@nestjs/graphql';
import mongoose from 'mongoose';

export type TicketDocument = Ticket & Document;

export const TicketSchema = new mongoose.Schema({
  designiation: String,
  emplacement: String,
  numSerie: String,
  numero: String,
  pdr: String,
  remarque: String,
  reparable: String,
  techNameSug: String,
  typeClient: String,
  //! to add time
});

@ObjectType()
export class Ticket {
  @Field()
  designiation: string;
  @Field()
  emplacement: string;
  @Field()
  numero: string;
  @Field()
  remarque: string;
  @Field()
  reparable: string;
  @Field()
  pdr: string;
  @Field()
  techNameSug: string;
  @Field()
  typeClient: string;
}
