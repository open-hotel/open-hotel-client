import { Matrix } from '../../../engine/lib/util/Matrix'

export default [
  {
    value: 0,
    test: new Matrix(3, 3, [
      '*', '*', '*',
      '*', '0', '*',
      '*', '1', '*'
    ]),
  },
  {
    value: 2,
    test: new Matrix(3, 3, [
      '*', '*', '*',
      '1', '0', '*',
      '*', '*', '*'
    ]),
  },
  {
    value: 4,
    test: new Matrix(3, 3, [
      '*', '1', '*',
      '*', '0', '*',
      '*', '*', '*'
    ]),
  },
  {
    value: 6,
    test: new Matrix(3, 3, [
      '*', '*', '*',
      '*', '0', '1',
      '*', '*', '*'
    ]),
  },
  {
    value: 1,
    test: new Matrix(3, 3, [
      '*', '*', '*',
      '*', '0', '*',
      '1', '*', '*'
    ]),
  },
  {
    value: 3,
    test: new Matrix(3, 3, [
      '1', '*', '*',
      '*', '0', '*',
      '*', '*', '*'
    ]),
  },
  {
    value: 5,
    test: new Matrix(3, 3, [
      '*', '*', '1',
      '*', '0', '*',
      '*', '*', '*'
    ]),
  },
]
