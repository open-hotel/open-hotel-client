import Vue from 'vue'

export class EventEmitter {
    private bus = new Vue()
    on (event: string | string[], cb: Function) {
        this.bus.$on(event, cb)
    }
    off (event: string | string[], cb: Function) {
        this.bus.$off(event, cb)
    }
    emit (event: string, ...args: any) {
        this.bus.$emit(event, ...args)
    }
}