import { ShellProvider } from '../shell.provider';

export interface ShellBinOptions {
    usage ?: string
    description ?: string
}

export const setBin = (name:string, mainFunction:Function, options:ShellBinOptions = {}) =>  {
    const bins = Reflect.getMetadata('SHELL_BINS', ShellProvider) || {}

    bins[name] = {
        ...options,
        main: mainFunction
    }

    Reflect.defineMetadata('SHELL_BINS', bins, ShellProvider)
}

export const ShellCommand = (name ?: string, options:ShellBinOptions = {}):MethodDecorator => (target, key) => {
    name = name || key as string
    setBin(name, target[key].bind(target), options)
    Reflect.defineMetadata('SHELL_BIN_NAME', name, target[key])
}