import type { Dispatch, SetStateAction } from 'react'
import {
  generateAdventure,
  rerollAdventureHook,
  rerollAdventureScene,
} from '../../lib/adventure'
import type { AdventureSceneRerollTarget } from '../../lib/adventure'
import type {
  AdventureSusekiRollState,
  AdventureSusekiTabId,
} from '../../lib/adventureTables'
import { AdventureTablesPanel } from './AdventureTablesPanel'
import type { GeneratedAdventure } from '../../types/data'
import { AdventureSheet } from './components/AdventureSheet'

interface AdventureGeneratorProps {
  adventure: GeneratedAdventure | null
  onAdventureChange: Dispatch<SetStateAction<GeneratedAdventure | null>>
  activeSusekiTab: AdventureSusekiTabId
  onSusekiTabChange: (tabId: AdventureSusekiTabId) => void
  susekiRollResults: AdventureSusekiRollState
  onSusekiRollResultsChange: Dispatch<SetStateAction<AdventureSusekiRollState>>
  isSusekiExpanded: boolean
  onSusekiExpandedChange: Dispatch<SetStateAction<boolean>>
}

export function AdventureGenerator({
  adventure,
  onAdventureChange,
  activeSusekiTab,
  onSusekiTabChange,
  susekiRollResults,
  onSusekiRollResultsChange,
  isSusekiExpanded,
  onSusekiExpandedChange,
}: AdventureGeneratorProps) {
  function handleGenerateAdventure() {
    onAdventureChange(generateAdventure())
  }

  function handleRerollHook() {
    onAdventureChange((currentAdventure) => {
      if (!currentAdventure) {
        return currentAdventure
      }

      return rerollAdventureHook(currentAdventure)
    })
  }

  function handleRerollScene(
    sceneIndex: number,
    target: AdventureSceneRerollTarget,
  ) {
    onAdventureChange((currentAdventure) => {
      if (!currentAdventure) {
        return currentAdventure
      }

      return rerollAdventureScene(currentAdventure, sceneIndex, target)
    })
  }

  return (
    <section className="adventure-generator">
      <AdventureSheet
        adventure={adventure}
        onGenerate={handleGenerateAdventure}
        onRerollHook={handleRerollHook}
        onRerollScene={handleRerollScene}
      />

      <AdventureTablesPanel
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
