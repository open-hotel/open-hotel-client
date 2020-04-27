import { Provider, Inject, CURRENT_MODULE } from "injets";
import { Matrix } from "../../engine/lib/util/Matrix";
import { RoomFloorHeight } from "./Room.model";
import { Container } from "pixi.js-legacy";
import { Viewport } from "pixi-viewport";
import { ApplicationProvider } from "../application.provider";
import { GameModule } from "../game.module";

interface RoomOptions {
    map: Matrix<RoomFloorHeight>
}

@Provider()
export class RoomProvider {
    constructor (
        private readonly appProvider: ApplicationProvider,
        @Inject(CURRENT_MODULE)
        private readonly gameModule: GameModule
    ) {
        console.log('modulooo', gameModule)
    }

    private setupRoomEngine () {

    }

    create (options: RoomOptions) {
        const camera = new Viewport().drag({ wheelScroll: 0 }).wheel({
            reverse: false,
            smooth: 10,
        })
        const roomContainer = new Container()
        camera.addChild(roomContainer)

        this.appProvider.app.stage.addChild(camera)
        this.setupRoomEngine()
    }

    dispose () {

    }
}