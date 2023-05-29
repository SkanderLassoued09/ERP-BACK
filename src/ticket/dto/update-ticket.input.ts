import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class ComposantUpdate {
  @Field()
  nameComposant: string;
  @Field(() => Int)
  quantity: number;
}

@InputType()
export class UpdateTicketInput {
  @Field({ nullable: true })
  designiation: string;
  @Field({ nullable: true })
  emplacement: string;
  @Field({ nullable: true })
  numero: string;
  @Field({ nullable: true })
  remarque: string;
  @Field({ nullable: true })
  reparable: string;
  @Field({ nullable: true })
  pdr: string;
  @Field({ nullable: true })
  diagnosticTimeByTech: string;
  @Field(() => [ComposantUpdate], { nullable: true })
  composant?: ComposantUpdate[];
}
