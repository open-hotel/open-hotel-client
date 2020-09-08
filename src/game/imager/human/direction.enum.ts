
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

  // export const radiusMirrors = {
  //   [HumanDirection.NW]: HumanDirection.SE,
  //   [HumanDirection.W]: HumanDirection.N,
  //   [HumanDirection.SW]: HumanDirection.NE,
  //   [HumanDirection.S]:
  // }
}
