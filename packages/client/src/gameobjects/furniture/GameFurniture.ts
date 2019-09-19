import { GameObject } from '../../engine/lib/GameObject'
import { FloorBlock } from '../room/FloorBlock'
import { MobiDefinition } from '@open-hotel/core'
import { GameEntity } from '@/engine/lib/GameEntity'

interface FurnitureAttrs<StateType> {
  mobi: MobiDefinition<StateType>
  action?: string
  direction?: number
}

type TODO = any
export class GameFurniture<StateType = any> extends GameEntity<TODO> {
  public blockCoordinates = [[0]]
  constructor({ action = '64', direction = 0, mobi }: FurnitureAttrs<StateType>, layerName: string = 'a') {
    super(layerName, `furniture/default/${mobi.id}`, { action, direction, type: '', prefix: mobi.name })
    this.sprite.scale.set(1, 1)
    this.blockCoordinates = mobi.area
  }
}
