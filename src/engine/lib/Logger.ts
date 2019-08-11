export enum Log {
    OFF,
    ALL,
    DEBUG,
    INFO,
    WARN,
    ERROR,
    FATAL,
}

export class Logger {
    public _tagStyle = {
        base: {
            color: '#333',
            background: '#E0E0E0',
            padding: '.25em 1em',
            'border-radius': '1em',
            'font-size': '.8em',
            width: '64px',
        },
        tag: {
            background: '#2b2b2b',
            color: 'rgba(255, 255, 255, .82)',
            margin: '0 .5em',
        },
        [Log.DEBUG]: {
            color: '#555',
            'font-style': 'italic',
        },
        [Log.ERROR]: {
            background: '#F33',
            color: '#FFFF',
            'font-weight': 'bold',
        },
        [Log.FATAL]: {
            background: '#F00',
            color: '#FFFF',
            'font-weight': 'bold',
            'text-decoration': 'underline',
        },
        [Log.INFO]: {
            background: '#08D',
            color: '#FFFF',
            'font-weight': 'bold',
        },
        [Log.WARN]: {
            background: '#FA0',
            color: '#000',
            'font-weight': 'bold',
        },
    }

    public _logLevelsNames: {
        [k: number]: string
    } = {
        [Log.DEBUG]: 'debug',
        [Log.ERROR]: 'error',
        [Log.FATAL]: 'fatal',
        [Log.INFO]: 'info',
        [Log.WARN]: 'warning',
    }

    constructor(public tag?: string, public level: Log = Log.ALL, public context: string[] = null) {}

    debug(...args: any[]) {
        return this.log(Log.DEBUG, ...args)
    }

    info(...args: any[]) {
        return this.log(Log.INFO, ...args)
    }

    warn(...args: any[]) {
        return this.log(Log.WARN, ...args)
    }

    error(...args: any[]) {
        return this.log(Log.ERROR, ...args)
    }

    fatal(...args: any[]) {
        this.log(Log.FATAL, ...args)
        throw new Error(args[0])
    }

    log(level: Log | any, ...args: any[]) {
        return this.writeLog(level, this.tag, ...args)
    }

    private writeLog(level: Log | number = 1, context: string, ...messages: any[]) {
        if (Array.isArray(this.context) && !this.context.includes(context)) return this
        if (this.level === Log.OFF || level < this.level) return this

        const levelName = this._logLevelsNames[level]
        const tagStyle = getTagStyle(this._tagStyle, 'tag')
        const levelStyle = getTagStyle(this._tagStyle, level)

        console.log(`%c${context}%c${levelName}`, tagStyle, levelStyle, ...messages)
    }

    create(context: string) {
        const contextItems = this.level === Log.OFF ? [] : this.context
        return new Logger(context, this.level, contextItems)
    }
}

function getTagStyle(styles: any, level: Log | number | string) {
    const style = Object.assign({}, styles.base, styles[level])

    let str = ''

    for (let prop in style) {
        str += `${prop}:${style[prop]};`
    }

    return str
}
