type MatrixMapAxisFunction<T, R = any, M = T> = (value: T, i: number, matrix?: Matrix<M>) => R

type MatrixMapFunction<V, M = any, R = any> = (value: V, x: number, y: number, matrix?: Matrix<M>) => R

type MatrixReduceFunction<A, T = any> = (acc: A, el: T, x: number, y: number, matrix?: Matrix<T>) => A

export const MatrixDeserializers = {
  json: v => {
    try {
      return JSON.parse(v)
    } catch (e) {
      return v
    }
  },
  number: v => Number(v),
  string: v => v,
}
export const MatrixSerializer = {
  number: (v: number) => String(v),
  string: (v: string) => v,
  json: v => {
    if (typeof v === 'number' || typeof v === 'string') return v
    try {
      return JSON.parse(v)
    } catch (e) {
      return v
    }
  },
}

const defaultSerializeOptions = {
  headerDelimiter: ',',
  metaDelimiter: ';',
  delimiter: '',
  deserializer: MatrixDeserializers.json,
  serializer: MatrixSerializer.json,
}

type SerializeOptions = typeof defaultSerializeOptions

const HEIGHTS = 'x0123456789abcdefghijklmnopqrstuvwyz'

export class Matrix<T = any> {
  static NEIGHBORS = {
    TOP_LEFT: { x: -1, y: -1 },
    TOP: { x: 0, y: -1 },
    TOP_RIGHT: { x: 1, y: -1 },
    RIGHT: { x: 1, y: 0 },
    BOTTOM_RIGHT: { x: 1, y: 1 },
    BOTTOM: { x: 0, y: 1 },
    BOTTOM_LEFT: { x: -1, y: 1 },
    LEFT: { x: -1, y: 0 },
    CENTER: { x: 0, y: 0 },
  }
  static NEIGHBORS_ALL = [
    Matrix.NEIGHBORS.TOP_LEFT,
    Matrix.NEIGHBORS.TOP,
    Matrix.NEIGHBORS.TOP_RIGHT,
    Matrix.NEIGHBORS.RIGHT,
    Matrix.NEIGHBORS.BOTTOM_RIGHT,
    Matrix.NEIGHBORS.BOTTOM,
    Matrix.NEIGHBORS.BOTTOM_LEFT,
    Matrix.NEIGHBORS.LEFT,
  ]
  static NEIGHBORS_ADJACENT = [
    Matrix.NEIGHBORS.TOP,
    Matrix.NEIGHBORS.RIGHT,
    Matrix.NEIGHBORS.BOTTOM,
    Matrix.NEIGHBORS.LEFT,
  ]
  static NEIGHBORS_DIAGONAL = [
    Matrix.NEIGHBORS.TOP_LEFT,
    Matrix.NEIGHBORS.TOP_RIGHT,
    Matrix.NEIGHBORS.BOTTOM_RIGHT,
    Matrix.NEIGHBORS.BOTTOM_LEFT,
  ]

  constructor(
    public width: number = 3,
    public height: number = width,
    public data: T[] = new Array(width * height).fill(null),
    public meta = [],
  ) {
    this.data = data.slice(0, width * height)
  }

  *rowsEntries(start = 0, end = this.height - 1): Generator<[number, T[]]> {
    for (let i = start; i <= end; i++) {
      yield [i, this.getRow(i)]
    }
  }

  *columnsEntries(): Generator<[number, T[]]> {
    for (let i = 0; i < this.width; i++) {
      yield [i, this.getCol(i)]
    }
  }

  /**
   * Retorna o índice pela linha e coluna
   * @param x Coluna
   * @param y Linha
   */
  getIndexOf(x: number, y: number) {
    return y * this.width + x
  }

  /**
   * Retorna a linha e coluna pelo índice
   * @param index Índice
   */
  getCoords(index: number) {
    return {
      x: index % this.width,
      y: Math.floor(index / this.width),
    }
  }

  /**
   * Retorna um valor pela linha e coluna
   * @param x Coluna
   * @param y Linha
   * @param defaultValue Valor padrão caso não seja definido
   */
  get(x: number, y: number, defaultValue: any = null): T {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return defaultValue
    const index = this.getIndexOf(x, y)
    return index >= this.data.length ? defaultValue : this.data[index]
  }

  /**
   * Define um valor pela linha e coluna
   * @param x Coluna
   * @param y Linha
   * @param value Novo valor
   */
  set(x: number, y: number, value: T): Matrix<T> {
    const index = this.getIndexOf(x, y)
    this.data[index] = value
    return this
  }

