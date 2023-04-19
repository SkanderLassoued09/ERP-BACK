import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { Profile } from 'src/profile/entities/profile.entity';

@InputType()
export class CreateAuthInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

@ObjectType()
export class LoginResponse {
  @Field()
  token: string;
  @Field()
  profile: Profile;
}

@InputType()
export class LoginAuthInput {
  @Field()
  username: string;
  @Field()
  pass: string;
}
