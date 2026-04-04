import { rollOnD6Table, rollOnD66RangeTable } from './rolls'
import { characterTables } from './tableData'
import type {
  D6Table,
  D66RangeTable,
  HairColorEntry,
  HairColorTable,
  KeyedEntry,
  RolledD6TableResult,
  RolledD66RangeTableResult,
  RollTable,
} from '../types/data'

type RandomSource = () => number

export type CharacterSusekiTabId =
  | 'hair_color'
  | 'full_name'
  | 'flaw'
  | 'past'
  | 'signature_move'
  | 'veshch'

export interface CharacterHairColorTabRoll {
  tabId: 'hair_color'
  result: RolledD6TableResult<HairColorEntry>
}

export interface CharacterFullNameTabRoll {
  tabId: 'full_name'
  firstName: RolledD6TableResult
  patronymic: RolledD6TableResult
  fullName: string
}

export interface CharacterFlawTabRoll {
  tabId: 'flaw'
  result: RolledD6TableResult
}

export interface CharacterRangeTabRoll {
  tabId: 'past' | 'signature_move' | 'veshch'
  result: RolledD66RangeTableResult
}

export type CharacterSusekiRollResult =
  | CharacterHairColorTabRoll
  | CharacterFullNameTabRoll
  | CharacterFlawTabRoll
  | CharacterRangeTabRoll

export type CharacterSusekiRollState = Partial<
  Record<CharacterSusekiTabId, CharacterSusekiRollResult>
>

export interface NamePatronymicRow {
  key: string
  firstName: KeyedEntry
  patronymic: KeyedEntry
}

const characterTableById = new Map(
  characterTables.tables.map((table) => [table.id, table] satisfies [string, RollTable]),
)

function getCharacterTable(tableId: string): RollTable {
  const table = characterTableById.get(tableId)

  if (!table) {
    throw new Error(`Character table "${tableId}" not found.`)
  }

  return table
}

function isHairColorEntry(entry: KeyedEntry): entry is HairColorEntry {
  return 'color' in entry
}

function isHairColorTable(table: RollTable): table is HairColorTable {
  return table.id === 'hair_color' && table.roll === 'd6' && table.entries.every(isHairColorEntry)
}

function getD6CharacterTable(tableId: string): D6Table {
  const table = getCharacterTable(tableId)

  if (table.roll !== 'd6') {
    throw new Error(`Character table "${tableId}" is not a d6 table.`)
  }

  return table
}

function getD66RangeCharacterTable(tableId: string): D66RangeTable {
  const table = getCharacterTable(tableId)

  if (table.roll !== 'd66-range') {
    throw new Error(`Character table "${tableId}" is not a d66-range table.`)
  }

  return table
}

export function getHairColorTable(): HairColorTable {
  const table = getCharacterTable('hair_color')

  if (!isHairColorTable(table)) {
    throw new Error('Character hair color table not found.')
  }

  return table
}

export function getFirstNameTable(): D6Table {
  return getD6CharacterTable('first_name')
}

export function getPatronymicTable(): D6Table {
  return getD6CharacterTable('patronymic')
}

export function getFlawTable(): D6Table {
  return getD6CharacterTable('flaw')
}

export function getPastTable(): D66RangeTable {
  return getD66RangeCharacterTable('past')
}

export function getSignatureMoveTable(): D66RangeTable {
  return getD66RangeCharacterTable('signature_move')
}

export function getVeshchTable(): D66RangeTable {
  return getD66RangeCharacterTable('veshch')
}

export function getNamePatronymicRows(): NamePatronymicRow[] {
  const firstNameTable = getFirstNameTable()
  const patronymicByKey = new Map(
    getPatronymicTable().entries.map((entry) => [entry.key, entry] satisfies [string, KeyedEntry]),
  )

  return firstNameTable.entries.map((firstName) => {
    const patronymic = patronymicByKey.get(firstName.key)

    if (!patronymic) {
      throw new Error(`Character patronymic entry "${firstName.key}" not found.`)
    }

    return {
      key: firstName.key,
      firstName,
      patronymic,
    }
  })
}

function rollHairColor(randomSource: RandomSource): CharacterHairColorTabRoll {
  return {
    tabId: 'hair_color',
    result: rollOnD6Table(getHairColorTable(), randomSource),
  }
}

function rollFullName(randomSource: RandomSource): CharacterFullNameTabRoll {
  const firstName = rollOnD6Table(getFirstNameTable(), randomSource)
  const patronymic = rollOnD6Table(getPatronymicTable(), randomSource)

  return {
    tabId: 'full_name',
    firstName,
    patronymic,
    fullName: `${firstName.entry.label} ${patronymic.entry.label}`,
  }
}

function rollFlaw(randomSource: RandomSource): CharacterFlawTabRoll {
  return {
    tabId: 'flaw',
    result: rollOnD6Table(getFlawTable(), randomSource),
  }
}

function rollRangeTable(
  tabId: CharacterRangeTabRoll['tabId'],
  randomSource: RandomSource,
): CharacterRangeTabRoll {
  switch (tabId) {
    case 'past':
      return {
        tabId,
        result: rollOnD66RangeTable(getPastTable(), randomSource),
      }
    case 'signature_move':
      return {
        tabId,
        result: rollOnD66RangeTable(getSignatureMoveTable(), randomSource),
      }
    case 'veshch':
      return {
        tabId,
        result: rollOnD66RangeTable(getVeshchTable(), randomSource),
      }
  }
}

export function rollCharacterSusekiTab(
  tabId: CharacterSusekiTabId,
  randomSource: RandomSource = Math.random,
): CharacterSusekiRollResult {
  switch (tabId) {
    case 'hair_color':
      return rollHairColor(randomSource)
    case 'full_name':
      return rollFullName(randomSource)
    case 'flaw':
      return rollFlaw(randomSource)
    case 'past':
    case 'signature_move':
    case 'veshch':
      return rollRangeTable(tabId, randomSource)
  }
}
