import type { ReactNode } from 'react'
import type { Highlight } from '../types/data'

interface HighlightedTextProps {
  text: string
  highlights?: Highlight[]
  className?: string
}

interface HighlightMatch {
  highlight: Highlight
  index: number
  start: number
}

function getHighlightClassName(highlight: Highlight): string {
  const classNames = ['highlight']

  switch (highlight.kind) {
    case 'stat':
      classNames.push('highlight--stat')

      if (highlight.statId) {
        classNames.push(`highlight--stat-${highlight.statId}`)
      }
      break
    case 'advantage':
      classNames.push('highlight--advantage')
      break
    case 'disadvantage':
      classNames.push('highlight--disadvantage')
      break
    case 'crit_success':
      classNames.push('highlight--crit-success')
      break
    case 'crit_fail':
      classNames.push('highlight--crit-fail')
      break
    case 'gm_move':
      classNames.push('highlight--gm-move')
      break
  }

  return classNames.join(' ')
}

function getHighlightDisplayText(highlight: Highlight): string {
  return highlight.text
}

function findNextHighlightMatch(
  text: string,
  highlights: readonly Highlight[],
  usedIndexes: Set<number>,
  searchFrom: number,
): HighlightMatch | null {
  let nextMatch: HighlightMatch | null = null

  highlights.forEach((highlight, index) => {
    if (usedIndexes.has(index)) {
      return
    }

    const start = text.indexOf(highlight.text, searchFrom)

    if (start === -1) {
      return
    }

    if (!nextMatch || start < nextMatch.start) {
      nextMatch = {
        highlight,
        index,
        start,
      }
    }
  })

  return nextMatch
}

function renderHighlightedParts(
  text: string,
  highlights: readonly Highlight[],
): ReactNode[] {
  const parts: ReactNode[] = []
  const usedIndexes = new Set<number>()
  let cursor = 0
  let partIndex = 0

  while (cursor < text.length) {
    const nextMatch = findNextHighlightMatch(text, highlights, usedIndexes, cursor)

    if (!nextMatch) {
      parts.push(text.slice(cursor))
      break
    }

    if (nextMatch.start > cursor) {
      parts.push(text.slice(cursor, nextMatch.start))
    }

    parts.push(
      <span
        key={`highlight-${partIndex}`}
        className={getHighlightClassName(nextMatch.highlight)}
      >
        {getHighlightDisplayText(nextMatch.highlight)}
      </span>,
    )

    usedIndexes.add(nextMatch.index)
    cursor = nextMatch.start + nextMatch.highlight.text.length
    partIndex += 1
  }

  return parts
}

export function HighlightedText({
  text,
  highlights,
  className,
}: HighlightedTextProps) {
  const content =
    highlights && highlights.length > 0
      ? renderHighlightedParts(text, highlights)
      : text

  return <span className={className}>{content}</span>
}