  /**
   * Retorna uma coluna inteira
   * @param x Índice da coluna
   */
  getCol(x: number): T[] {
    if (x >= this.width) throw new Error(`Invalid column!`)
    return this.data.filter((_, index) => {
      return (index - x) % this.width === 0
    })
  }

  /**
   * Retorna uma linha inteira
   * @param y Índice da linha
   */
  getRow(y: number): T[] {
    if (y >= this.height) throw new Error(`Invalid row!`)

    const start = y * this.width
    const end = start + this.width

    return this.data.slice(start, end)
  }

  /**
   * Preenche a matrix com um valor
   * @param value valor a ser preenchido
   */
  fill(value: T | MatrixMapFunction<T>): this {
    if (typeof value === 'function') {
      this.data = this.map(value as MatrixMapFunction<T>).data
    } else {
      this.data = new Array(this.width * this.height).fill(value)
    }
    return this
  }

  /**
   * Retorna uma string única contendo a matriz
   */
  toLegacyString() {
    return this.mapRows((lin, nlin) => lin.map((val: any) => HEIGHTS[val]).join('')).join('\n')
  }

  /**
   * Mapeia todas as linhas da matriz
   * @param cb Callback de mapeamento
   */
  mapRows<R>(cb: MatrixMapAxisFunction<T[], R, T>): R[] {
    const maped = []

    for (let y = 0; y < this.height; y++) {
      maped[y] = cb(this.getRow(y), y, this)
    }

    return maped
  }

  /**
   * Mapeia todas as colunas da matriz
   * @param cb Callback de mapeamento
   */
  mapCols<C>(cb: MatrixMapAxisFunction<T[], C, T>): C[] {
    const maped = []

    for (let x = 0; x < this.width; x++) {
      maped[x] = cb(this.getCol(x), x, this)
    }

    return maped
  }

  /**
   * Mapeia todos os itens da matriz
   * @param cb Callback de mapeamento
   */
  map<M>(cb: (value: T, x: number, y: number, matrix: this) => M): Matrix<M> {
    return Matrix.fromArray(
      this.data.map((value, index) => {
        const { x, y } = this.getCoords(index)
        return cb(value, x, y, this)
      }),
      this.width,
      this.height,
    )
  }

  /**
   * Cria uma nova matriz apartir desta
   */
  clone(): Matrix<T> {
    return Matrix.from<T>(this.data, this.width, this.height)
  }

  /**
   * Retorna se todos os elementos passaram em um teste
   * @param cb Callback de teste
   */
  every(cb: (value: T, x: number, y: number, matrix: this) => boolean): boolean {
    return this.data.every((value, index) => {
      const { x, y } = this.getCoords(index)
      return cb(value, x, y, this)
    })
  }

  /**
   * Retorna se alguns elementos passaram em um teste
   * @param cb Callback de teste
   */
  some(cb: (value: T, x: number, y: number, matrix: this) => boolean): boolean {
    return this.data.some((value, index) => {
      const { x, y } = this.getCoords(index)
      return cb(value, x, y, this)
    })
  }

  /**
   * Retorna se algumas linhas passaram em um teste
   * @param cb Callback de teste
   */
  someRows(cb: (values: T[], y: number, matrix: this) => boolean): boolean {
    for (let i = 0; i < this.height; i++) {
      if (cb(this.getRow(i), i, this)) return true
    }

    return false
  }

  /**
   * Retorna se algumas colunas passaram em um teste
   * @param cb Callback de teste
   */
  someColuns(cb: (values: T[], y: number, matrix: this) => boolean): boolean {
    for (let i = 0; i < this.width; i++) {
      if (cb(this.getCol(i), i, this)) return true
    }

    return false
  }

  /**
   * Executa uma função para cada elemento
   * @param cb Callback a ser executado para cada item
   */
  forEach(cb: MatrixMapFunction<T, T, any>): void {
    return this.data.forEach((value, index) => {
      const { x, y } = this.getCoords(index)
      return cb(value, x, y, this)
    })
  }

