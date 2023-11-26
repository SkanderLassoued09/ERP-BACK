import { InputType, Field } from '@nestjs/graphql';

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
  //Type and id
  @Field({ nullable: true })
  _id: string;
  @Field({ nullable: true })
  type: string;

  //Field in commun
  @Field({ nullable: true })
  region: string;
  @Field({ nullable: true })
  address: string;
  @Field({ nullable: true })
  email: string;
  @Field({ nullable: true })
  phone: string;

  //Simple client fields
  @Field({ nullable: true })
  firstName: string;
  @Field({ nullable: true })
  lastName: string;

  //Company fields
  @Field({ nullable: true })
  activitePrincipale: string;
  @Field({ nullable: true })
  activiteSecondaire: string;
  @Field({ nullable: true })
  raisonSociale: string;
  @Field({ nullable: true })
  companyName: string;
  @Field({ nullable: true })
  Exoneration: string;
  @Field({ nullable: true })
  fax: string;
  @Field({ nullable: true })
  website: string;
}
