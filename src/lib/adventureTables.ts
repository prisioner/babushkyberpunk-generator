import { generateEnemies, getAdventureTableById } from './adventure'
import { rollOnD66Table } from './rolls'
import type {
  AdventureTable,
  D66RollResult,
  D66Table,
  D6Table,
  D6Value,
  EnemyTypeTable,
  GeneratedEnemies,
  KeyedEntry,
  RolledD66TableResult,
  SubtableLinkedEntry,
} from '../types/data'

type RandomSource = () => number

export type AdventureSusekiTabId =
  | 'hook'
  | 'scene_location'
  | 'scene_technology'
  | 'enemies'

export interface AdventureHookTabRoll {
  tabId: 'hook'
  result: RolledD66TableResult
}

export interface AdventureSceneFieldTabRoll {
  tabId: 'scene_location' | 'scene_technology'
  result: RolledD66TableResult
}

export interface AdventureEnemiesTabRoll {
  tabId: 'enemies'
  result: GeneratedEnemies
}

export type AdventureSusekiRollResult =
  | AdventureHookTabRoll
  | AdventureSceneFieldTabRoll
  | AdventureEnemiesTabRoll

export type AdventureSusekiRollState = Partial<
  Record<AdventureSusekiTabId, AdventureSusekiRollResult>
>

function isSubtableLinkedEntry(entry: KeyedEntry): entry is SubtableLinkedEntry {
  return 'subtableId' in entry
}

function isEnemyTypeTable(table: AdventureTable): table is EnemyTypeTable {
  return table.id === 'enemy_type' && table.roll === 'd6' && table.entries.every(isSubtableLinkedEntry)
}

export function getD6ValueFromKey(key: string): D6Value {
  const value = Number(key)

  if (!Number.isInteger(value) || value < 1 || value > 6) {
    throw new Error(`Adventure d6 key "${key}" is invalid.`)
  }

  return value as D6Value
}

export function getD66RollFromKey(key: string): D66RollResult {
  if (!/^[1-6][1-6]$/.test(key)) {
    throw new Error(`Adventure d66 key "${key}" is invalid.`)
  }

  return {
    firstDie: getD6ValueFromKey(key[0]),
    secondDie: getD6ValueFromKey(key[1]),
    key,
  }
}

function getD66AdventureTable(tableId: string): D66Table {
  const table = getAdventureTableById(tableId)

  if (table.roll !== 'd66') {
    throw new Error(`Adventure table "${tableId}" is not a d66 table.`)
  }

  return table
}

function getD6AdventureTable(tableId: string): D6Table {
  const table = getAdventureTableById(tableId)

  if (table.roll !== 'd6') {
    throw new Error(`Adventure table "${tableId}" is not a d6 table.`)
  }

  return table
}

export function getHookTable(): D66Table {
  return getD66AdventureTable('hook')
}

export function getSceneLocationTable(): D66Table {
  return getD66AdventureTable('scene_location')
}

export function getSceneTechnologyTable(): D66Table {
  return getD66AdventureTable('scene_technology')
}

export function getEnemyAppearanceTable(): D6Table {
  return getD6AdventureTable('enemy_appearance')
}

export function getEnemyTypeTable(): EnemyTypeTable {
  const table = getAdventureTableById('enemy_type')

  if (!isEnemyTypeTable(table)) {
    throw new Error('Adventure enemy type table not found.')
  }

  return table
}

export function getEnemySubtypeTable(tableId: string): D6Table {
  return getD6AdventureTable(tableId)
}

export function groupD66EntriesByTens<TEntry extends KeyedEntry>(
  entries: TEntry[],
): TEntry[][] {
  const groups: TEntry[][] = []

  for (const entry of entries) {
    const entryTens = entry.key[0]
    const currentGroup = groups.at(-1)
    const currentGroupTens = currentGroup?.[0]?.key[0]

    if (!currentGroup || currentGroupTens !== entryTens) {
      groups.push([entry])
      continue
    }

    currentGroup.push(entry)
  }

  return groups
}

function rollHook(randomSource: RandomSource): AdventureHookTabRoll {
  return {
    tabId: 'hook',
    result: rollOnD66Table(getHookTable(), randomSource),
  }
}

function rollSceneField(
  tabId: AdventureSceneFieldTabRoll['tabId'],
  randomSource: RandomSource,
): AdventureSceneFieldTabRoll {
  if (tabId === 'scene_location') {
    return {
      tabId,
      result: rollOnD66Table(getSceneLocationTable(), randomSource),
    }
  }

  return {
    tabId,
    result: rollOnD66Table(getSceneTechnologyTable(), randomSource),
  }
}

function rollEnemies(randomSource: RandomSource): AdventureEnemiesTabRoll {
  return {
    tabId: 'enemies',
    result: generateEnemies(randomSource),
  }
}

export function rollAdventureSusekiTab(
  tabId: AdventureSusekiTabId,
  randomSource: RandomSource = Math.random,
): AdventureSusekiRollResult {
  switch (tabId) {
    case 'hook':
      return rollHook(randomSource)
    case 'scene_location':
    case 'scene_technology':
      return rollSceneField(tabId, randomSource)
    case 'enemies':
      return rollEnemies(randomSource)
  }
}
