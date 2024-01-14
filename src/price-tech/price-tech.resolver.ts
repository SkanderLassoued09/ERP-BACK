import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PriceTechService } from './price-tech.service';
import { PriceTech } from './entities/price-tech.entity';
import { CreatePriceTechInput } from './dto/create-price-tech.input';
import { UpdatePriceTechInput } from './dto/update-price-tech.input';

@Resolver(() => PriceTech)
export class PriceTechResolver {
  constructor(private readonly priceTechService: PriceTechService) {}

  @Mutation(() => PriceTech)
  async createPriceTech(
    @Args('input') createPriceTechInput: CreatePriceTechInput,
  ): Promise<PriceTech> {
    return this.priceTechService.create(createPriceTechInput);
  }

  @Query(() => Number)
  async getPriceTech(): Promise<number | null> {
    return this.priceTechService.getPriceTech();
  }

  @Mutation(() => Number)
  async updatePriceTech(
    @Args('newPriceTech') newPriceTech: number,
  ): Promise<number | null> {
    return this.priceTechService.updatePriceTech(newPriceTech);
  }
}
