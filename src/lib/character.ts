import characterSchemaJson from '../data/character/schema.json'
import characterTablesJson from '../data/character/tables.json'
import { rollOnD6Table, rollOnD66RangeTable } from './rolls'
import type {
  CharacterSchemaFile,
  CharacterTablesFile,
  ComputedCharacterField,
  D6Table,
  D66RangeTable,
  DerivedCharacterField,
  GeneratedCharacter,
  GeneratedCharacterStats,
  ManualDistributionCharacterField,
  ManualDistributionRules,
  RolledCharacterField,
  RollTable,
  StatId,
} from '../types/data'

type RandomSource = () => number
export type CharacterRerollTarget =
  | 'hair_color'
  | 'full_name'
  | 'flaw'
  | 'past'
  | 'signature_move'
  | 'veshch'
  | 'stats'

const characterSchema = characterSchemaJson as CharacterSchemaFile
const characterTables = characterTablesJson as CharacterTablesFile

function getComputedField(fieldId: string): ComputedCharacterField {
  const field = characterSchema.resultFields.find(
    (entry): entry is ComputedCharacterField =>
      entry.id === fieldId && entry.type === 'computed',
  )

  if (!field) {
    throw new Error(`Computed character field "${fieldId}" not found in schema.`)
  }

  return field
}

function getDerivedField(fieldId: string): DerivedCharacterField {
  const field = characterSchema.resultFields.find(
    (entry): entry is DerivedCharacterField =>
      entry.id === fieldId && entry.type === 'derived',
  )

  if (!field) {
    throw new Error(`Derived character field "${fieldId}" not found in schema.`)
  }

  return field
}

function getRolledField(fieldId: string): RolledCharacterField {
  const field = characterSchema.resultFields.find(
    (entry): entry is RolledCharacterField =>
      entry.id === fieldId && entry.type === 'rolled',
  )

  if (!field) {
    throw new Error(`Rolled character field "${fieldId}" not found in schema.`)
  }

  return field
}

function getStatsField(): ManualDistributionCharacterField {
  const field = characterSchema.resultFields.find(
    (entry): entry is ManualDistributionCharacterField =>
      entry.id === 'stats' && entry.type === 'manual-distribution',
  )

  if (!field) {
    throw new Error('Character stats field not found in schema.')
  }

  return field
}

