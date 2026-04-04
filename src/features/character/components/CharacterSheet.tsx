import type { ReactNode } from 'react'
import characterSchemaJson from '../../../data/character/schema.json'
import type {
  CharacterSchemaFile,
  GeneratedCharacter,
  ManualDistributionCharacterField,
  StatId,
} from '../../../types/data'
import { CharacterEntryText, getHairColorImagePath } from '../characterPresentation'

const characterSchema = characterSchemaJson as CharacterSchemaFile
const statsField = characterSchema.resultFields.find(
  (field): field is ManualDistributionCharacterField =>
    field.id === 'stats' && field.type === 'manual-distribution',
)
const statOrder: StatId[] = statsField?.rules.stats ?? [
  'hardening',
  'wits',
  'computers',
  'authority',
]

const statMeta: Record<StatId, { label: string; caption: string }> = {
  hardening: {
    label: 'Закалка',
    caption: 'Сила и ловкость',
  },
  wits: {
    label: 'Смекалка',
    caption: 'Ум и находчивость',
  },
  computers: {
    label: 'Компуктеры',
    caption: 'Опыт пользования ПК',
  },
  authority: {
    label: 'Авторитет',
    caption: 'Красота и здоровье',
  },
}

const woundEntries = [
  {
    id: 'exhausted',
    title: 'Умаялась',
    description: 'Одышка, тяжёлый кашель, учащённое оханье и аханье.',
  },
  {
    id: 'back',
    title: 'Спину прихватило',
    description: 'Хромаешь, обострился радикулит, иное.',
  },
  {
    id: 'heart',
    title: 'Сердечко шалит',
    description: 'Пульс нитевидный, давление зашкаливает.',
  },
  {
    id: 'done',
    title: 'Кончилась бабка',
    description: 'Всё, капут. Бабка драматично уходит на покой.',
  },
] as const

const earnNzEntries = [
  {
    mark: '●',
    title: 'Это день такой',
    description: 'Сделай проверку худо-бедно.',
  },
  {
    mark: '●●',
    title: 'Господиисусе!',
    description: 'Добавь в сцену врагов.',
  },
  {
    mark: '●●●',
    title: 'Ступор мозговины',
    description: 'Бабка сходит с ума и всех предаёт.',
  },
] as const

const spendNzEntries = [
  {
    mark: '○',
    title: 'Накуся выкуси!',
    description: 'Исполни коронный номер.',
  },
  {
    mark: '○○',
    title: 'Валокордин',
    description: 'Вылечи 1 ранение.',
  },
  {
    mark: '○○○',
    title: 'Звучит гимн СССР',
    description: 'Бабки неуязвимы 4 минуты.',
  },
] as const

export type CharacterSheetWoundId = (typeof woundEntries)[number]['id']

export interface CharacterSheetDraft {
  wounds: Record<CharacterSheetWoundId, boolean>
}

export function createCharacterSheetDraft(): CharacterSheetDraft {
  return {
    wounds: {
      exhausted: false,
      back: false,
      heart: false,
      done: false,
    },
  }
}

interface CharacterSheetDisplayFieldProps {
  title: string
  value?: ReactNode
  hint?: string
  multiline?: boolean
}

function CharacterSheetDisplayField({
  title,
  value,
  hint,
  multiline = false,
}: CharacterSheetDisplayFieldProps) {
  return (
    <div className="character-sheet-field">
      <div className="character-sheet-field-header">
        <strong className="character-sheet-field-title">{title}</strong>
        {hint ? <span className="character-sheet-field-hint">{hint}</span> : null}
      </div>

      <div
        className={`character-sheet-display-field${
          multiline ? ' character-sheet-display-field--multiline' : ''
        }`}
      >
        {value ?? '\u00A0'}
      </div>
    </div>
  )
}

function CharacterStatField({
  statId,
  value,
}: {
  statId: StatId
  value: string
}) {
  const meta = statMeta[statId]

  return (
    <div className="character-sheet-stat">
      <div className="character-sheet-stat-value">{value || '\u00A0'}</div>

      <span className="character-sheet-stat-copy">
        <span className="character-sheet-stat-label">{meta.label}</span>
        <span className="character-sheet-stat-caption">{meta.caption}</span>
      </span>
    </div>
  )
}

