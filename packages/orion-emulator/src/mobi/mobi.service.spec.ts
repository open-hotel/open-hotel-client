import { Test, TestingModule } from '@nestjs/testing';
import { MobiService } from './mobi.service';

describe('MobiService', () => {
  let service: MobiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MobiService],
    }).compile();

    service = module.get<MobiService>(MobiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
