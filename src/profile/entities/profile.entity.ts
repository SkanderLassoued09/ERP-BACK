import { ObjectType, Field, Int } from '@nestjs/graphql';

import mongoose from 'mongoose';

import * as bcrypt from 'bcrypt';
export type ProfileDocument = Profile & Document;

export const ProfileSchema = new mongoose.Schema(
  {
    username: String,
    firstName: String,
    lastName: String,
    password: String,
    phone: String,
    role: String,
    email: String,
    statusProfile: String,
  },
  { timestamps: true },
);

ProfileSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  } else {
    this['password'] = await bcrypt.hash(this['password'], 10);
    return next();
  }
});
@ObjectType()
export class Profile {
  @Field()
  username: string;
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field()
  password: string;
  @Field()
  phone: string;
  @Field()
  role: string;
  @Field()
  email: string;
  @Field()
  statusProfile: string;
  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
}
