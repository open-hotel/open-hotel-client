
export enum HumanDirection {
  N,
  NE,
  E,
  SE,
  S,
  SW,
  W,
  NW
}

export module HumanDirection {
  export function normalize(direction: number): HumanDirection {
    return Math.round(direction) % 8
  }

  export function fromDeg(angle: number): HumanDirection {
    return normalize((angle/360) * 8)
  }

  export const DirectionAngles = [45, 90, 135, 180, 225, 270, 315, 0]
}
