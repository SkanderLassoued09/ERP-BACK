import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePriceTechInput {
  @Field(() => Int)
  priceTech: number;
}
