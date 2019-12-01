import { GameEntity } from '../../engine/lib/GameEntity'

interface FurnitureAttrs {
  type: number | null
  prefix: string
  action: string
  direction: number
  mobi: any
}

export class GameFurniture<StateType = any> extends GameEntity<FurnitureAttrs> {
  public blockCoordinates = [[0]]
  constructor({ action = '64', direction = 0, mobi }: FurnitureAttrs, layerName: string = 'a') {
    super(layerName, `furniture/default/${mobi.id}`, { action, direction, type: null, prefix: mobi.name, mobi })
    this.sprite.scale.set(1, 1)
    this.blockCoordinates = mobi.area
  }
}
