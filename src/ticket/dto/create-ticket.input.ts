import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTicketInput {
  @Field()
  designiation: string;
  @Field()
  emplacement: string;
  @Field()
  numero: string;
  @Field()
  remarque: string;
  @Field()
  reparable: string;
  @Field()
  pdr: string;
  @Field()
  techNameSug: string;
  @Field()
  typeClient: string;
}
