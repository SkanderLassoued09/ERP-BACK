import { ObjectType, Field, Int } from '@nestjs/graphql';
import mongoose from 'mongoose';

export type LocationDocument = Location & Document;
export const LocationSchema = new mongoose.Schema({
  locationName: String,
  numberOfTicket: Number,
});
@ObjectType()
export class Location {
  @Field()
  locationName: string;
  @Field()
  numberOfTicket: string;
}
