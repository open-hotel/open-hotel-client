import { GameObject } from '../../engine/lib/GameObject'
import { FloorBlock } from '../room/FloorBlock'
import { MobiDefinition } from '@open-hotel/core'
import { GameEntity, GameEntityAttrs } from '@/engine/lib/GameEntity'

interface FurnitureAttrs<StateType> {
  mobi: MobiDefinition<StateType>
  action?: string
  direction?: number
}

export class GameFurniture<StateType = any> extends GameEntity<FurnitureAttrs<StateType> & GameEntityAttrs> {
  public blockCoordinates = [[0]]
  constructor({ action = '64', direction = 0, mobi }: FurnitureAttrs<StateType>, layerName: string = 'a') {
    super(layerName, `furniture/default/${mobi.id}`, { action, direction, type: null, prefix: mobi.name, mobi })
    this.sprite.scale.set(1, 1)
    this.blockCoordinates = mobi.area
  }
}
