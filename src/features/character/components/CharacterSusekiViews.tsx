import type { ReactNode } from 'react'
import { Dice } from '../../../components/Dice'
import { HighlightedText } from '../../../components/HighlightedText'
import {
  getFlawTable,
  getHairColorTable,
  getNamePatronymicRows,
  getPastTable,
  getSignatureMoveTable,
  getVeshchTable,
  type CharacterFullNameTabRoll,
  type CharacterHairColorTabRoll,
  type CharacterRangeTabRoll,
  type CharacterSusekiRollResult,
  type CharacterSusekiRollState,
  type CharacterSusekiTabId,
} from '../../../lib/characterTables'
import type { D6Value, RangedEntry } from '../../../types/data'
import { CharacterEntryText, getHairColorImagePath } from '../characterPresentation'

export const characterSusekiTabs: Array<{
  id: CharacterSusekiTabId
  label: string
}> = [
  { id: 'hair_color', label: 'Цвет волос' },
  { id: 'full_name', label: 'Имя-Отчество' },
  { id: 'flaw', label: 'Недостаток' },
  { id: 'past', label: 'Прошлое' },
  { id: 'signature_move', label: 'Коронный номер' },
  { id: 'veshch', label: 'Вещчь' },
]

const hairColorTable = getHairColorTable()
const namePatronymicRows = getNamePatronymicRows()
const flawTable = getFlawTable()
const pastTable = getPastTable()
const signatureMoveTable = getSignatureMoveTable()
const veshchTable = getVeshchTable()

function getTabLabel(tabId: CharacterSusekiTabId): string {
  return characterSusekiTabs.find((tab) => tab.id === tabId)?.label ?? tabId
}

function getD6ValueFromKey(key: string): D6Value {
  const value = Number(key)

  if (!Number.isInteger(value) || value < 1 || value > 6) {
    throw new Error(`Character d6 key "${key}" is invalid.`)
  }

  return value as D6Value
}

function getRangeLabel(entry: RangedEntry): string {
  return `${entry.range[0]}-${entry.range[1]}`
}

function getRollResultForTab<TTabId extends CharacterSusekiTabId>(
  rollResults: CharacterSusekiRollState,
  tabId: TTabId,
): Extract<CharacterSusekiRollResult, { tabId: TTabId }> | undefined {
  const rollResult = rollResults[tabId]

  if (!rollResult || rollResult.tabId !== tabId) {
    return undefined
  }

  return rollResult as Extract<CharacterSusekiRollResult, { tabId: TTabId }>
}

function DicePair({
  first,
  second,
  firstColor,
  secondColor,
}: {
  first: D6Value
  second: D6Value
  firstColor?: string
  secondColor?: string
}) {
  return (
    <span className="suseki-dice-pair">
      <Dice value={first} color={firstColor} />
      <Dice value={second} color={secondColor} />
    </span>
  )
}

function CharacterAxisLine({
  left,
  right,
  className = '',
}: {
  left: ReactNode
  right: ReactNode
  className?: string
}) {
  const classes = ['character-suseki-axis-line', className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <div className="character-suseki-axis-left">{left}</div>
      <div className="character-suseki-axis-right">{right}</div>
    </div>
  )
}

function HairColorResult({ rollResult }: { rollResult: CharacterHairColorTabRoll }) {
  return (
    <div className="suseki-roll-result character-suseki-hair-result">
      <div className="character-suseki-hair-composition">
        <div className="character-suseki-hair-photo-frame">
          <img
            className="suseki-hair-photo"
            src={getHairColorImagePath(rollResult.result.roll.value)}
            alt={rollResult.result.entry.label}
          />
        </div>

        <div className="character-suseki-hair-line">
          <Dice value={rollResult.result.roll.value} color={rollResult.result.entry.color} />
          <span>{rollResult.result.entry.label}</span>
        </div>
      </div>
    </div>
  )
}

function FullNameResult({ rollResult }: { rollResult: CharacterFullNameTabRoll }) {
  return (
    <div className="suseki-roll-result">
      <CharacterAxisLine
        left={<Dice value={rollResult.firstName.roll.value} />}
        right={<Dice value={rollResult.patronymic.roll.value} color="#f57d21" />}
      />

      <CharacterAxisLine
        left={<span>{rollResult.firstName.entry.label}</span>}
        right={<span>{rollResult.patronymic.entry.label}</span>}
      />
    </div>
  )
}

function FlawResult({
  rollResult,
}: {
  rollResult: Extract<CharacterSusekiRollResult, { tabId: 'flaw' }>
}) {
  return (
    <div className="suseki-roll-result">
      <div className="character-suseki-flaw-composition">
        <div className="character-suseki-flaw-line">
          <Dice value={rollResult.result.roll.value} />
          <span className="character-suseki-entry-copy">
            <CharacterEntryText entry={rollResult.result.entry} />
          </span>
        </div>
      </div>
    </div>
  )
}

function RangeResult({ rollResult }: { rollResult: CharacterRangeTabRoll }) {
  return (
    <div className="suseki-roll-result">
      <p className="suseki-result-line">
        <span className="suseki-dice-row">
          <DicePair
            first={rollResult.result.roll.firstDie}
            second={rollResult.result.roll.secondDie}
          />
          <strong>{rollResult.result.entry.label}</strong>
        </span>
      </p>

      {rollResult.result.entry.description ? (
        <p className="suseki-result-description">
          <HighlightedText
            text={rollResult.result.entry.description}
            highlights={rollResult.result.entry.highlights}
          />
        </p>
      ) : null}
    </div>
  )
}

