type EmissionDay = { date: string; value: number }
type EmissionsSummary = {
  totalEmissions: number
  high: EmissionDay | null
  low: EmissionDay | null
  average: number
}

export const formatEmissionsData = (days: EmissionDay[]): EmissionsSummary => {
  //otherwise we cannot use days[0] as starting point in reducers
  if (!days[0]) {
    return {
      totalEmissions: 0,
      average: 0,
      high: { value: 0, date: '' },
      low: { value: 0, date: '' },
    }
  }

  const totalEmissions = days.reduce((sum, d) => sum + d.value, 0)

  const average = totalEmissions / days.length

  const high = days.reduce(
    (prev, cur) => (cur.value > prev.value ? cur : prev),
    days[0]
  )
  const low = days.reduce(
    (prev, cur) => (cur.value < prev.value ? cur : prev),
    days[0]
  )

  return { totalEmissions, high, low, average }
}