function getCharacterTable(tableId: string): RollTable {
  const table = characterTables.tables.find((entry) => entry.id === tableId)

  if (!table) {
    throw new Error(`Character table "${tableId}" not found.`)
  }

  return table
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

function validateStatsRules(rules: ManualDistributionRules): void {
  const minimumTotal = rules.minPerStat * rules.stats.length
  const maximumTotal = rules.maxPerStat * rules.stats.length

  if (rules.stats.length === 0) {
    throw new Error('Stats rules must contain at least one stat.')
  }

  if (new Set(rules.stats).size !== rules.stats.length) {
    throw new Error('Stats rules contain duplicate stat ids.')
  }

  if (rules.minPerStat < 0 || rules.maxPerStat < rules.minPerStat) {
    throw new Error('Stats rules contain invalid min/max values.')
  }

  if (rules.totalPoints < minimumTotal || rules.totalPoints > maximumTotal) {
    throw new Error('Stats rules total points are out of bounds.')
  }
}

function createEmptyStats(): GeneratedCharacterStats {
  return {
    hardening: 0,
    wits: 0,
    computers: 0,
    authority: 0,
  }
}

function pickRandomStat(
  statIds: readonly StatId[],
  randomSource: RandomSource,
): StatId {
  const randomValue = randomSource()

  if (!Number.isFinite(randomValue) || randomValue < 0 || randomValue >= 1) {
    throw new Error('Random source must return a finite number in the [0, 1) range.')
  }

  const index = Math.floor(randomValue * statIds.length)

  return statIds[index] as StatId
}

export function generateCharacterStats(
  rules: ManualDistributionRules = getStatsField().rules,
  randomSource: RandomSource = Math.random,
): GeneratedCharacterStats {
  validateStatsRules(rules)

  const stats = createEmptyStats()

  for (const statId of rules.stats) {
    stats[statId] = rules.minPerStat
  }

  let remainingPoints = rules.totalPoints - rules.minPerStat * rules.stats.length

  while (remainingPoints > 0) {
    const availableStatIds = rules.stats.filter(
      (statId) => stats[statId] < rules.maxPerStat,
    )

    if (availableStatIds.length === 0) {
      throw new Error('No available stats left to receive remaining points.')
    }

    const statId = pickRandomStat(availableStatIds, randomSource)

    stats[statId] += 1
    remainingPoints -= 1
  }

  return stats
}

export function generateCharacter(
  randomSource: RandomSource = Math.random,
): GeneratedCharacter {
  const fullNameField = getComputedField('full_name')
  const portraitField = getDerivedField('portrait')
  const flawField = getRolledField('flaw')
  const pastField = getRolledField('past')
  const signatureMoveField = getRolledField('signature_move')
  const veshchField = getRolledField('veshch')

  if (fullNameField.computedFrom.length !== 2) {
    throw new Error('Full name field must depend on first name and patronymic.')
  }

  if (portraitField.derivedFrom.length !== 1) {
    throw new Error('Portrait field must depend on exactly one source field.')
  }

  const firstName = rollOnD6Table(
    getD6CharacterTable(fullNameField.computedFrom[0]),
    randomSource,
  )
  const patronymic = rollOnD6Table(
    getD6CharacterTable(fullNameField.computedFrom[1]),
    randomSource,
  )
  const hairColor = rollOnD6Table(
    getD6CharacterTable(portraitField.derivedFrom[0]),
    randomSource,
  )

  return {
    hairColor,
    name: {
      fullName: `${firstName.entry.label} ${patronymic.entry.label}`,
      firstName,
      patronymic,
    },
    flaw: rollOnD6Table(getD6CharacterTable(flawField.tableId), randomSource),
    past: rollOnD66RangeTable(
      getD66RangeCharacterTable(pastField.tableId),
      randomSource,
    ),
    signatureMove: rollOnD66RangeTable(
      getD66RangeCharacterTable(signatureMoveField.tableId),
      randomSource,
    ),
    veshch: rollOnD66RangeTable(
      getD66RangeCharacterTable(veshchField.tableId),
      randomSource,
    ),
    stats: generateCharacterStats(getStatsField().rules, randomSource),
  }
}

export function rerollCharacterField(
  character: GeneratedCharacter,
  target: CharacterRerollTarget,
  randomSource: RandomSource = Math.random,
): GeneratedCharacter {
  switch (target) {
    case 'hair_color': {
      const portraitField = getDerivedField('portrait')

      if (portraitField.derivedFrom.length !== 1) {
        throw new Error('Portrait field must depend on exactly one source field.')
      }

      return {
        ...character,
        hairColor: rollOnD6Table(
          getD6CharacterTable(portraitField.derivedFrom[0]),
          randomSource,
        ),
      }
    }
    case 'full_name': {
      const fullNameField = getComputedField('full_name')

      if (fullNameField.computedFrom.length !== 2) {
        throw new Error('Full name field must depend on first name and patronymic.')
      }

      const firstName = rollOnD6Table(
        getD6CharacterTable(fullNameField.computedFrom[0]),
        randomSource,
      )
      const patronymic = rollOnD6Table(
        getD6CharacterTable(fullNameField.computedFrom[1]),
        randomSource,
      )

      return {
        ...character,
        name: {
          fullName: `${firstName.entry.label} ${patronymic.entry.label}`,
          firstName,
          patronymic,
        },
      }
    }
    case 'flaw': {
      const field = getRolledField('flaw')

      return {
        ...character,
        flaw: rollOnD6Table(getD6CharacterTable(field.tableId), randomSource),
      }
    }
    case 'past': {
      const field = getRolledField('past')

      return {
        ...character,
        past: rollOnD66RangeTable(
          getD66RangeCharacterTable(field.tableId),
          randomSource,
        ),
      }
    }
    case 'signature_move': {
      const field = getRolledField('signature_move')

      return {
        ...character,
        signatureMove: rollOnD66RangeTable(
          getD66RangeCharacterTable(field.tableId),
          randomSource,
        ),
      }
    }
    case 'veshch': {
      const field = getRolledField('veshch')

      return {
        ...character,
        veshch: rollOnD66RangeTable(
          getD66RangeCharacterTable(field.tableId),
          randomSource,
        ),
      }
    }
    case 'stats':
      return {
        ...character,
        stats: generateCharacterStats(getStatsField().rules, randomSource),
      }
  }
}
