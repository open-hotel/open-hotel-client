import { Container, Texture } from "pixi.js";
import { Application } from "../../../engine/Application";

export class Figure extends Container {
  partGroups: Record<string, Container> = {}

  constructor (
    private app: Application
  ) {
    super()
  }

  getTexture (): Texture {
    return this.app.renderer.generateTexture(this, PIXI.SCALE_MODES.LINEAR, 1)
  }

  addGroup (name: string, partGroup: Container) {
    this.partGroups[name] = partGroup
    this.addChild(partGroup)
  }
}
