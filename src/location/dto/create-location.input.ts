import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateLocationInput {
  @Field()
  locationName: string;
  @Field()
  numberOfTicket: string;
}
