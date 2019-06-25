import { Scene, SceneOptions } from "../lib/Scene";

export interface Class<T> {
    new (...args:any[]): T
}