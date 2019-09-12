import { GameObject } from '../../engine/lib/GameObject'
import { FloorBlock } from '../room/FloorBlock'
import { MobiDefinition } from '@/stages/IRoomMap'
import { GameEntity } from '@/engine/lib/GameEntity'

interface FurnitureAttrs<StateType> {
  mobi: MobiDefinition<StateType>
  action?: string
  direction?: number
}

type TODO = any
export class Furniture<StateType = any> extends GameEntity<TODO> {
  constructor({ action = '64', direction = 0, mobi }: FurnitureAttrs<StateType>, layerName: string = 'a') {
    super(layerName, `furniture/${mobi.id}`, { action, direction, type: 0, prefix: mobi.name })
  }
  getAnimation(action, direction, layerName = this.layerName) {
    const { type } = this.attrs2
    this.updateSheet()
    console.log(`${this.attrs2.prefix}_${action}_${layerName}_${type}_${direction}`, this.sheet)
    return super.getAnimation(action, direction, layerName)
  }
}
