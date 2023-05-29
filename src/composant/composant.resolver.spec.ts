import { Test, TestingModule } from '@nestjs/testing';
import { ComposantResolver } from './composant.resolver';
import { ComposantService } from './composant.service';

describe('ComposantResolver', () => {
  let resolver: ComposantResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComposantResolver, ComposantService],
    }).compile();

    resolver = module.get<ComposantResolver>(ComposantResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
