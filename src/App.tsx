import { useState } from 'react'
import { ExternalLinkIcon } from './components/icons/ExternalLinkIcon'
import { GitHubIcon } from './components/icons/GitHubIcon'
import { AdventureGenerator } from './features/adventure/AdventureGenerator'
import { CharacterGenerator } from './features/character/CharacterGenerator'
import {
  createCharacterSheetDraft,
  type CharacterSheetDraft,
} from './features/character/components/CharacterSheet'
import { SongsPage } from './features/songs/SongsPage'
import type {
  AdventureSusekiRollState,
  AdventureSusekiTabId,
} from './lib/adventureTables'
import type {
  CharacterSusekiRollState,
  CharacterSusekiTabId,
} from './lib/characterTables'
import type { GeneratedAdventure, GeneratedCharacter } from './types/data'

type TabId = 'character' | 'adventure' | 'songs'

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'character', label: 'Генератор бабушки' },
  { id: 'adventure', label: 'Генератор приключения' },
  { id: 'songs', label: 'Частушки' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('character')
  const [activeCharacterSusekiTab, setActiveCharacterSusekiTab] =
    useState<CharacterSusekiTabId>('hair_color')
  const [characterSusekiRollResults, setCharacterSusekiRollResults] =
    useState<CharacterSusekiRollState>({})
  const [character, setCharacter] = useState<GeneratedCharacter | null>(null)
  const [characterSheetDraft, setCharacterSheetDraft] = useState<CharacterSheetDraft>(() =>
    createCharacterSheetDraft(),
  )
  const [isCharacterSusekiExpanded, setIsCharacterSusekiExpanded] = useState(false)
  const [activeAdventureSusekiTab, setActiveAdventureSusekiTab] =
    useState<AdventureSusekiTabId>('hook')
  const [adventureSusekiRollResults, setAdventureSusekiRollResults] =
    useState<AdventureSusekiRollState>({})
  const [adventure, setAdventure] = useState<GeneratedAdventure | null>(null)
  const [isAdventureSusekiExpanded, setIsAdventureSusekiExpanded] = useState(false)
  const [activeSongKey, setActiveSongKey] = useState<string | null>(null)

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-shell">
          <div className="app-nav-row">
            <nav className="app-tabs" aria-label="Основные вкладки">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`app-tab${activeTab === tab.id ? ' is-active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="app-links" aria-label="Внешние ссылки">
              <a
                className="app-link app-link--icon"
                href="https://github.com/prisioner/babushkyberpunk-generator"
                target="_blank"
                rel="noopener"
                aria-label="GitHub репозиторий"
                title="GitHub репозиторий"
              >
                <GitHubIcon className="app-link-icon app-link-icon--github" />
              </a>

              <a
                className="app-link"
                href="https://rpgbook.ru/babushkyberpunk"
                target="_blank"
                rel="noopener"
              >
                <span>Купить книгу правил</span>
                <ExternalLinkIcon className="app-link-icon" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="app-content app-shell">
        {activeTab === 'character' ? (
          <CharacterGenerator
            character={character}
            onCharacterChange={setCharacter}
            sheetDraft={characterSheetDraft}
            onSheetDraftChange={setCharacterSheetDraft}
            activeSusekiTab={activeCharacterSusekiTab}
            onSusekiTabChange={setActiveCharacterSusekiTab}
            susekiRollResults={characterSusekiRollResults}
            onSusekiRollResultsChange={setCharacterSusekiRollResults}
            isSusekiExpanded={isCharacterSusekiExpanded}
            onSusekiExpandedChange={setIsCharacterSusekiExpanded}
          />
        ) : activeTab === 'adventure' ? (
          <AdventureGenerator
            adventure={adventure}
            onAdventureChange={setAdventure}
            activeSusekiTab={activeAdventureSusekiTab}
            onSusekiTabChange={setActiveAdventureSusekiTab}
            susekiRollResults={adventureSusekiRollResults}
            onSusekiRollResultsChange={setAdventureSusekiRollResults}
            isSusekiExpanded={isAdventureSusekiExpanded}
            onSusekiExpandedChange={setIsAdventureSusekiExpanded}
          />
        ) : (
          <SongsPage
            activeSongKey={activeSongKey}
            onActiveSongKeyChange={setActiveSongKey}
          />
        )}
      </main>
    </div>
  )
}
