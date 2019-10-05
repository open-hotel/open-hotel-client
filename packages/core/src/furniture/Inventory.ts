import { MobiDefinition, WallMobi, FloorMobi } from './Furniture'

export class Inventory {
  public wallMobis: WallMobi[]
  public floorMobis: FloorMobi[]

  constructor(public mobis: MobiDefinition[]) {
    this.populate()
  }

  private populate() {
    for (const mobi of this.mobis) {
      if (this.isFloorMobi(mobi)) {
        this.floorMobis.push(mobi)
      } else {
        this.wallMobis.push(mobi as WallMobi)
      }
    }
  }

  private isFloorMobi(mobi: MobiDefinition): mobi is FloorMobi {
    return mobi.type === 'floor'
  }
}
