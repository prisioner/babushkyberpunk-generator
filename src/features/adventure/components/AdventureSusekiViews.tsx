import { Dice } from '../../../components/Dice'
import {
  getD66RollFromKey,
  getEnemyAppearanceTable,
  getEnemySubtypeTable,
  getEnemyTypeTable,
  getHookTable,
  getSceneLocationTable,
  getSceneTechnologyTable,
  groupD66EntriesByTens,
  type AdventureEnemiesTabRoll,
  type AdventureHookTabRoll,
  type AdventureSceneFieldTabRoll,
  type AdventureSusekiRollResult,
  type AdventureSusekiRollState,
  type AdventureSusekiTabId,
} from '../../../lib/adventureTables'
import type { D66Table, KeyedEntry } from '../../../types/data'
import { EnemyTypeMatrix } from '../EnemyTypeMatrix'
import {
  AdventureD66DicePair,
  ENEMY_SUBTYPE_DICE_COLOR,
  ENEMY_TYPE_DICE_COLOR,
} from '../adventurePresentation'

export const adventureSusekiTabs: Array<{
  id: AdventureSusekiTabId
  label: string
}> = [
  { id: 'hook', label: 'Зацепка' },
  { id: 'scene_location', label: 'Место действия' },
  { id: 'scene_technology', label: 'Технология' },
  { id: 'enemies', label: 'Враги народа' },
]

const hookTable = getHookTable()
const sceneLocationTable = getSceneLocationTable()
const sceneTechnologyTable = getSceneTechnologyTable()
const enemyAppearanceTable = getEnemyAppearanceTable()
const enemyTypeTable = getEnemyTypeTable()

function getTabLabel(tabId: AdventureSusekiTabId): string {
  return adventureSusekiTabs.find((tab) => tab.id === tabId)?.label ?? tabId
}

function getRollResultForTab<TTabId extends AdventureSusekiTabId>(
  rollResults: AdventureSusekiRollState,
  tabId: TTabId,
): Extract<AdventureSusekiRollResult, { tabId: TTabId }> | undefined {
  const rollResult = rollResults[tabId]

  if (!rollResult || rollResult.tabId !== tabId) {
    return undefined
  }

  return rollResult as Extract<AdventureSusekiRollResult, { tabId: TTabId }>
}

function D66TableEntry({
  entry,
  layout = 'axis',
}: {
  entry: KeyedEntry
  layout?: 'axis' | 'stacked'
}) {
  if (layout === 'stacked') {
    return (
      <div className="adventure-suseki-hook-entry">
        <div className="adventure-suseki-hook-key">
          <AdventureD66DicePair roll={getD66RollFromKey(entry.key)} />
        </div>
        <div className="adventure-suseki-hook-label">{entry.label}</div>
      </div>
    )
  }

  return (
    <div className="adventure-suseki-table-line">
      <span className="adventure-suseki-table-line-key">
        <AdventureD66DicePair roll={getD66RollFromKey(entry.key)} />
      </span>
      <span className="adventure-suseki-table-line-label">{entry.label}</span>
    </div>
  )
}

function HookResult({ rollResult }: { rollResult: AdventureHookTabRoll }) {
  return (
    <div className="suseki-roll-result">
      <p className="suseki-result-line">
        <AdventureD66DicePair roll={rollResult.result.roll} />
      </p>
      <p className="suseki-result-description">{rollResult.result.entry.label}</p>
    </div>
  )
}

function SceneFieldResult({
  rollResult,
}: {
  rollResult: AdventureSceneFieldTabRoll
}) {
  return (
    <div className="suseki-roll-result">
      <p className="suseki-result-line adventure-suseki-axis-line">
        <span className="adventure-suseki-axis-key">
          <AdventureD66DicePair roll={rollResult.result.roll} />
        </span>
        <span className="adventure-suseki-axis-label">{rollResult.result.entry.label}</span>
      </p>
    </div>
  )
}

function EnemiesResult({ rollResult }: { rollResult: AdventureEnemiesTabRoll }) {
  return (
    <div className="suseki-roll-result">
      <p className="suseki-result-line adventure-suseki-enemy-line">
        <span className="adventure-suseki-enemy-line-label">С виду это просто</span>
        <span className="adventure-suseki-enemy-line-result">
          <span className="suseki-dice-row">
            <Dice value={rollResult.result.appearance.roll.value} />
            <strong>{rollResult.result.appearance.entry.label}</strong>
          </span>
        </span>
      </p>

      <p className="suseki-result-line adventure-suseki-enemy-line">
        <span className="adventure-suseki-enemy-line-label">А на самом деле</span>
        <span className="adventure-suseki-enemy-line-result">
          <span className="suseki-dice-row">
            <Dice value={rollResult.result.type.roll.value} color={ENEMY_TYPE_DICE_COLOR} />
            <strong>{rollResult.result.type.entry.label}</strong>
          </span>
        </span>
      </p>

      <p className="suseki-result-line adventure-suseki-enemy-line">
        <span className="adventure-suseki-enemy-line-label">Да ещё и</span>
        <span className="adventure-suseki-enemy-line-result">
          <span className="suseki-dice-row">
            <Dice value={rollResult.result.subtype.roll.value} color={ENEMY_SUBTYPE_DICE_COLOR} />
            <strong>{rollResult.result.subtype.entry.label}</strong>
          </span>
        </span>
      </p>
    </div>
  )
}

