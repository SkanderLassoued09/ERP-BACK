import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateClientInput {
  @Field({ nullable: true })
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
  @Field({ nullable: true })
  type: string;
}
