type MatrixMapAxisFunction <T, R = any, M=T> = (value: T, i: number, matrix: Matrix<M>) => R
type MatrixMapFunction<V,M=any,R = any> = (value: V, x: number, y: number, matrix: Matrix<M>) => R
type MatrixReduceFunction<A,T=any> = (acc: A, el: T, x: number, y: number, matrix: Matrix<T>) => A

export class Matrix<T = any> {
    public $matrix: T[][]

    constructor (rowsCount?: number, colsCount?: number) {
        this.$matrix = new Array(rowsCount).fill(null).map(() => new Array(colsCount).fill(null))
    }

    get (x: number, y: number, defaultValue: any = null): T {
        if (!Array.isArray(this.$matrix[y]) || this.$matrix[y][x] === undefined) return defaultValue
        return this.$matrix[y][x]
    }

    set (x: number, y: number, value: T): Matrix<T> {
        this.$matrix[y] = this.$matrix[y] || []
        this.$matrix[y][x] = value
        return this
    }

    get rows () {
        return this.$matrix.length
    }

    get cols () {
        return this.$matrix[0].length
    }

    getRow(y: number): Matrix<T> {
        if (y < 0 || y >= this.$matrix.length) return new Matrix()
        return Matrix.from([this.$matrix[y]])
    }

    getCol(x: number): Matrix<T> {
        return Matrix.from([this.$matrix.map(row => row[x])])
    }

    clear () {
        for (let i in this.$matrix) {
            this.$matrix[i] = new Array(this.cols).fill(null)
        }
    }

    mapRows<R>(cb: MatrixMapAxisFunction<Matrix<T>, R,T>): Matrix<R> {
        const maped = new Matrix<R>(this.$matrix.length, 1)
        const qtRows = this.$matrix.length

        for (let y = 0; y < qtRows; y++) {
            maped.set(+y, 0, cb(this.getRow(+y), +y, this))
        }

        return maped
    }

    mapCols<C>(cb: MatrixMapAxisFunction<Matrix<T>,C,T>): Matrix<C> {
        const qtCols = this.$matrix[0].length
        const maped = new Matrix<C>(1, qtCols)

        for (let x = 0; x < qtCols; x++) {
            maped.set(0, +x, cb(this.getCol(+x), +x, this))
        }

        return maped
    }

    map<M>(cb: (value: T, x: number, y: number) => M): Matrix<M> {
        const { rows, cols } = this
        const maped = new Matrix(rows, cols)

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                maped.$matrix[y][x] = cb(this.$matrix[y][x], +x, +y)
            } 
        }
    
        return maped
    }

    clone () {
        return this.map((col) => col)
    }

    every (cb: (value: T, x: number, y: number) => boolean): boolean {
        const rowCount = this.$matrix.length

        for (let y = 0; y < rowCount; y++) {
            const colCount = this.$matrix[y].length

            for (let x = 0; x < colCount; x++) {
                if (!cb(this.$matrix[y][x], +x, +y)) return false
            } 
        }

        return true
    }

    forEach (cb: MatrixMapFunction<T,T,any>): void {
        let { rows, cols } = this;

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                cb(this.$matrix[y][x], +x, +y, this)
            } 
        }
    }

    forEachRow (cb: MatrixMapAxisFunction<Matrix<T>,void,any>): void {
        const countRows = this.$matrix.length
        for (let y = 0; y < countRows; y++) {
            cb(this.getRow(+y), +y, this)
        }
    }

    reduce<U>(cb: MatrixReduceFunction<U,T>, initialValue?: U) {
        const countRows = this.$matrix.length

        for (let y = 0; y < countRows; y++) {
            const countCol = this.$matrix[y].length

            for (let x = 0; x < countCol; x++) {
                initialValue = cb(initialValue, this.$matrix[y][x], +x, +y, this)
            }
        }

        return initialValue
    }

    static from<T = any>(arr: Matrix<T>|T[][]): Matrix<T> {
        if (arr instanceof Matrix) return arr.clone()
        const m = new Matrix()
        m.$matrix = Array.from(arr)
        return m
    }
}