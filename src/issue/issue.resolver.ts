import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { IssueService } from './issue.service';
import { Issue, IssueChart } from './entities/issue.entity';
import { CreateIssueInput } from './dto/create-issue.input';
import { UpdateIssueInput } from './dto/update-issue.input';

@Resolver(() => Issue)
export class IssueResolver {
  constructor(private readonly issueService: IssueService) {}

  @Mutation(() => Issue)
  createIssue(@Args('createIssueInput') createIssueInput: CreateIssueInput) {
    return this.issueService.create(createIssueInput);
  }

  @Query(() => [Issue])
  getAllIssue() {
    return this.issueService.getAllIssue();
  }

  @Query(() => Issue, { name: 'issue' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.issueService.findOne(id);
  }

  @Mutation(() => Boolean)
  async removeIssue(@Args('_id') _id: string): Promise<boolean> {
    try {
      return this.issueService.deletedIssue(_id);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to delete issue');
    }
  }
}
