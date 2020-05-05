export default function sumArray (items: Array<number>): number {
  let sum = 0
  for (let i = 0; i < items.length; i++) {
    sum += items[i]
  }
  return sum
}
