import { CreateClientInput } from './create-client.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateClientInput extends PartialType(CreateClientInput) {
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
