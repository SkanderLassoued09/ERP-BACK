import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateLocationInput {
  @Field({ nullable: true })
  _id: string;
  @Field()
  locationName: string;
}