function D66TableView({
  table,
  grouped,
}: {
  table: D66Table
  grouped?: boolean
}) {
  const groups = grouped ? groupD66EntriesByTens(table.entries) : [table.entries]
  const sizeClassName = grouped
    ? 'adventure-suseki-grouped-list--scene'
    : 'adventure-suseki-grouped-list--hook'

  return (
    <div className={`adventure-suseki-grouped-list ${sizeClassName}`}>
      {groups.map((entries, index) => (
        <div
          key={`${table.id}-${entries[0]?.key ?? index}`}
          className={grouped ? 'adventure-suseki-group-card' : 'adventure-suseki-group'}
        >
          {entries.map((entry) =>
            grouped ? (
              <div key={entry.key} className="adventure-suseki-group-row">
                <D66TableEntry entry={entry} />
              </div>
            ) : (
              <div key={entry.key} className="suseki-table-row">
                <D66TableEntry entry={entry} layout="stacked" />
              </div>
            ),
          )}
        </div>
      ))}
    </div>
  )
}

function EnemiesTableView() {
  return (
    <EnemyTypeMatrix
      appearanceTable={enemyAppearanceTable}
      typeTable={enemyTypeTable}
      getSubtypeTable={getEnemySubtypeTable}
    />
  )
}

export function AdventureSusekiRollView({
  activeTab,
  onTabChange,
  rollResults,
  onRoll,
}: {
  activeTab: AdventureSusekiTabId
  onTabChange: (tabId: AdventureSusekiTabId) => void
  rollResults: AdventureSusekiRollState
  onRoll: () => void
}) {
  const tabLabel = getTabLabel(activeTab)
  const hookRoll = getRollResultForTab(rollResults, 'hook')
  const locationRoll = getRollResultForTab(rollResults, 'scene_location')
  const technologyRoll = getRollResultForTab(rollResults, 'scene_technology')
  const enemiesRoll = getRollResultForTab(rollResults, 'enemies')

  return (
    <div className="suseki-roll-sticky">
      <div className="adventure-suseki-roll-tabs" role="tablist" aria-label="Сусеки приключения">
        {adventureSusekiTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`adventure-suseki-roll-tab${activeTab === tab.id ? ' is-active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="suseki-roll-toolbar">
        <button type="button" className="suseki-roll-button" onClick={onRoll}>
          Наскрести <span aria-hidden="true">↻</span>
        </button>
      </div>

      <div className="suseki-roll-card">
        <div className="suseki-roll-card-header">
          <h3 className="suseki-roll-title">{tabLabel}</h3>
        </div>

        {activeTab === 'hook' ? (
          hookRoll ? (
            <HookResult rollResult={hookRoll} />
          ) : (
            <p className="suseki-roll-empty">Нажми «Наскрести», чтобы вытянуть зацепку.</p>
          )
        ) : null}

        {activeTab === 'scene_location' ? (
          locationRoll ? (
            <SceneFieldResult rollResult={locationRoll} />
          ) : (
            <p className="suseki-roll-empty">Нажми «Наскрести», чтобы вытянуть место действия.</p>
          )
        ) : null}

        {activeTab === 'scene_technology' ? (
          technologyRoll ? (
            <SceneFieldResult rollResult={technologyRoll} />
          ) : (
            <p className="suseki-roll-empty">Нажми «Наскрести», чтобы вытянуть технологию.</p>
          )
        ) : null}

        {activeTab === 'enemies' ? (
          enemiesRoll ? (
            <EnemiesResult rollResult={enemiesRoll} />
          ) : (
            <p className="suseki-roll-empty">Нажми «Наскрести», чтобы вытянуть врагов народа.</p>
          )
        ) : null}
      </div>
    </div>
  )
}

export function AdventureSusekiTableView({
  activeTab,
}: {
  activeTab: AdventureSusekiTabId
}) {
  switch (activeTab) {
    case 'hook':
      return <D66TableView table={hookTable} />
    case 'scene_location':
      return <D66TableView table={sceneLocationTable} grouped />
    case 'scene_technology':
      return <D66TableView table={sceneTechnologyTable} grouped />
    case 'enemies':
      return <EnemiesTableView />
  }
}
