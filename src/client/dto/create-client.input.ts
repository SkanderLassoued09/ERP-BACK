import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class DetailsClient {
  @Field()
  fullName: string;
  @Field()
  email: string;
  @Field()
  phone: string;
}

@InputType()
export class CreateClientInput {
  @Field({ nullable: true })
  _id: string;
  @Field({ nullable: true })
  firstName: string;
  @Field({ nullable: true })
  lastName: string;
  @Field()
  email: string;
  @Field()
  phone: string;
  @Field()
  address: string;
  @Field({ nullable: true })
  type: string;
  @Field({ nullable: true })
  companyName: string;
  @Field({ nullable: true })
  region: string;
  @Field({ nullable: true })
  codePostal: string;
  @Field({ nullable: true })
  tva: string;
  @Field({ nullable: true })
  etat: string;
  @Field({ nullable: true })
  fax: string;
  @Field({ nullable: true })
  ibanRib: string;
  @Field({ nullable: true })
  swiftBic: string;
  @Field({ nullable: true })
  nattestation: string;
  @Field({ nullable: true })
  codeFiscal: string;
  @Field({ nullable: true })
  conPayment: string;
  @Field({ nullable: true })
  website: string;
  @Field({ nullable: true })
  techContact: string;
  @Field({ nullable: true })
  nRegisterCommerce: string;
  @Field({ nullable: true })
  achat: DetailsClient;
  @Field({ nullable: true })
  financier: DetailsClient;
  @Field({ nullable: true })
  technique: DetailsClient;
}
