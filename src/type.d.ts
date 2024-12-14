interface Item {
  name: string
  gerName: string
  stackSize: number
  furtherWork?: number
  price: number
  amount: number
}
interface Items {
  [key: number]: Item
}
