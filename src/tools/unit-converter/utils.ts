export type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'data'

export interface Unit {
  id: string
  name: string
  factor?: number // 相对于基准单位的倍数；temperature 用 formula 替代
  toBase?: (value: number) => number
  fromBase?: (value: number) => number
}

export interface Category {
  id: UnitCategory
  name: string
  baseUnit: string
  units: Unit[]
}

export const categories: Category[] = [
  {
    id: 'length',
    name: '长度',
    baseUnit: 'm',
    units: [
      { id: 'm', name: '米 (m)', factor: 1 },
      { id: 'km', name: '千米 (km)', factor: 1000 },
      { id: 'cm', name: '厘米 (cm)', factor: 0.01 },
      { id: 'mm', name: '毫米 (mm)', factor: 0.001 },
      { id: 'in', name: '英寸 (in)', factor: 0.0254 },
      { id: 'ft', name: '英尺 (ft)', factor: 0.3048 },
      { id: 'yd', name: '码 (yd)', factor: 0.9144 },
      { id: 'mi', name: '英里 (mi)', factor: 1609.344 },
    ],
  },
  {
    id: 'weight',
    name: '重量',
    baseUnit: 'kg',
    units: [
      { id: 'kg', name: '千克 (kg)', factor: 1 },
      { id: 'g', name: '克 (g)', factor: 0.001 },
      { id: 'mg', name: '毫克 (mg)', factor: 0.000001 },
      { id: 't', name: '吨 (t)', factor: 1000 },
      { id: 'lb', name: '磅 (lb)', factor: 0.45359237 },
      { id: 'oz', name: '盎司 (oz)', factor: 0.02834952 },
    ],
  },
  {
    id: 'temperature',
    name: '温度',
    baseUnit: 'c',
    units: [
      {
        id: 'c',
        name: '摄氏度 (°C)',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      {
        id: 'f',
        name: '华氏度 (°F)',
        toBase: (v) => (v - 32) * (5 / 9),
        fromBase: (v) => v * (9 / 5) + 32,
      },
      {
        id: 'k',
        name: '开尔文 (K)',
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    ],
  },
  {
    id: 'area',
    name: '面积',
    baseUnit: 'm2',
    units: [
      { id: 'm2', name: '平方米 (m²)', factor: 1 },
      { id: 'km2', name: '平方千米 (km²)', factor: 1_000_000 },
      { id: 'cm2', name: '平方厘米 (cm²)', factor: 0.0001 },
      { id: 'ha', name: '公顷 (ha)', factor: 10_000 },
      { id: 'mu', name: '亩', factor: 666.6667 },
      { id: 'ft2', name: '平方英尺 (ft²)', factor: 0.092903 },
      { id: 'ac', name: '英亩 (ac)', factor: 4046.8564 },
    ],
  },
  {
    id: 'volume',
    name: '体积',
    baseUnit: 'l',
    units: [
      { id: 'l', name: '升 (L)', factor: 1 },
      { id: 'ml', name: '毫升 (mL)', factor: 0.001 },
      { id: 'm3', name: '立方米 (m³)', factor: 1000 },
      { id: 'gal', name: '美制加仑 (gal)', factor: 3.78541 },
      { id: 'qt', name: '美制夸脱 (qt)', factor: 0.946353 },
      { id: 'cup', name: '美制杯 (cup)', factor: 0.236588 },
      { id: 'floz', name: '液盎司 (fl oz)', factor: 0.0295735 },
    ],
  },
  {
    id: 'data',
    name: '数据存储',
    baseUnit: 'b',
    units: [
      { id: 'b', name: '字节 (B)', factor: 1 },
      { id: 'kb', name: 'KB', factor: 1024 },
      { id: 'mb', name: 'MB', factor: 1024 ** 2 },
      { id: 'gb', name: 'GB', factor: 1024 ** 3 },
      { id: 'tb', name: 'TB', factor: 1024 ** 4 },
      { id: 'pb', name: 'PB', factor: 1024 ** 5 },
    ],
  },
]

export function convertValue(
  value: number,
  fromUnitId: string,
  toUnitId: string,
  category: Category,
): number {
  if (fromUnitId === toUnitId) return value

  const fromUnit = category.units.find((u) => u.id === fromUnitId)
  const toUnit = category.units.find((u) => u.id === toUnitId)
  if (!fromUnit || !toUnit) return NaN

  // 温度使用公式
  if (category.id === 'temperature') {
    const base = fromUnit.toBase!(value)
    return toUnit.fromBase!(base)
  }

  const baseValue = value * (fromUnit.factor ?? 1)
  return baseValue / (toUnit.factor ?? 1)
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '—'
  // 保留最多 6 位有效数字，去除末尾 0
  return parseFloat(value.toPrecision(6)).toString()
}
