import { Test, TestingModule } from '@nestjs/testing';
import { MobiController } from './mobi.controller';

describe('Mobi Controller', () => {
  let controller: MobiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MobiController],
    }).compile();

    controller = module.get<MobiController>(MobiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
