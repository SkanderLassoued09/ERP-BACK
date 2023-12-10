import { Resolver, Query, Mutation, Args, Float } from '@nestjs/graphql';
import { PriceTechService } from './Price.service';
import { PriceTechDTO } from './Price.entity';

@Resolver(() => PriceTechDTO)
export class PriceTechResolver {
  constructor(private readonly priceTechService: PriceTechService) {}

  @Query(() => PriceTechDTO)
  getPriceTech(): PriceTechDTO {
    const priceTech = this.priceTechService.getPriceTech();
    return { priceTech };
  }

  @Mutation(() => PriceTechDTO)
  updatePriceTech(
    @Args('newPriceTech', { type: () => Float }) newPriceTech: number,
  ): PriceTechDTO {
    this.priceTechService.updatePriceTech(newPriceTech);
    return { priceTech: newPriceTech };
  }
}
