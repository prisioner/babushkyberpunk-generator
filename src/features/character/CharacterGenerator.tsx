import type { Dispatch, SetStateAction } from 'react'
import { CharacterTablesPanel } from './CharacterTablesPanel'
import { generateCharacter, rerollCharacterField, type CharacterRerollTarget } from '../../lib/character'
import type {
  CharacterSusekiRollState,
  CharacterSusekiTabId,
} from '../../lib/characterTables'
import type { GeneratedCharacter } from '../../types/data'
import {
  CharacterSheet,
  createCharacterSheetDraft,
  type CharacterSheetDraft,
  type CharacterSheetWoundId,
} from './components/CharacterSheet'

interface CharacterGeneratorProps {
  character: GeneratedCharacter | null
  onCharacterChange: Dispatch<SetStateAction<GeneratedCharacter | null>>
  sheetDraft: CharacterSheetDraft
  onSheetDraftChange: Dispatch<SetStateAction<CharacterSheetDraft>>
  activeSusekiTab: CharacterSusekiTabId
  onSusekiTabChange: (tabId: CharacterSusekiTabId) => void
  susekiRollResults: CharacterSusekiRollState
  onSusekiRollResultsChange: Dispatch<SetStateAction<CharacterSusekiRollState>>
  isSusekiExpanded: boolean
  onSusekiExpandedChange: Dispatch<SetStateAction<boolean>>
}

export function CharacterGenerator({
  character,
  onCharacterChange,
  sheetDraft,
  onSheetDraftChange,
  activeSusekiTab,
  onSusekiTabChange,
  susekiRollResults,
  onSusekiRollResultsChange,
  isSusekiExpanded,
  onSusekiExpandedChange,
}: CharacterGeneratorProps) {
  function handleGenerateCharacter() {
    const generatedCharacter = generateCharacter()

    onCharacterChange(generatedCharacter)
    onSheetDraftChange(createCharacterSheetDraft())
  }

  function handleRerollCharacterField(target: CharacterRerollTarget) {
    onCharacterChange((currentCharacter) =>
      currentCharacter ? rerollCharacterField(currentCharacter, target) : currentCharacter,
    )
  }

  function handleWoundChange(woundId: CharacterSheetWoundId, checked: boolean) {
    onSheetDraftChange((currentDraft) => ({
      ...currentDraft,
      wounds: {
        ...currentDraft.wounds,
        [woundId]: checked,
      },
    }))
  }

  return (
    <section className="character-generator">
      <div className="generator-panel character-sheet-panel">
        <div className="character-sheet-page-header">
          <h1 className="character-sheet-page-title troika-heading">Персональная бабушка</h1>
          <div className="character-sheet-page-actions">
            <button type="button" className="suseki-roll-button" onClick={handleGenerateCharacter}>
              Наскрести по сусекам <span aria-hidden="true">↻</span>
            </button>
          </div>
        </div>

        <CharacterSheet
          character={character}
          draft={sheetDraft}
          onWoundChange={handleWoundChange}
          onRerollHairColor={
            character ? () => handleRerollCharacterField('hair_color') : undefined
          }
          onRerollStats={character ? () => handleRerollCharacterField('stats') : undefined}
          onRerollFullName={
            character ? () => handleRerollCharacterField('full_name') : undefined
          }
          onRerollPast={character ? () => handleRerollCharacterField('past') : undefined}
          onRerollSignatureMove={
            character ? () => handleRerollCharacterField('signature_move') : undefined
          }
          onRerollVeshch={character ? () => handleRerollCharacterField('veshch') : undefined}
          onRerollFlaw={character ? () => handleRerollCharacterField('flaw') : undefined}
        />
      </div>

      <CharacterTablesPanel
        activeTab={activeSusekiTab}
        onTabChange={onSusekiTabChange}
        rollResults={susekiRollResults}
        setRollResults={onSusekiRollResultsChange}
        isExpanded={isSusekiExpanded}
        onExpandedChange={onSusekiExpandedChange}
      />
    </section>
  )
}
