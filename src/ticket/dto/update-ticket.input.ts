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
  @Field({ nullable: true })
  isAffected: boolean;
  @Field({ nullable: true })
  package: string;
  @Field({ nullable: true })
  pdfComposant: string;
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
  finalPriceToAdminTech: boolean;
  @Field({ nullable: true })
  finalPriceToAdminManager: boolean;
  @Field({ nullable: true })
  remarqueManager: string;
  @Field({ nullable: true })
  remarqueTech: string;
  @Field({ nullable: true })
  reparable: string;
  @Field({ nullable: true })
  pdr: string;
  @Field({ nullable: true })
  issue: string;
  @Field({ nullable: true })
  diagnosticTimeByTech: string;
  @Field({ nullable: true })
  reparationTimeByTech: string;
  @Field(() => [ComposantsUpdate], { nullable: true })
  composants: ComposantsUpdate[];
  @Field({ nullable: true })
  magasinDone: boolean;
  @Field({ nullable: true })
  IsFinishedAdmins: boolean;
  // to handle reparable butn
  @Field({ nullable: true })
  isReparable: boolean;
  @Field({ nullable: true })
  openDiscount: string;
  @Field({ nullable: true })
  coordinatorToAdmin: string;
}

@InputType()
export class UpdateTicketManager {
  @Field({ nullable: true })
  _id: string;
  @Field({ nullable: true })
  remise: string;
  @Field({ nullable: true })
  statusFinal: boolean;
  @Field({ nullable: true })
  bc: string;
  @Field({ nullable: true })
  bl: string;
  @Field({ nullable: true })
  facture: string;
  @Field({ nullable: true })
  Devis: string;
}
