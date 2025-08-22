import supabase from "@/lib/supabaseClient"
import { getAllOwners } from "./getOwners"
import { getAccountsAssociatedToOwners } from "./getAccountsAssociatedToOwners"
import { getTodayRange, getYesterdayRange } from "../date/getDates"
import { getRegistrosByCuentaContableId } from "./getRegistrosByCuentaContableId"

export const getDailyRegistros = async () => {
  try {
    const { start, end } = getTodayRange()

    const { data: dailyData, error } = await supabase
      .from("registros")
      .select("monto, fecha")
      .eq("tipo_movimiento", "egreso")
      .gte("created_at", start)
      .lt("created_at", end)

    if (error) {
      console.error("Error fetching daily registros:", error)
      return []
    }

    return dailyData
  } catch (error) {
    console.error("Error fetching daily registros:", error)
    return []
  }
}


export const getDailyEgresosComparison = async () => {
  // rango de hoy (hasta ahora)
  const { start: todayStart, end: todayEnd } = getTodayRange()
  // rango de ayer (día completo)
  const { start: yesterdayStart, end: yesterdayEnd } = getYesterdayRange()

  // traer egresos de hoy
  const { data: todayData, error: todayError } = await supabase
    .from("registros")
    .select("monto")
    .eq("tipo_movimiento", "egreso")
    .gte("fecha", todayStart)
    .lt("fecha", todayEnd)

  if (todayError) {
    console.error("Error fetching today's egresos:", todayError)
    return null
  }

  // traer egresos de ayer
  const { data: yesterdayData, error: yesterdayError } = await supabase
    .from("registros")
    .select("monto")
    .eq("tipo_movimiento", "egreso")
    .gte("fecha", yesterdayStart)
    .lt("fecha", yesterdayEnd)

  if (yesterdayError) {
    console.error("Error fetching yesterday's egresos:", yesterdayError)
    return null
  }

  // sumar montos
  const todayTotal = todayData?.reduce((sum, r) => sum + r.monto, 0) || 0
  const yesterdayTotal = yesterdayData?.reduce((sum, r) => sum + r.monto, 0) || 0

  // calcular variación porcentual
  let percentageChange = 0
  if (yesterdayTotal > 0) {
    percentageChange = ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100
  }

  return {
    todayTotal,
    yesterdayTotal,
    percentageChange,
  }
}

export const getDailyIngresosToOwners = async () => {
  const owners = await getAllOwners()
  if (!owners || owners.length === 0) {
    console.warn("No owners found")
    return { today: [], yesterday: [] }
  }

  const accountsMap = new Map<string, string[]>()

  for (const owner of owners) {
    const rows = await getAccountsAssociatedToOwners(owner.id)
    const ids = (rows ?? [])
      .map((x: any) =>
        typeof x === "string" ? x : x?.cuenta_contable_id ?? x?.id
      )
      .filter((v: any): v is string => typeof v === "string" && v.length > 0)

    accountsMap.set(owner.name, ids)
  }

  const todayRange = getTodayRange()
  const yesterdayRange = getYesterdayRange()

  const todayResults: { owner: string; ingresos: number; egresos: number }[] = []
  const yesterdayResults: { owner: string; ingresos: number; egresos: number }[] = []

  for (const [ownerName, accountsIds] of accountsMap) {
    if (!accountsIds || accountsIds.length === 0) continue

    // 🔹 HOY
    const registrosToday = await getRegistrosByCuentaContableId(accountsIds, todayRange)
    let ingresosToday = 0
    let egresosToday = 0
    for (const r of registrosToday ?? []) {
      if (r.tipo_movimiento === "ingreso") ingresosToday += r.monto
      if (r.tipo_movimiento === "egreso") egresosToday += r.monto
    }
    todayResults.push({ owner: ownerName, ingresos: ingresosToday, egresos: egresosToday })

    // 🔹 AYER
    const registrosYesterday = await getRegistrosByCuentaContableId(accountsIds, yesterdayRange)
    let ingresosYesterday = 0
    let egresosYesterday = 0
    for (const r of registrosYesterday ?? []) {
      if (r.tipo_movimiento === "ingreso") ingresosYesterday += r.monto
      if (r.tipo_movimiento === "egreso") egresosYesterday += r.monto
    }
    yesterdayResults.push({ owner: ownerName, ingresos: ingresosYesterday, egresos: egresosYesterday })
  }

  return { today: todayResults, yesterday: yesterdayResults }
}