import type { Dispatch, SetStateAction } from 'react'
import {
  rollCharacterSusekiTab,
  type CharacterSusekiRollState,
  type CharacterSusekiTabId,
} from '../../lib/characterTables'
import {
  CharacterSusekiRollView,
  CharacterSusekiTableView,
  characterSusekiTabs,
} from './components/CharacterSusekiViews'

interface CharacterTablesPanelProps {
  activeTab: CharacterSusekiTabId
  onTabChange: (tabId: CharacterSusekiTabId) => void
  rollResults: CharacterSusekiRollState
  setRollResults: Dispatch<SetStateAction<CharacterSusekiRollState>>
  isExpanded: boolean
  onExpandedChange: Dispatch<SetStateAction<boolean>>
}

export function CharacterTablesPanel({
  activeTab,
  onTabChange,
  rollResults,
  setRollResults,
  isExpanded,
  onExpandedChange,
}: CharacterTablesPanelProps) {
  function handleRoll(tabId: CharacterSusekiTabId) {
    setRollResults((currentRollResults) => ({
      ...currentRollResults,
      [tabId]: rollCharacterSusekiTab(tabId),
    }))
  }

  return (
    <section className="generator-panel suseki-panel character-suseki-panel">
      <div className="character-suseki-top">
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
          <>
            <div className="character-suseki-tabs" role="tablist" aria-label="Сусеки бабушки">
              {characterSusekiTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`character-suseki-tab${activeTab === tab.id ? ' is-active' : ''}`}
                  onClick={() => onTabChange(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="character-suseki-roll-panel">
              <div className="character-suseki-roll-content">
                <CharacterSusekiRollView
                  activeTab={activeTab}
                  rollResults={rollResults}
                  onRoll={() => handleRoll(activeTab)}
                />
              </div>
            </div>
          </>
        ) : null}
      </div>

      {isExpanded ? (
        <div className="character-suseki-table-panel">
          <div className="character-suseki-table-content">
            <CharacterSusekiTableView activeTab={activeTab} />
          </div>
        </div>
      ) : null}
    </section>
  )
}
