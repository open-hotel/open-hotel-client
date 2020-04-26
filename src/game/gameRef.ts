import { ModuleRef } from 'injets'
import { GameModule } from './game.module'

let gameRef: ModuleRef<GameModule> = null

export async function getGameRef () {
    if (gameRef) {
        return gameRef
    }
    // @ts-ignore
    gameRef = await ModuleRef.create(GameModule)
    return gameRef
}
