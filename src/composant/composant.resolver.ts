import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ComposantService } from './composant.service';
import { Composant } from './entities/composant.entity';
import { CreateComposantInput } from './dto/create-composant.input';
import { UpdateComposantInput } from './dto/update-composant.input';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/role-guard';
import { Role, Roles } from 'src/ticket/role-decorator';
import { ROLE } from 'src/auth/roles';

@Resolver(() => Composant)
export class ComposantResolver {
  constructor(private readonly composantService: ComposantService) {}

  @Mutation(() => Composant)
  createComposant(
    @Args('createComposantInput') createComposantInput: CreateComposantInput,
  ) {
    return this.composantService.create(createComposantInput);
  }

  @Roles(Role.MAGASIN)
  @UseGuards(RolesGuard)
  @Query(() => [Composant])
  async getComposantByTicket(@Args('_idTicket') _idTicket: string) {
    return await this.composantService.getComposantByTicket(_idTicket);
  }

  @Query(() => Composant, { name: 'composant' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.composantService.findOne(id);
  }

  @Mutation(() => Composant)
  updateComposant(
    @Args('updateComposantInput') updateComposantInput: UpdateComposantInput,
  ) {
    return this.composantService.update(
      updateComposantInput.id,
      updateComposantInput,
    );
  }

  @Mutation(() => Composant)
  removeComposant(@Args('id', { type: () => Int }) id: number) {
    return this.composantService.remove(id);
  }

  @Query(() => [Composant])
  async getAllComposant() {
    return await this.composantService.getAllCompoasant();
  }
}
