import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class PriceTechDTO {
  @Field(() => Float)
  priceTech: number;
}
