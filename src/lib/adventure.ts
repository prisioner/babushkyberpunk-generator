import adventureSchemaJson from '../data/adventure/schema.json'
import adventureTablesJson from '../data/adventure/tables.json'
import type {
  AdventureEnemiesBlueprint,
  AdventureHookConfig,
  AdventureSchemaFile,
  AdventureSceneBlueprint,
  AdventureTable,
  AdventureTablesFile,
  D6Table,
  D66Table,
  GeneratedAdventure,
  EnemyTypeTable,
  GeneratedEnemies,
  GeneratedScene,
  KeyedEntry,
  SubtableLinkedEntry,
} from '../types/data'
import { rollOnD6Table, rollOnD66Table } from './rolls'

type RandomSource = () => number
export type AdventureSceneRerollTarget =
  | 'scene'
  | 'location'
  | 'technology'
  | 'enemies'

const adventureSchema = adventureSchemaJson as AdventureSchemaFile
const adventureTables = adventureTablesJson as AdventureTablesFile

function isSubtableLinkedEntry(entry: KeyedEntry): entry is SubtableLinkedEntry {
  return 'subtableId' in entry
}

function isEnemyTypeTable(table: AdventureTable): table is EnemyTypeTable {
  return table.roll === 'd6' && table.entries.every(isSubtableLinkedEntry)
}

function getEnemiesBlueprint(): AdventureEnemiesBlueprint {
  return adventureSchema.sceneBlueprint.enemies
}

function getHookConfig(): AdventureHookConfig {
  return adventureSchema.hook
}

function getSceneBlueprint(): AdventureSceneBlueprint {
  return adventureSchema.sceneBlueprint
}

function getSceneCount(): number {
  if (!Number.isInteger(adventureSchema.sceneCount) || adventureSchema.sceneCount < 1) {
    throw new Error('Adventure scene count must be a positive integer.')
  }

  return adventureSchema.sceneCount
}

export function getAdventureTableById(tableId: string): AdventureTable {
  const table = adventureTables.tables.find((entry) => entry.id === tableId)

  if (!table) {
    throw new Error(`Adventure table "${tableId}" not found.`)
  }

  return table
}

function generateHookRoll(randomSource: RandomSource = Math.random) {
  const hookConfig = getHookConfig()

  return rollOnD66Table(
    getD66AdventureTableById(hookConfig.tableId),
    randomSource,
  )
}

function generateSceneLocation(randomSource: RandomSource = Math.random) {
  const sceneBlueprint = getSceneBlueprint()

  return rollOnD66Table(
    getD66AdventureTableById(sceneBlueprint.location.tableId),
    randomSource,
  )
}

function generateSceneTechnology(randomSource: RandomSource = Math.random) {
  const sceneBlueprint = getSceneBlueprint()

  return rollOnD66Table(
    getD66AdventureTableById(sceneBlueprint.technology.tableId),
    randomSource,
  )
}

function getD6AdventureTableById(tableId: string): D6Table {
  const table = getAdventureTableById(tableId)

  if (table.roll !== 'd6') {
    throw new Error(`Adventure table "${tableId}" is not a d6 table.`)
  }

  return table
}

function getD66AdventureTableById(tableId: string): D66Table {
  const table = getAdventureTableById(tableId)

  if (table.roll !== 'd66') {
    throw new Error(`Adventure table "${tableId}" is not a d66 table.`)
  }

  return table
}

function getEnemyTypeTable(tableId: string): EnemyTypeTable {
  const table = getAdventureTableById(tableId)

  if (!isEnemyTypeTable(table)) {
    throw new Error(`Adventure table "${tableId}" is not a valid enemy type table.`)
  }

  return table
}

export function generateEnemies(
  randomSource: RandomSource = Math.random,
): GeneratedEnemies {
  const enemiesBlueprint = getEnemiesBlueprint()
  const appearance = rollOnD6Table(
    getD6AdventureTableById(enemiesBlueprint.appearanceTableId),
    randomSource,
  )
  const type = rollOnD6Table<SubtableLinkedEntry>(
    getEnemyTypeTable(enemiesBlueprint.typeTableId),
    randomSource,
  )
  const subtype = rollOnD6Table(
    getD6AdventureTableById(type.entry.subtableId),
    randomSource,
  )

  return {
    appearance,
    type,
    subtype,
  }
}

export function generateScene(
  randomSource: RandomSource = Math.random,
): GeneratedScene {
  return {
    location: generateSceneLocation(randomSource),
    technology: generateSceneTechnology(randomSource),
    enemies: generateEnemies(randomSource),
  }
}

export function generateAdventure(
  randomSource: RandomSource = Math.random,
): GeneratedAdventure {
  return {
    hook: generateHookRoll(randomSource),
    scenes: Array.from({ length: getSceneCount() }, () => generateScene(randomSource)),
  }
}

function replaceScene(
  adventure: GeneratedAdventure,
  sceneIndex: number,
  nextScene: GeneratedScene,
): GeneratedAdventure {
  if (!Number.isInteger(sceneIndex) || sceneIndex < 0 || sceneIndex >= adventure.scenes.length) {
    throw new Error(`Adventure scene index "${sceneIndex}" is out of bounds.`)
  }

  return {
    ...adventure,
    scenes: adventure.scenes.map((scene, index) =>
      index === sceneIndex ? nextScene : scene,
    ),
  }
}

export function rerollAdventureHook(
  adventure: GeneratedAdventure,
  randomSource: RandomSource = Math.random,
): GeneratedAdventure {
  return {
    ...adventure,
    hook: generateHookRoll(randomSource),
  }
}

export function rerollAdventureScene(
  adventure: GeneratedAdventure,
  sceneIndex: number,
  target: AdventureSceneRerollTarget,
  randomSource: RandomSource = Math.random,
): GeneratedAdventure {
  const currentScene = adventure.scenes[sceneIndex]

  if (!currentScene) {
    throw new Error(`Adventure scene index "${sceneIndex}" is out of bounds.`)
  }

  switch (target) {
    case 'scene':
      return replaceScene(adventure, sceneIndex, generateScene(randomSource))
    case 'location':
      return replaceScene(adventure, sceneIndex, {
        ...currentScene,
        location: generateSceneLocation(randomSource),
      })
    case 'technology':
      return replaceScene(adventure, sceneIndex, {
        ...currentScene,
        technology: generateSceneTechnology(randomSource),
      })
    case 'enemies':
      return replaceScene(adventure, sceneIndex, {
        ...currentScene,
        enemies: generateEnemies(randomSource),
      })
  }
}
