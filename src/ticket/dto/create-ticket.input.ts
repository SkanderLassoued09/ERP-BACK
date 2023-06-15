import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class ComposantInput {
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
}

@InputType()
export class CreateTicketInput {
  @Field({ nullable: true })
  _id: string;
  @Field({ nullable: true })
  title: string;
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
  techNameSug: string;
  @Field({ nullable: true })
  typeClient: string;
  @Field({ nullable: true })
  createdBy: string;
  @Field({ nullable: true })
  assignedTo: string;
  @Field({ nullable: true })
  status: string;
  @Field({ nullable: true })
  isOpenByTech: string;
  @Field({ nullable: true })
  priority: string;
  @Field({ nullable: true })
  toMagasin: boolean;
  @Field({ nullable: true })
  Devis: string;
  @Field({ nullable: true })
  facture: string;
  @Field({ nullable: true })
  bc: string;
  @Field({ nullable: true })
  bl: string;
  @Field({ nullable: true })
  pdfComposant: string;
  @Field({ nullable: true })
  affectedToCompany: string;
  @Field({ nullable: true })
  affectedToClient: string;
  @Field(() => [ComposantInput], { nullable: true })
  Composants: ComposantInput[];
  @Field({ nullable: true })
  finalPrice: string;
  @Field({ nullable: true })
  IsFinishedAdmins: boolean;
  // to handle reparable butn
  @Field({ nullable: true })
  isReparable: boolean;
  @Field({ nullable: true })
  pdfPath: string;
}

@InputType()
export class MagasinUpdateData {
  @Field({ nullable: true })
  _id: string;
  @Field({ nullable: true })
  nameComposant: string;
  @Field({ nullable: true })
  sellPrice: string;
  @Field({ nullable: true })
  purchasePrice: string;
  @Field({ nullable: true })
  statusComposant: string;
  @Field({ nullable: true })
  comingDate: string;
  @Field({ nullable: true })
  pdfPath: string;
}
