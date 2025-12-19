export const isNotFutureDate = (d: string) => {
  const today = new Date().toISOString().slice(0, 10)
  return d < today
}

export const monthIncludesFutureDates = (month: string) => {
  const todayMonth = new Date().toISOString().slice(0, 7)
  return month >= todayMonth
}

const formatYMDLocal = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const getLocalYesterday = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
}

export const weekDatesFromDate = (ymd: string) => {
  const parseYMDLocal = (s: string) => {
    const y = Number(s.slice(0, 4))
    const m = Number(s.slice(5, 7)) - 1
    const d = Number(s.slice(8, 10))
    return new Date(y, m, d)
  }

  const startOfWeek = (d: Date) => {
    const s = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const dow = s.getDay()
    const diff = dow === 0 ? -6 : 1 - dow
    s.setDate(s.getDate() + diff)
    return s
  }

  const input = parseYMDLocal(ymd)
  const yesterdayLocal = getLocalYesterday()

  const weekStart = startOfWeek(input)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  // If this week reaches into today/future, stop at yesterday (exclude today)
  const end = weekEnd > yesterdayLocal ? yesterdayLocal : weekEnd

  // If weekStart is today or later, there are no valid dates to return
  if (end < weekStart) return []

  const result: string[] = []
  for (let d = new Date(weekStart); d <= end; d.setDate(d.getDate() + 1)) {
    result.push(formatYMDLocal(d))
  }
  return result
}

export const monthDatesFromMonth = (ym: string) => {
  const parseYMLocal = (s: string) => {
    const y = Number(s.slice(0, 4))
    const m = Number(s.slice(5, 7)) - 1
    return new Date(y, m, 1) // first day of month
  }

  const monthStart = parseYMLocal(ym)

  const yesterdayLocal = getLocalYesterday()

  const monthEnd = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 1,
    0 // last day of month
  )

  // If this month reaches into today/future, stop at yesterday
  const end = monthEnd > yesterdayLocal ? yesterdayLocal : monthEnd

  // If monthStart is today or later, no valid dates
  if (end < monthStart) return []

  const result: string[] = []
  for (let d = new Date(monthStart); d <= end; d.setDate(d.getDate() + 1)) {
    result.push(formatYMDLocal(d))
  }

  return result
}
