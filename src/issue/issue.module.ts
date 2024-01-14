import { Module } from '@nestjs/common';
import { IssueService } from './issue.service';
import { IssueResolver } from './issue.resolver';
import { IssueSchema } from './entities/issue.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [IssueResolver, IssueService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Issue',
        schema: IssueSchema,
      },
    ]),
  ],
})
export class IssueModule {}
