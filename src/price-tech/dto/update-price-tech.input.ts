import { CreatePriceTechInput } from './create-price-tech.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePriceTechInput extends PartialType(CreatePriceTechInput) {
  @Field(() => Int)
  priceTech: number;
}
