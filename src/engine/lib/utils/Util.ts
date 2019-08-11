export function random (start = 0, end = 1, floor = true) {
  const value = (Math.random() * (end - start + 1)) + start
  return floor ? Math.floor(value) : value
}