export class GameObject extends PIXI.Sprite {
    private attrs: {
        [key: string]: any
    } = {}

    public set(key: string, value: any) {
        this.attrs[key] = value
        return this
    }

    public get(key: string, defaultValue?: any) {
        return this.attrs[key] === undefined ? defaultValue : this.attrs[key]
    }

    public del(key: string) {
        delete this.attrs[key]
        return this
    }
}
