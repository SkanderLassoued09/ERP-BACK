import { Test, TestingModule } from '@nestjs/testing';
import { ComposantService } from './composant.service';

describe('ComposantService', () => {
  let service: ComposantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComposantService],
    }).compile();

    service = module.get<ComposantService>(ComposantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
