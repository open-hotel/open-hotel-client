import { Controller, Get } from '@nestjs/common';
import { MobiService } from './mobi.service';

@Controller('/mobi')
export class MobiController {
  constructor(private readonly mobiService: MobiService) {}

  @Get('/inventory')
  getInventory() {
    return this.mobiService.getInventory();
  }
}
