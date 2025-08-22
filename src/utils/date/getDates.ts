export const getTodayRange = () => {
  const now = new Date()
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 1)

  const toOffsetISOString = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    const ss = String(d.getSeconds()).padStart(2, '0')
    const offMin = -d.getTimezoneOffset() // e.g. -300 for -05:00
    const sign = offMin >= 0 ? '+' : '-'
    const abs = Math.abs(offMin)
    const offH = String(Math.floor(abs / 60)).padStart(2, '0')
    const offM = String(abs % 60).padStart(2, '0')
    return `${y}-${m}-${day}T${hh}:${mm}:${ss}${sign}${offH}:${offM}`
  }

  return {
    // Example: 2025-08-21T00:00:00-05:00 .. 2025-08-22T00:00:00-05:00
    start: toOffsetISOString(start),
    end: toOffsetISOString(end),
  }
}


export const getYesterdayRange = () => {
  const now = new Date()
  const start = new Date(now)
  start.setDate(start.getDate() - 1)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 1)

  const toOffsetISOString = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    const ss = String(d.getSeconds()).padStart(2, '0')
    const offMin = -d.getTimezoneOffset()
    const sign = offMin >= 0 ? '+' : '-'
    const abs = Math.abs(offMin)
    const offH = String(Math.floor(abs / 60)).padStart(2, '0')
    const offM = String(abs % 60).padStart(2, '0')
    return `${y}-${m}-${day}T${hh}:${mm}:${ss}${sign}${offH}:${offM}`
  }

  return {
    // Ejemplo: 2025-08-20T00:00:00-05:00 .. 2025-08-21T00:00:00-05:00
    start: toOffsetISOString(start),
    end: toOffsetISOString(end),
  }
}