function HairColorTableView() {
  return (
    <div className="suseki-table-list">
      <div className="character-suseki-hair-composition">
        <div className="character-suseki-group-card character-suseki-group-card--flat">
          {hairColorTable.entries.map((entry) => (
            <div key={entry.key} className="character-suseki-group-row">
              <div className="character-suseki-hair-line">
                <Dice value={getD6ValueFromKey(entry.key)} color={entry.color} />
                <span>{entry.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function NamePatronymicTableView() {
  return (
    <div className="suseki-table-list">
      <div className="character-suseki-group-card character-suseki-group-card--flat">
        <div className="character-suseki-group-row">
          <CharacterAxisLine left={<strong>Имя</strong>} right={<strong>Отчество</strong>} />
        </div>

        {namePatronymicRows.map((row) => (
          <div key={row.key} className="character-suseki-group-row">
            <CharacterAxisLine
              left={
                <span className="character-suseki-name-side character-suseki-name-side--left">
                  <span>{row.firstName.label}</span>
                  <Dice value={getD6ValueFromKey(row.firstName.key)} />
                </span>
              }
              right={
                <span className="character-suseki-name-side character-suseki-name-side--right">
                  <Dice value={getD6ValueFromKey(row.patronymic.key)} color="#f57d21" />
                  <span>{row.patronymic.label}</span>
                </span>
              }
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function FlawTableView() {
  return (
    <div className="suseki-table-list">
      <div className="character-suseki-flaw-composition">
        <div className="character-suseki-group-card character-suseki-group-card--flat">
          {flawTable.entries.map((entry) => (
            <div key={entry.key} className="character-suseki-group-row">
              <div className="character-suseki-flaw-line">
                <Dice value={getD6ValueFromKey(entry.key)} />
                <span className="character-suseki-entry-copy">
                  <CharacterEntryText entry={entry} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RangeTableView({ entries }: { entries: RangedEntry[] }) {
  return (
    <div className="suseki-table-list">
      {entries.map((entry) => (
        <div key={getRangeLabel(entry)} className="suseki-table-row suseki-table-row--stacked">
          <p className="suseki-result-line">
            <strong>{getRangeLabel(entry)}</strong>. <strong>{entry.label}</strong>
          </p>

          {entry.description ? (
            <p className="suseki-result-description">
              <HighlightedText text={entry.description} highlights={entry.highlights} />
            </p>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function CharacterSusekiRollView({
  activeTab,
  rollResults,
  onRoll,
}: {
  activeTab: CharacterSusekiTabId
  rollResults: CharacterSusekiRollState
  onRoll: () => void
}) {
  const tabLabel = getTabLabel(activeTab)
  const hairColorRoll = getRollResultForTab(rollResults, 'hair_color')
  const fullNameRoll = getRollResultForTab(rollResults, 'full_name')
  const flawRoll = getRollResultForTab(rollResults, 'flaw')
  const pastRoll = getRollResultForTab(rollResults, 'past')
  const signatureMoveRoll = getRollResultForTab(rollResults, 'signature_move')
  const veshchRoll = getRollResultForTab(rollResults, 'veshch')

  return (
    <div className="suseki-roll-sticky">
      <div className="suseki-roll-toolbar">
        <button type="button" className="suseki-roll-button" onClick={onRoll}>
          Наскрести <span aria-hidden="true">↻</span>
        </button>
      </div>

      <div className="suseki-roll-card">
        <div className="suseki-roll-card-header character-suseki-roll-card-header--centered">
          <h3 className="suseki-roll-title">{tabLabel}</h3>
        </div>

        {activeTab === 'hair_color' ? (
          hairColorRoll ? (
            <HairColorResult rollResult={hairColorRoll} />
          ) : (
            <p className="suseki-roll-empty">Нажми «Наскрести», чтобы вытянуть цвет волос.</p>
          )
        ) : null}

        {activeTab === 'full_name' ? (
          fullNameRoll ? (
            <FullNameResult rollResult={fullNameRoll} />
          ) : (
            <p className="suseki-roll-empty">Нажми «Наскрести», чтобы вытянуть имя и отчество.</p>
          )
        ) : null}

        {activeTab === 'flaw' ? (
          flawRoll ? (
            <FlawResult rollResult={flawRoll} />
          ) : (
            <p className="suseki-roll-empty">Нажми «Наскрести», чтобы вытянуть недостаток.</p>
          )
        ) : null}

        {activeTab === 'past' ? (
          pastRoll ? (
            <RangeResult rollResult={pastRoll} />
          ) : (
            <p className="suseki-roll-empty">Нажми «Наскрести», чтобы вытянуть прошлое.</p>
          )
        ) : null}

        {activeTab === 'signature_move' ? (
          signatureMoveRoll ? (
            <RangeResult rollResult={signatureMoveRoll} />
          ) : (
            <p className="suseki-roll-empty">Нажми «Наскрести», чтобы вытянуть коронный номер.</p>
          )
        ) : null}

        {activeTab === 'veshch' ? (
          veshchRoll ? (
            <RangeResult rollResult={veshchRoll} />
          ) : (
            <p className="suseki-roll-empty">Нажми «Наскрести», чтобы вытянуть вещчь.</p>
          )
        ) : null}
      </div>
    </div>
  )
}

export function CharacterSusekiTableView({
  activeTab,
}: {
  activeTab: CharacterSusekiTabId
}) {
  switch (activeTab) {
    case 'hair_color':
      return <HairColorTableView />
    case 'full_name':
      return <NamePatronymicTableView />
    case 'flaw':
      return <FlawTableView />
    case 'past':
      return <RangeTableView entries={pastTable.entries} />
    case 'signature_move':
      return <RangeTableView entries={signatureMoveTable.entries} />
    case 'veshch':
      return <RangeTableView entries={veshchTable.entries} />
  }
}
