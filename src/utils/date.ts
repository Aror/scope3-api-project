export const isNotFutureDate = (d: string) => {
  const today = new Date().toISOString().slice(0, 10)
  return d < today
}
