import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateComposantInput {
  @Field({ nullable: true })
  _id: string;
  @Field({ nullable: true })
  _idTicket: string;
  @Field({ nullable: true })
  statusMagasin: string;
  @Field({ nullable: true })
  nameComposant: string;
  @Field({ nullable: true })
  purchasePrice: string;
  @Field({ nullable: true })
  sellingPrice: string;
  @Field({ nullable: true })
  pdfInfo: string;
}
