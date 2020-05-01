import { Matrix } from '../../../engine/lib/util/Matrix'

export default [
  {
    value: 0,
    offset: { y: 0, z: -12 },
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
    offset: { z: -12 },
    test: new Matrix(3, 3, [
      '*', '*', '*',
      '*', '0', '1',
      '*', '*', '*'
    ]),
  },
  {
    value: 1,
    offset: { z: -12 },
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
    offset: { z: -12 },
    test: new Matrix(3, 3, [
      '*', '*', '1',
      '*', '0', '*',
      '*', '*', '*'
    ]),
  },
]
