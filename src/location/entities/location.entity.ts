import { ObjectType, Field, Int } from '@nestjs/graphql';
import mongoose from 'mongoose';

export type LocationDocument = Location & Document;
export const LocationSchema = new mongoose.Schema(
  {
    _id: String,
    locationName: String,
  },
  { _id: false, timestamps: true },
);
@ObjectType()
export class Location {
  @Field({ nullable: true })
  _id: string;
  @Field()
  locationName: string;
}
