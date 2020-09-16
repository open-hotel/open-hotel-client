import { HumanDirection } from "../util/directions"

export interface IAnimationFrameOffset {
  dx?: number;
  dy?: number;
}

export interface IAnimationFrameBodyPart extends IAnimationFrameOffset {
  assetpartdefinition: string;
  frame: number;
  repeats?: number;
}

export interface IAnimationFrame {
  bodyparts?: Record<string, IAnimationFrameBodyPart>;
  offsets?: Record<HumanDirection, Record<string, IAnimationFrameOffset>>;
}

export interface IAnimation {
  desc: string
  frames: IAnimationFrame[]
}
