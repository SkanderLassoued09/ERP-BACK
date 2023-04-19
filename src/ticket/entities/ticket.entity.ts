import { ObjectType, Field, Int } from '@nestjs/graphql';
import mongoose from 'mongoose';

export type TicketDocument = Ticket & Document;

export const TicketSchema = new mongoose.Schema({
  adminTitle: String,
  descAdmin: String,
  titreTech: String,
  deschTech: String,
  cmpstList: Array<String>,
  location: String,
  startDate: Date,
  endDate: Date,
  dateOfReturn: Date,
  resTime: Date,
  DiagTime: Date,
  repTime: Date,
  totalTimeTaken: Date,
  sellingPrice: Number,
  cmpsData: String,
  profit: Number,
  isDep: Boolean,
  creationStatus: String,
  statusDiag: String,
  returnCount: Number,
});

@ObjectType()
export class Ticket {
  @Field()
  adminTitle: string;
  @Field()
  descAdmin: string;
  @Field()
  titreTech: string;
  @Field()
  deschTech: string;
  @Field(() => [String])
  cmpstList: string;
  @Field()
  location: string;
  @Field()
  startDate: Date;
  @Field()
  endDate: Date;
  @Field()
  dateOfReturn: Date;
  @Field()
  resTime: Date;
  @Field()
  DiagTime: Date;
  @Field()
  repTime: Date;
  @Field()
  totalTimeTaken: Date;
  @Field()
  sellingPrice: number;
  @Field()
  cmpsData: string;
  @Field()
  profit: number;
  @Field()
  isDep: boolean;
  @Field()
  creationStatus: string;
  @Field()
  statusDiag: string;
  @Field()
  returnCount: string;
}
