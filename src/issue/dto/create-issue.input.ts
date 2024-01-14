import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateIssueInput {
  @Field({ nullable: true })
  _id: string;
  @Field()
  issueName: string;
}
