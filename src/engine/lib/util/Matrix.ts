type MatrixMapAxisFunction<T, R = any, M = T> = (value: T, i: number, matrix?: Matrix<M>) => R

type MatrixMapFunction<V, M = any, R = any> = (value: V, x: number, y: number, matrix?: Matrix<M>) => R

type MatrixReduceFunction<A, T = any> = (acc: A, el: T, x: number, y: number, matrix?: Matrix<T>) => A

export const MatrixDeserializers = {
  number: v => Number(v),
  string: v => v,
}
export const MatrixSerializer = {
  number: (v: number) => String(v),
  string: (v: string) => v,
}

const defaultSerializeOptions = {
  headerDelimiter: ';',
  metaDelimiter: ':',
  delimiter: ',',
  deserializer: MatrixDeserializers.string,
  serializer: MatrixSerializer.string,
}

type SerializeOptions = typeof defaultSerializeOptions

const HEIGHTS = 'x0123456789abcdefghijklmnopqrstuvwyz'

export class Matrix<T = any> {
  constructor(
    public width: number = 3,
    public height: number = width,
    public data: T[] = new Array(width * height).fill(null),
    public meta = [],
  ) {
    this.data = data.slice(0, width * height)
  }

  *rows(start = 0, end = this.height - 1): Generator<[number, T[]]> {
    for (let i = start; i <= end; i++) {
      yield [i, this.getRow(i)]
    }
  }

  *columns(): Generator<[number, T[]]> {
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
    if (x < 0 || (y < 0 && x >= this.width) || y >= this.height) return defaultValue
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
  fill<T>(value: T = null): Matrix<T> {
    this.data = new Array(this.width * this.height).fill(value)
    return this as unknown as Matrix<T>
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
  neighborsOf(x: number, y: number): Matrix<T> {
    return new Matrix<T>(3, 3, [
      this.get(x - 1, y - 1),
      this.get(x, y - 1),
      this.get(x + 1, y - 1),
      this.get(x - 1, y + 0),
      this.get(x, y + 0),
      this.get(x + 1, y + 0),
      this.get(x - 1, y + 1),
      this.get(x, y + 1),
      this.get(x + 1, y + 1),
    ])
  }

  /**
   * Cria uma nova matriz apartir de uma string codificada
   * @param encodedMatrix String codificada
   * @param param1 Opções de decodificação
   */
  static parse<T>(
    encodedMatrix: string,
    { metaDelimiter, headerDelimiter, deserializer, delimiter }: SerializeOptions = defaultSerializeOptions,
  ): Matrix<T> {
    const [encodedHeader, encodedData] = encodedMatrix.split(metaDelimiter)
    const [cols, rows, ...meta] = encodedHeader.split(headerDelimiter)
    deserializer = deserializer || MatrixDeserializers.string
    const data = encodedData.split(delimiter).map<T>(deserializer)
    return this.fromArray<T>(data, +cols, +rows, meta)
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
  stringify({ headerDelimiter = ';', metaDelimiter = ':', delimiter = ',' } = {}) {
    return [[this.width, this.height, ...this.meta].join(headerDelimiter), this.data.join(delimiter)].join(
      metaDelimiter,
    )
  }

  toString() {
    return `[Matrix ${this.width}x${this.height}] {\n  ${this.mapRows(v => v.map(v => String(v || 0)).join(' ')).join(
      '\n  ',
    )}\n}`
  }

  static fromLegacyString<T extends number>(map: string) {
    map = map.replace(new RegExp(`[^${HEIGHTS}\n]|^\n+|\n+$`, 'gm'), '');
    const { data, cols, rows } = [...map].reduce((acc, char) => {
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
    }, {
      data: [] as T[],
      cols: 0,
      rowCol: 0,
      rows: 0
    })

    return Matrix.from<T>(data, cols, rows)
  }
}
