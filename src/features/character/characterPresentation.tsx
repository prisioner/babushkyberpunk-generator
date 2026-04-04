import { HighlightedText } from '../../components/HighlightedText'
import type { BaseEntry } from '../../types/data'

function hasTerminalPunctuation(text: string): boolean {
  return /[.?!]$/.test(text.trim())
}

function formatEntryLead(label: string, hasDescription: boolean): string {
  if (!hasDescription) {
    return label
  }

  return hasTerminalPunctuation(label) ? label : `${label}.`
}

export function getHairColorImagePath(value: number): string {
  return `${import.meta.env.BASE_URL}assets/hair-colors/${value}.png`
}

export function CharacterEntryText({ entry }: { entry?: BaseEntry }) {
  if (!entry) {
    return '\u00A0'
  }

  const description = entry.description?.trim()
  const hasDescription = Boolean(description)
  const lead = formatEntryLead(entry.label, hasDescription)

  return (
    <span className="character-sheet-entry-text">
      <strong>{lead}</strong>
      {description ? (
        <>
          {' '}
          <HighlightedText text={description} highlights={entry.highlights} />
        </>
      ) : null}
    </span>
  )
}
