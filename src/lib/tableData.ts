import adventureTablesJson from '../data/adventure/tables.json'
import characterTablesJson from '../data/character/tables.json'
import songsJson from '../data/shared/songs.json'
import type {
  AdventureTablesFile,
  CharacterTablesFile,
  SongsTableFile,
} from '../types/data'

export const characterTables = characterTablesJson as CharacterTablesFile
export const adventureTables = adventureTablesJson as AdventureTablesFile
export const songsTable = songsJson as SongsTableFile
