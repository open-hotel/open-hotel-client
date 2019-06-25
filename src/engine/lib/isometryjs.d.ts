declare module '@randallmorey/isometryjs' {
    export type Coordinates = [number, number, number]
    export type TransformFunction = (x: number, y: number, z: number) => Coordinates

    export function makeIsometricTransform (degrees:number): TransformFunction;
    export function makeInverseIsometricTransform (degrees:number): TransformFunction;
    export function standardIsometricTransform (x: number, y: number, z?: number): Coordinates;
    export function standardInverseIsometricTransform(x: number, y: number, z?: number): Coordinates;
}