import { ObjectType, Field, Int } from '@nestjs/graphql';
import mongoose from 'mongoose';

export type IssueDocument = Issue & Document;
export const IssueSchema = new mongoose.Schema(
  {
    _id: String,
    issueName: String,
  },
  { _id: false, timestamps: true },
);

@ObjectType()
export class Issue {
  @Field()
  _id: string;
  @Field()
  issueName: string;
}
@ObjectType()
export class IssueChart {
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  value: string;
}
