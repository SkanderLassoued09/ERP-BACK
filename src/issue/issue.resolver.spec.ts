import { Test, TestingModule } from '@nestjs/testing';
import { IssueResolver } from './issue.resolver';
import { IssueService } from './issue.service';

describe('IssueResolver', () => {
  let resolver: IssueResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IssueResolver, IssueService],
    }).compile();

    resolver = module.get<IssueResolver>(IssueResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
