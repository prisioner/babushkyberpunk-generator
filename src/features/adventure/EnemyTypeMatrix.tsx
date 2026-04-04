import { Dice } from '../../components/Dice'
import { getD6ValueFromKey } from '../../lib/adventureTables'
import type { D6Table, EnemyTypeTable } from '../../types/data'
import { ENEMY_SUBTYPE_DICE_COLOR, ENEMY_TYPE_DICE_COLOR } from './adventurePresentation'

const d6ColumnKeys = ['1', '2', '3', '4', '5', '6'] as const

interface EnemyTypeMatrixProps {
  appearanceTable: D6Table
  typeTable: EnemyTypeTable
  getSubtypeTable: (tableId: string) => D6Table
}

function getSubtypeEntryLabel(subtypeTable: D6Table, key: string): string {
  const entry = subtypeTable.entries.find((tableEntry) => tableEntry.key === key)

  if (!entry) {
    throw new Error(
      `Subtype entry "${key}" not found in adventure table "${subtypeTable.id}".`,
    )
  }

  return entry.label
}

function getSubtypeEntries(subtypeTable: D6Table) {
  return d6ColumnKeys.map((columnKey) => ({
    key: columnKey,
    value: getD6ValueFromKey(columnKey),
    label: getSubtypeEntryLabel(subtypeTable, columnKey),
  }))
}

function getAppearanceEntryLabel(appearanceTable: D6Table, key: string): string {
  const entry = appearanceTable.entries.find((tableEntry) => tableEntry.key === key)

  if (!entry) {
    throw new Error(
      `Appearance entry "${key}" not found in adventure table "${appearanceTable.id}".`,
    )
  }

  return entry.label
}

export function EnemyTypeMatrix({
  appearanceTable,
  typeTable,
  getSubtypeTable,
}: EnemyTypeMatrixProps) {
  const typeRows = typeTable.entries.map((typeEntry) => {
    const subtypeTable = getSubtypeTable(typeEntry.subtableId)

    return {
      key: typeEntry.key,
      diceValue: getD6ValueFromKey(typeEntry.key),
      appearanceLabel: getAppearanceEntryLabel(appearanceTable, typeEntry.key),
      typeLabel: typeEntry.label,
      subtypeEntries: getSubtypeEntries(subtypeTable),
    }
  })

  return (
    <div className="adventure-enemy-matrix-wrapper">
      <div className="adventure-enemy-matrix-desktop">
        <div className="adventure-enemy-matrix">
          <div className="adventure-enemy-matrix-head" aria-hidden="true">
            <div className="adventure-enemy-matrix-heading adventure-enemy-matrix-heading--appearance">
              С виду это просто...
            </div>
            <div className="adventure-enemy-matrix-heading adventure-enemy-matrix-heading--type">
              А на самом деле...
            </div>
            <div className="adventure-enemy-matrix-heading adventure-enemy-matrix-heading--subtypes">
              Да ещё и ...
            </div>
          </div>

          <div className="adventure-enemy-matrix-body">
            {typeRows.map((row) => (
              <article key={row.key} className="adventure-enemy-matrix-row">
                <div className="adventure-enemy-matrix-col adventure-enemy-matrix-col--appearance">
                  <span className="suseki-dice-row">
                    <Dice value={row.diceValue} />
                    <span>{row.appearanceLabel}</span>
                  </span>
                </div>

                <div className="adventure-enemy-matrix-col adventure-enemy-matrix-col--type">
                  <span className="suseki-dice-row">
                    <Dice value={row.diceValue} color={ENEMY_TYPE_DICE_COLOR} />
                    <span>{row.typeLabel}</span>
                  </span>
                </div>

                <div className="adventure-enemy-matrix-col adventure-enemy-matrix-col--subtypes">
                  <div className="adventure-enemy-subtype-grid">
                    {row.subtypeEntries.map((subtypeEntry) => (
                      <div key={subtypeEntry.key} className="adventure-enemy-subtype-item">
                        <Dice
                          value={subtypeEntry.value}
                          color={ENEMY_SUBTYPE_DICE_COLOR}
                          className="adventure-enemy-subtype-dice"
                        />
                        <span>{subtypeEntry.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="adventure-enemy-matrix-mobile">
        <section className="adventure-enemy-mobile-section">
          <h3 className="adventure-enemy-mobile-title">С виду это просто...</h3>
          <div className="adventure-enemy-mobile-appearance-card">
            <div className="adventure-enemy-mobile-list">
              {appearanceTable.entries.map((entry) => (
                <div key={entry.key} className="adventure-enemy-mobile-list-item">
                  <Dice
                    value={getD6ValueFromKey(entry.key)}
                    className="adventure-enemy-mobile-dice"
                  />
                  <span>{entry.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="adventure-enemy-mobile-section">
          <h3 className="adventure-enemy-mobile-title">А на самом деле...</h3>
          <div className="adventure-enemy-mobile-cards">
            {typeRows.map((row) => (
              <article key={row.key} className="adventure-enemy-mobile-card">
                <div className="adventure-enemy-mobile-card-header">
                  <Dice
                    value={row.diceValue}
                    color={ENEMY_TYPE_DICE_COLOR}
                    className="adventure-enemy-mobile-dice"
                  />
                  <span>{row.typeLabel}</span>
                </div>

                <p className="adventure-enemy-mobile-subtitle">Да ещё и ...</p>

                <div className="adventure-enemy-subtype-grid adventure-enemy-subtype-grid--mobile">
                  {row.subtypeEntries.map((subtypeEntry) => (
                    <div key={subtypeEntry.key} className="adventure-enemy-subtype-item">
                      <Dice
                        value={subtypeEntry.value}
                        color={ENEMY_SUBTYPE_DICE_COLOR}
                        className="adventure-enemy-subtype-dice adventure-enemy-mobile-dice"
                      />
                      <span>{subtypeEntry.label}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