  *entries(): Generator<[[number, number], T]> {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        yield [[x, y], this.get(x, y)]
      }
    }
  }

  /**
   * Executa uma função para cada linha
   * @param cb Callback a ser executado para cada linha
   */
  forEachRow(cb: MatrixMapAxisFunction<T[], void, any>): void {
    for (let y = 0; y < this.height; y++) {
      cb(this.getRow(y), +y, this)
    }
  }

  /**
   * Reduz o valor do array em outro valor
   * @param cb Callback de redução
   * @param initialValue Valor inicião
   */
  reduce<U>(cb: MatrixReduceFunction<U, T>, initialValue?: U): U {
    return this.data.reduce<U>((acc, value, index) => {
      const { x, y } = this.getCoords(index)
      return cb(acc, value, x, y, this)
    }, initialValue)
  }

  /**
   * Retorna os valores vizinhos à outro elemento pela linha e coluna
   * @param x Coluna
   * @param y Linha
   */
  neighborsOf(x: number, y: number, items = Matrix.NEIGHBORS_ALL): T[] {
    return items.map(r => this.get(x + r.x, y + r.y))
  }

  /**
   * Cria uma nova matriz apartir de uma string codificada
   * @param encodedMatrix String codificada
   * @param param1 Opções de decodificação
   */
  static parse<T>(
    encodedMatrix: string,
    {
      metaDelimiter = defaultSerializeOptions.metaDelimiter,
      headerDelimiter = defaultSerializeOptions.headerDelimiter,
      deserializer = defaultSerializeOptions.deserializer,
      delimiter = defaultSerializeOptions.delimiter,
    } = {},
  ): Matrix<T> {
    const [encodedHeader, encodedData] = encodedMatrix.split(metaDelimiter)
    const [cols, rows, ...meta] = encodedHeader.split(headerDelimiter)
    deserializer = deserializer || MatrixDeserializers.string
    const data = encodedData.split(delimiter).map<T>(deserializer)
    return this.fromArray<T>(data, +cols, +rows, meta.map(MatrixDeserializers.json))
  }

  /**
   * Cria uma nova matrix a partir de um Array
   * @param data Array
   * @param [cols] Quantidade de colunas
   * @param [rows] Quantidade de linhas
   * @param [meta] Informações customizadas
   */
  static fromArray<T = any>(data: T[], cols: number, rows: number, meta = []): Matrix<T> {
    return new Matrix(cols, rows, data, meta)
  }

  /**
   * Cria uma matriz a partir de uma string
   * @param data String codificada
   * @param options Opções de decodificação
   */
  static from<T = any>(data: string, options?: SerializeOptions): Matrix<T>
  /**
   * Cria uma matriz a partir de um Array 1D
   * @param data Array 1D
   * @param cols Quantidade de colunas
   * @param rows Quantidade de linhas
   */
  static from<T = any>(data: T[], cols: number, rows: number): Matrix<T>
  /**
   * Cria uma matriz a partir de um Array 2D
   * @param data Array 2D
   */
  static from<T = any>(data: T[][]): Matrix<T>
  /**
   * Cria uma matriz a partir de outra matriz
   * @param data Matrix a ser clonada
   */
  static from<T = any>(data: Matrix): Matrix<T>
  static from<T = any>(data, cols?, rows?, options?: SerializeOptions): Matrix<T> {
    // Clone
    if (data instanceof this) return data.clone()

    // Encoded String
    if (typeof data === 'string') {
      options = cols || defaultSerializeOptions
      return this.parse<T>(data, options)
    }

    // Array
    if (Array.isArray(data)) {
      // 2D Array
      if (Array.isArray(data[0])) {
        cols = data[0].length
        rows = data.length
        return this.fromArray<T>([].concat(...data), cols, rows)
      }

      // 1D Array
      return new Matrix<T>(cols, rows, data)
    }

    throw new TypeError(`Type of data should be Array, Array2D, String or Matrix instance.`)
  }

  /**
   * Codifica a matriz em uma string
   * @param param0 Opções de codificação
   */
  stringify({ headerDelimiter = ',', metaDelimiter = ':', delimiter = ',', serializer = v => v } = {}) {
    return [
      [this.width, this.height, ...this.meta.map(MatrixSerializer.json)].join(headerDelimiter),
      this.data.map(serializer).join(delimiter),
    ].join(metaDelimiter)
  }

  toString() {
    return `[Matrix ${this.width}x${this.height}] {\n  ${this.mapRows(v => v.map(v => String(v || 0)).join(' ')).join(
      '\n  ',
    )}\n}`
  }

  static fromLegacyString<T extends number>(map: string) {
    map = map.replace(new RegExp(`[^${HEIGHTS}\n]|^\n+|\n+$`, 'gm'), '')
    const { data, cols, rows } = map.split('').reduce(
      (acc, char) => {
        if (char === '\n') {
          acc.rowCol = 0
          acc.rows++
        } else {
          const i = HEIGHTS.indexOf(char) as T

          acc.data.push(i)
          acc.cols = Math.max(acc.cols, ++acc.rowCol)
          acc.rows = Math.max(1, acc.rows)
        }
        return acc
      },
      {
        data: [] as T[],
        cols: 0,
        rowCol: 0,
        rows: 0,
      },
    )

    return Matrix.from<T>(data, cols, rows)
  }
}
