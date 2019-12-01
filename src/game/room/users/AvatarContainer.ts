export class AvatarContainer {
  look: string
  is_ghost: boolean
  color: number
  container = new PIXI.Container()
  headSprite = new PIXI.AnimatedSprite([]) 
  leftHandSprite = new PIXI.AnimatedSprite([]) 
  rightHandSprite = new PIXI.AnimatedSprite([]) 
  bodySprite = new PIXI.AnimatedSprite([]) 

  constructor (info: Partial<AvatarContainer>) {
    if (info.is_ghost) info.look = 'hd-180-1021'
    Object.assign(this, info)
  }
}