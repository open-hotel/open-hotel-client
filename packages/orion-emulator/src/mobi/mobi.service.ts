import { Injectable } from '@nestjs/common';
import { MobiDefinition } from '@open-hotel/core'

@Injectable()
export class MobiService {
  getInventory(): MobiDefinition[] {
    return [
        {
            area: [[1, 1]],
            canLay: false,
            canSit: false,
            canStack: false,
            canWalk: false,
            currentState: 0,
            id: 2,
            possibleStates: [0],
            type: 'floor',
            name: '4_noob_plant_noob_plant',
          },
    ];
  }
}
