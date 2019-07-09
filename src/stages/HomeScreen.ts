import { Scene } from "../engine/lib/Scene";
import { Floor } from "../gameobjects/room/Floor";
import { Viewport } from "pixi-viewport";
import { Human } from "../gameobjects/Human";
import { Matrix } from "../engine/lib/utils/Matrix";
import EasyStar from 'easystarjs'
import { GameObject } from "../engine/lib/GameObject";
import { Walkable } from "../engine/lib/utils/Walk";
import { Debug } from "../engine/lib/utils/Debug";
import { PathFinder } from "../Pathfinder";

const MAX_ZOOM = 4;
const MIN_ZOOM = 1 / 4;

export class HomeScreen extends Scene {
  protected $camera: Viewport;

  setup() {
    this.$camera = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: window.innerWidth * 2,
      worldHeight: window.innerHeight * 2,
      interaction: this.$app.renderer.plugins.interaction
    })
      .drag({
        reverse: false
      })
      .pinch()
      .wheel()
      .clampZoom({
        maxHeight: window.innerHeight * MAX_ZOOM,
        maxWidth: window.innerWidth * MAX_ZOOM,
        minHeight: window.innerHeight * MIN_ZOOM,
        minWidth: window.innerWidth * MIN_ZOOM
      });

    const bg = new PIXI.Graphics();

    bg.beginFill(0x000000, 1);
    bg.drawRect(0, 0, this.$app.view.width, this.$app.view.height);
    bg.endFill();

    bg.width = this.$app.view.width;
    bg.height = this.$app.view.height;

    this.addChild(bg, this.$camera);
  }

  ready() {

    const floor = new Floor({
      map: Matrix.from(
        [
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,3,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,5,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,6,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,7,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,8,1,1,1,1,1,1,1,1],
          [1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1],
          [1,1,1,1,1,1,1,1,8,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,7,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,6,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,5,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,3,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ]
      )
    })

    const human = new Human()
    
    this.$camera.addChild(floor);

    floor.addChild(human)
    human.set('map_position', { x: 0, y: 0 })

    floor.getPositionOf(0, 0).copyTo(human.position)

    const { x, y, width, height } = floor.getBounds()
    
    floor.position.set(this.$app.view.width / 2, this.$app.view.height / 2)
    floor.pivot.set((width / 2) + x, (height / 2) + y)

    const floorPathFinder = new PathFinder(floor.$map.$matrix, (cell, curr) => {
      const a = floor.$map.$matrix[cell.y][cell.x]
      const b = floor.$map.$matrix[curr.y][curr.x]

      return a === b || Math.abs(a - b) === 1
    })
    const walkableUser = new Walkable(human)

    floor.addListener('pointertap', async (e) => {
      if (e.target instanceof GameObject) {
        const humanPosition = human.get('map_position')
        const targetPosition = e.target.get('map_position')
        const path = await floorPathFinder.find(humanPosition, targetPosition)
        const coords = path.map((p) => floor.getPositionOf(p.x, p.y))
        
        walkableUser.followPath(coords, 400, (p, i) => {
          human.zIndex = floor.$mapBlocks.get(path[i].x, path[i].y).zIndex + 1
          floor.sortChildren()
          human.set('map_position', path[i])
        })
      }
    })
  }
}
