import { ModuleRef } from 'injets'
import { GameModule } from './game.module'

let gameRef = null

export function getGameRef () {
    if (gameRef) {
        return gameRef
    }
    gameRef = ModuleRef.create(GameModule)
    return gameRef
}
