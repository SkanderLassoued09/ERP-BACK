import { ObjectType, Field, Int } from '@nestjs/graphql';
import mongoose from 'mongoose';
import { STATUS_TICKET } from '../ticket';

export type TicketDocument = Ticket & Document;

export const TicketSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    designiation: String,
    emplacement: String,
    numSerie: String,
    numero: String,
    pdr: String,
    remarque: String,
    reparable: String,
    techNameSug: String,
    typeClient: String,
    createdBy: String,
    assignedTo: String,
    status: { type: String, required: false, default: STATUS_TICKET.PENDING },
    isOpenByTech: Boolean,
    diagnosticTimeByTech: String,

    //! to add time
  },
  { _id: false, timestamps: true },
);

@ObjectType()
export class Ticket {
  @Field({ nullable: true })
  _id: string;
  @Field({ nullable: true })
  title: string;
  @Field({ nullable: true })
  designiation: string;
  @Field({ nullable: true })
  emplacement: string;
  @Field({ nullable: true })
  numero: string;
  @Field({ nullable: true })
  remarque: string;
  @Field({ nullable: true })
  reparable: string;
  @Field({ nullable: true })
  pdr: string;
  @Field({ nullable: true })
  techNameSug: string;
  @Field({ nullable: true })
  typeClient: string;
  @Field({ nullable: true })
  createdBy: string;
  @Field({ nullable: true })
  assignedTo: string;
  @Field({ nullable: true })
  createdAt: Date;
  @Field({ nullable: true })
  updatedAt: Date;
  @Field({ nullable: true })
  status: string;
  @Field({ nullable: true })
  isOpenByTech: string;
  @Field({ nullable: true })
  diagnosticTimeByTech: String;
}
