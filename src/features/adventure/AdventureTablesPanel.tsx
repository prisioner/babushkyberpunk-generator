import type { Dispatch, SetStateAction } from 'react'
import {
  rollAdventureSusekiTab,
  type AdventureSusekiRollState,
  type AdventureSusekiTabId,
} from '../../lib/adventureTables'
import {
  AdventureSusekiRollView,
  AdventureSusekiTableView,
} from './components/AdventureSusekiViews'

interface AdventureTablesPanelProps {
  activeTab: AdventureSusekiTabId
  onTabChange: (tabId: AdventureSusekiTabId) => void
  rollResults: AdventureSusekiRollState
  setRollResults: Dispatch<SetStateAction<AdventureSusekiRollState>>
  isExpanded: boolean
  onExpandedChange: Dispatch<SetStateAction<boolean>>
}

export function AdventureTablesPanel({
  activeTab,
  onTabChange,
  rollResults,
  setRollResults,
  isExpanded,
  onExpandedChange,
}: AdventureTablesPanelProps) {
  function handleRoll(tabId: AdventureSusekiTabId) {
    setRollResults((currentRollResults) => ({
      ...currentRollResults,
      [tabId]: rollAdventureSusekiTab(tabId),
    }))
  }

  return (
    <section className="generator-panel suseki-panel adventure-suseki-panel">
      <div className="adventure-suseki-top">
        <button
          type="button"
          className={`suseki-toggle${isExpanded ? ' is-expanded' : ''}`}
          aria-expanded={isExpanded}
          onClick={() => onExpandedChange((currentValue) => !currentValue)}
        >
          <span className="suseki-toggle-title troika-heading">Сусеки</span>
          <span className="suseki-toggle-icon" aria-hidden="true">▾</span>
        </button>

        {isExpanded ? (
          <div className="adventure-suseki-roll-panel">
            <div className="adventure-suseki-roll-content">
              <AdventureSusekiRollView
                activeTab={activeTab}
                onTabChange={onTabChange}
                rollResults={rollResults}
                onRoll={() => handleRoll(activeTab)}
              />
            </div>
          </div>
        ) : null}
      </div>

      {isExpanded ? (
        <div className="adventure-suseki-table-panel">
          <AdventureSusekiTableView activeTab={activeTab} />
        </div>
      ) : null}
    </section>
  )
}
