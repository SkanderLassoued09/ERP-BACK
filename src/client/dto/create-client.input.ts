import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class DetailsClientInput {
  @Field({ nullable: true })
  fullName: string;
  @Field({ nullable: true })
  email: string;
  @Field({ nullable: true })
  phone: string;
}

@InputType()
export class CreateClientInput {
  //Type and id
  @Field({ nullable: true })
  _id: string;
  @Field({ nullable: true })
  type: string;
  @Field({ defaultValue: false })
  isDeleted: boolean;

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
  @Field(() => DetailsClientInput, { nullable: true })
  achat: DetailsClientInput;
  @Field(() => DetailsClientInput, { nullable: true })
  financier: DetailsClientInput;
  @Field(() => DetailsClientInput, { nullable: true })
  technique: DetailsClientInput;
}
/**
 *
 */
