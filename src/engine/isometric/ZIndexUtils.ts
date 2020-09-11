import { IsoPointObject } from "../lib/IsoPoint";

export const ZIndexUtils = {
  getDistance (entity: IsoPointObject & { radius: number }, point: IsoPointObject) {
    const min = Math.abs(((point.z - entity.z) - entity.radius))
    const max = Math.abs(((point.z - entity.z) + entity.radius))
    return Math.min(min, max)
  },

  getYRotationMatrix (angle: number) {
    const angleInRad = (angle * Math.PI) / 180
    const cos: number = Math.cos(angleInRad)
    const sin: number = Math.sin(angleInRad)

    return [cos, 0, sin, 0, 1, 0, -(sin), 0, cos]
  },

  multiply4x4Matrix (vector4D: number[], vector3D: IsoPointObject) {
    const x = ((vector3D.x * vector4D[0]) + (vector3D.y * vector4D[3])) + (vector3D.z * vector4D[6])
    const y = ((vector3D.x * vector4D[1]) + (vector3D.y * vector4D[4])) + (vector3D.z * vector4D[7])
    const z = ((vector3D.x * vector4D[2]) + (vector3D.y * vector4D[5])) + (vector3D.z * vector4D[8])

    return { x, y, z }
  }
}
