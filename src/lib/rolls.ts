import type {
  D6RollResult,
  D6Table,
  D6Value,
  D66RollResult,
  D66RangeTable,
  D66Table,
  KeyedEntry,
  RangedEntry,
  RolledD6TableResult,
  RolledD66RangeTableResult,
  RolledD66TableResult,
} from '../types/data'

type RandomSource = () => number

function getRandomDieValue(randomSource: RandomSource): D6Value {
  const randomValue = randomSource()

  if (!Number.isFinite(randomValue) || randomValue < 0 || randomValue >= 1) {
    throw new Error('Random source must return a finite number in the [0, 1) range.')
  }

  return (Math.floor(randomValue * 6) + 1) as D6Value
}

function getD66NumericValue(roll: D66RollResult): number {
  return Number(roll.key)
}

export function rollD6(randomSource: RandomSource = Math.random): D6RollResult {
  const value = getRandomDieValue(randomSource)

  return {
    value,
    key: String(value),
  }
}

export function rollD66(randomSource: RandomSource = Math.random): D66RollResult {
  const firstDie = getRandomDieValue(randomSource)
  const secondDie = getRandomDieValue(randomSource)

  return {
    firstDie,
    secondDie,
    key: `${firstDie}${secondDie}`,
  }
}

export function findEntryByKey<TEntry extends KeyedEntry>(
  entries: readonly TEntry[],
  key: string,
): TEntry | undefined {
  return entries.find((entry) => entry.key === key)
}

export function findEntryByRange<TEntry extends RangedEntry>(
  entries: readonly TEntry[],
  value: number,
): TEntry | undefined {
  return entries.find(
    (entry) => value >= entry.range[0] && value <= entry.range[1],
  )
}

export function rollOnD6Table<TEntry extends KeyedEntry>(
  table: D6Table & { entries: TEntry[] },
  randomSource: RandomSource = Math.random,
): RolledD6TableResult<TEntry> {
  const roll = rollD6(randomSource)
  const entry = findEntryByKey(table.entries, roll.key)

  if (!entry) {
    throw new Error(`Entry "${roll.key}" not found in d6 table "${table.id}".`)
  }

  return {
    roll,
    entry,
  }
}

export function rollOnD66Table<TEntry extends KeyedEntry>(
  table: D66Table & { entries: TEntry[] },
  randomSource: RandomSource = Math.random,
): RolledD66TableResult<TEntry> {
  const roll = rollD66(randomSource)
  const entry = findEntryByKey(table.entries, roll.key)

  if (!entry) {
    throw new Error(`Entry "${roll.key}" not found in d66 table "${table.id}".`)
  }

  return {
    roll,
    entry,
  }
}

export function rollOnD66RangeTable<TEntry extends RangedEntry>(
  table: D66RangeTable & { entries: TEntry[] },
  randomSource: RandomSource = Math.random,
): RolledD66RangeTableResult<TEntry> {
  const roll = rollD66(randomSource)
  const entry = findEntryByRange(table.entries, getD66NumericValue(roll))

  if (!entry) {
    throw new Error(`Entry "${roll.key}" not found in d66-range table "${table.id}".`)
  }

  return {
    roll,
    entry,
  }
}
