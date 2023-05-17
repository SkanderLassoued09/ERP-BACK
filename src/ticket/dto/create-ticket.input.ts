import { InputType, Int, Field } from '@nestjs/graphql';

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
  remarque: string;
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
  isOpenByTech: String;
}
