import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class ComposantsUpdate {
  @Field({ nullable: true })
  _id: string;
  @Field({ nullable: true })
  nameComposant: string;
  @Field(() => Int, { nullable: true })
  quantity: number;
  @Field({ nullable: true })
  sellPrice: string;
  @Field({ nullable: true })
  purchasePrice: string;
  @Field({ nullable: true })
  statusComposant: string;
  @Field({ nullable: true })
  comingDate: string;
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
  remarqueManager: string;
  @Field({ nullable: true })
  remarqueTech: string;
  @Field({ nullable: true })
  reparable: string;
  @Field({ nullable: true })
  pdr: string;
  @Field({ nullable: true })
  diagnosticTimeByTech: string;
  @Field(() => [ComposantsUpdate], { nullable: true })
  composants: ComposantsUpdate[];
}