interface CharacterWoundFieldProps {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function CharacterWoundField({
  title,
  description,
  checked,
  onChange,
}: CharacterWoundFieldProps) {
  return (
    <label className="character-sheet-wound">
      <input
        className="character-sheet-wound-checkbox"
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="character-sheet-wound-title">{title}</span>
      <span className="character-sheet-wound-description">{description}</span>
    </label>
  )
}

function CharacterNzSection({
  title,
  items,
}: {
  title: string
  items: ReadonlyArray<{
    mark: string
    title: string
    description: string
  }>
}) {
  return (
    <section className="character-sheet-usage">
      <div className="character-sheet-usage-title">{title}</div>

      <div className="character-sheet-usage-body">
        {items.map((item) => (
          <div key={`${title}-${item.title}`} className="character-sheet-usage-item">
            <div className="character-sheet-usage-head">
              <span className="character-sheet-usage-mark">{item.mark}</span>
              <strong className="character-sheet-usage-item-title">{item.title}</strong>
            </div>
            <p className="character-sheet-usage-description">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

interface CharacterSheetProps {
  character: GeneratedCharacter | null
  draft: CharacterSheetDraft
  onWoundChange: (woundId: CharacterSheetWoundId, checked: boolean) => void
}

export function CharacterSheet({
  character,
  draft,
  onWoundChange,
}: CharacterSheetProps) {
  return (
    <div className="character-sheet-shell">
      <div className="character-sheet-frame">
        <div className="character-sheet-header">
          <div />

          <div className="character-sheet-header-right">
            <div />
            <div className="character-sheet-header-banner">РАНЕНИЯ</div>
          </div>
        </div>

        <div className="character-sheet-main">
          <section className="character-sheet-left">
            <div className="character-sheet-left-grid">
              <div className="character-sheet-left-banner">
                <div className="character-sheet-bkp">БКП</div>
                <div className="character-sheet-certificate">
                  <div className="character-sheet-certificate-copy">
                    <span>ПЕНСИОННОЕ</span>
                    <span>УДОСТОВЕРЕНИЕ</span>
                  </div>
                </div>
              </div>

              <div className="character-sheet-left-content">
                <div className="character-sheet-photo">
                  {character ? (
                    <img
                      src={getHairColorImagePath(character.hairColor.roll.value)}
                      alt={`Фотокарточка: ${character.hairColor.entry.label}`}
                    />
                  ) : null}

                  {!character ? (
                    <div className="character-sheet-photo-placeholder">Фотокарточка</div>
                  ) : null}
                </div>

                <div className="character-sheet-stats">
                  {statOrder.map((statId) => (
                    <CharacterStatField
                      key={statId}
                      statId={statId}
                      value={character ? String(character.stats[statId]) : ''}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="character-sheet-right">
            <div className="character-sheet-right-top">
              <div className="character-sheet-fields">
                <CharacterSheetDisplayField
                  title="Как тебя кличут?"
                  value={character?.name.fullName}
                />

                <CharacterSheetDisplayField
                  title="Прошлое"
                  hint="Используй один раз за историю."
                    value={
                      character ? (
                        <CharacterEntryText entry={character.past.entry} />
                      ) : undefined
                    }
                    multiline
                />

                <CharacterSheetDisplayField
                  title="Коронный номер"
                  hint="Потрать 1 пункт НЗ, чтобы исполнить."
                    value={
                      character ? (
                        <CharacterEntryText entry={character.signatureMove.entry} />
                      ) : undefined
                    }
                    multiline
                />

                <CharacterSheetDisplayField
                  title="Вещчь"
                    value={
                      character ? (
                        <CharacterEntryText entry={character.veshch.entry} />
                      ) : undefined
                    }
                    multiline
                />

                <CharacterSheetDisplayField
                  title="Прочее"
                      value={
                        character ? (
                        <div className="character-sheet-entry-stack">
                          <CharacterEntryText entry={character.flaw.entry} />
                          <div className="character-sheet-entry-line">
                            <strong>Цвет волос:</strong> <span>{character.hairColor.entry.label}</span>
                          </div>
                        </div>
                    ) : undefined
                  }
                  multiline
                />
              </div>

              <div className="character-sheet-wounds">
                {woundEntries.map((wound) => (
                  <CharacterWoundField
                    key={wound.id}
                    title={wound.title}
                    description={wound.description}
                    checked={draft.wounds[wound.id]}
                    onChange={(checked) => onWoundChange(wound.id, checked)}
                  />
                ))}
              </div>
            </div>

            <div className="character-sheet-right-bottom">
              <CharacterNzSection title="ЗАРАБОТАТЬ НЗ" items={earnNzEntries} />
              <CharacterNzSection title="ПОТРАТИТЬ НЗ" items={spendNzEntries} />
            </div>
          </section>
        </div>

        <div className="character-sheet-footer">
          <div />
          <div className="character-sheet-footer-copy">+1 НЗ за подходящую частушку</div>
        </div>
      </div>
    </div>
  )
}
