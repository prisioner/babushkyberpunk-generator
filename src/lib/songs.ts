import { songsTable } from './tableData'
import type { KeyedEntry, SongsTableFile } from '../types/data'

type RandomSource = () => number

export function getSongsTable(): SongsTableFile {
  return songsTable
}

export function rollSong(
  randomSource: RandomSource = Math.random,
): KeyedEntry {
  const randomValue = randomSource()

  if (!Number.isFinite(randomValue) || randomValue < 0 || randomValue >= 1) {
    throw new Error('Random source must return a finite number in the [0, 1) range.')
  }

  const rolledKey = String(Math.floor(randomValue * 6) + 1)
  const entry = songsTable.entries.find((item) => item.key === rolledKey)

  if (!entry) {
    throw new Error(`Song entry with key "${rolledKey}" not found.`)
  }

  return entry
}
