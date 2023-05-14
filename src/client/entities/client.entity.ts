import { ObjectType, Field, Int } from '@nestjs/graphql';
import mongoose, { Document } from 'mongoose';

export type ClientDocument = Client & Document;

export const ClientSchema = new mongoose.Schema(
  {
    _id: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    type: String,
  },
  { _id: false, timestamps: true },
);
@ObjectType()
export class Client extends Document {
  @Field()
  _id: string;
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field()
  email: string;
  @Field()
  phone: string;
  @Field()
  address: string;
  @Field()
  type: string;
}
