import { Dice } from '../../../components/Dice'
import { RerollButton } from '../../../components/RerollButton'
import type { AdventureSceneRerollTarget } from '../../../lib/adventure'
import type {
  D6RollResult,
  D66RollResult,
  GeneratedAdventure,
  GeneratedEnemies,
  GeneratedScene,
} from '../../../types/data'
import {
  AdventureD66DicePair,
  ENEMY_SUBTYPE_DICE_COLOR,
  ENEMY_TYPE_DICE_COLOR,
} from '../adventurePresentation'

const sceneSlots = [0, 1, 2] as const

function AdventureBlockHeader({
  title,
  actionLabel,
  onAction,
  showAction = false,
  centerTitle = false,
}: {
  title: string
  actionLabel: string
  onAction?: () => void
  showAction?: boolean
  centerTitle?: boolean
}) {
  return (
    <div className={`adventure-sheet-block-header${centerTitle ? ' is-centered' : ''}`}>
      {centerTitle ? <span className="adventure-sheet-action-slot" aria-hidden="true" /> : null}
      <h3 className="adventure-sheet-block-title">{title}</h3>
      {showAction && onAction ? (
        <RerollButton label={actionLabel} onClick={onAction} />
      ) : (
        <span className="adventure-sheet-action-slot" aria-hidden="true" />
      )}
    </div>
  )
}

function AdventurePlaceholder({ className = '' }: { className?: string }) {
  return <div className={`adventure-sheet-placeholder ${className}`.trim()} aria-hidden="true" />
}

function AdventureFieldBlock({
  title,
  label,
  description,
  roll,
  rerollLabel,
  onReroll,
}: {
  title: string
  label?: string
  description?: string
  roll?: D6RollResult | D66RollResult
  rerollLabel: string
  onReroll?: () => void
}) {
  return (
    <section className="adventure-sheet-block">
      <AdventureBlockHeader
        title={title}
        actionLabel={rerollLabel}
        onAction={onReroll}
        showAction={Boolean(label && onReroll)}
      />

      <div className={`adventure-sheet-block-body${label ? '' : ' is-empty'}`}>
        {label && roll ? (
          <div className="adventure-sheet-result">
            {'value' in roll ? (
              <div className="adventure-sheet-inline-result">
                <Dice value={roll.value} />
                <span className="adventure-sheet-value">{label}</span>
              </div>
            ) : (
              <div className="adventure-sheet-inline-result">
                <AdventureD66DicePair roll={roll} />
                <span className="adventure-sheet-value">{label}</span>
              </div>
            )}

            {description ? <p className="adventure-sheet-description">{description}</p> : null}
          </div>
        ) : (
          <AdventurePlaceholder />
        )}
      </div>
    </section>
  )
}

function AdventureEnemiesBlock({
  enemies,
  onReroll,
}: {
  enemies?: GeneratedEnemies
  onReroll?: () => void
}) {
  return (
    <section className="adventure-sheet-block">
      <AdventureBlockHeader
        title="Враги народа"
        actionLabel="Перегенерировать врагов"
        onAction={onReroll}
        showAction={Boolean(enemies && onReroll)}
      />

      <div
        className={`adventure-sheet-block-body adventure-sheet-block-body--enemies${
          enemies ? '' : ' is-empty'
        }`}
      >
        {enemies ? (
          <div className="adventure-sheet-enemies">
            <div className="adventure-sheet-enemy-line">
              <span className="adventure-sheet-enemy-label">С виду это просто</span>
              <span className="suseki-dice-row">
                <Dice value={enemies.appearance.roll.value} />
                <strong>{enemies.appearance.entry.label}</strong>
              </span>
            </div>

            <div className="adventure-sheet-enemy-line">
              <span className="adventure-sheet-enemy-label">А на самом деле</span>
              <span className="suseki-dice-row">
                <Dice value={enemies.type.roll.value} color={ENEMY_TYPE_DICE_COLOR} />
                <strong>{enemies.type.entry.label}</strong>
              </span>
            </div>

            <div className="adventure-sheet-enemy-line">
              <span className="adventure-sheet-enemy-label">Да ещё и</span>
              <span className="suseki-dice-row">
                <Dice value={enemies.subtype.roll.value} color={ENEMY_SUBTYPE_DICE_COLOR} />
                <strong>{enemies.subtype.entry.label}</strong>
              </span>
            </div>
          </div>
        ) : (
          <AdventurePlaceholder className="adventure-sheet-placeholder--tall" />
        )}
      </div>
    </section>
  )
}

function AdventureHookBlock({
  hook,
  onReroll,
}: {
  hook?: GeneratedAdventure['hook']
  onReroll: () => void
}) {
  return (
    <section className="adventure-sheet-block adventure-sheet-block--hook">
      <AdventureBlockHeader
        title="Что случилось?"
        actionLabel="Перегенерировать зацепку"
        onAction={onReroll}
        showAction={Boolean(hook)}
        centerTitle
      />

      <div
        className={`adventure-sheet-block-body adventure-sheet-block-body--hook${
          hook ? '' : ' is-empty'
        }`}
      >
        {hook ? (
          <div className="adventure-sheet-result adventure-sheet-result--hook">
            <p className="adventure-sheet-hook-dice">
              <AdventureD66DicePair roll={hook.roll} />
            </p>
            <p className="adventure-sheet-value">{hook.entry.label}</p>
            {hook.entry.description ? (
              <p className="adventure-sheet-description">{hook.entry.description}</p>
            ) : null}
          </div>
        ) : (
          <AdventurePlaceholder />
        )}
      </div>
    </section>
  )
}

function AdventureSceneCard({
  scene,
  index,
  onRerollScene,
  onRerollLocation,
  onRerollTechnology,
  onRerollEnemies,
}: {
  scene?: GeneratedScene
  index: number
  onRerollScene: () => void
  onRerollLocation: () => void
  onRerollTechnology: () => void
  onRerollEnemies: () => void
}) {
  return (
    <section className="adventure-scene-card">
      <div className="adventure-scene-header adventure-scene-header--centered">
        <span className="adventure-sheet-action-slot" aria-hidden="true" />
        <h3 className="adventure-scene-title">Сцена {index + 1}</h3>
        {scene ? (
          <RerollButton label="Перегенерировать сцену" onClick={onRerollScene} />
        ) : (
          <span className="adventure-sheet-action-slot" aria-hidden="true" />
        )}
      </div>

      <div className="adventure-scene-sections">
        <AdventureFieldBlock
          title="Место действия"
          label={scene?.location.entry.label}
          description={scene?.location.entry.description}
          roll={scene?.location.roll}
          rerollLabel="Перегенерировать место"
          onReroll={onRerollLocation}
        />

        <AdventureFieldBlock
          title="Технология"
          label={scene?.technology.entry.label}
          description={scene?.technology.entry.description}
          roll={scene?.technology.roll}
          rerollLabel="Перегенерировать технологию"
          onReroll={onRerollTechnology}
        />

        <AdventureEnemiesBlock enemies={scene?.enemies} onReroll={onRerollEnemies} />
      </div>
    </section>
  )
}

interface AdventureSheetProps {
  adventure: GeneratedAdventure | null
  onGenerate: () => void
  onRerollHook: () => void
  onRerollScene: (sceneIndex: number, target: AdventureSceneRerollTarget) => void
}

export function AdventureSheet({
  adventure,
  onGenerate,
  onRerollHook,
  onRerollScene,
}: AdventureSheetProps) {
  return (
    <div className="generator-panel adventure-sheet-panel">
      <h1 className="adventure-sheet-title troika-heading">Типичный вторник кибербабушек</h1>

      <div className="generator-toolbar adventure-sheet-toolbar">
        <button type="button" className="suseki-roll-button" onClick={onGenerate}>
          Наскрести по сусекам <span aria-hidden="true">↻</span>
        </button>
      </div>

      <div className="adventure-sheet-layout">
        <AdventureHookBlock hook={adventure?.hook} onReroll={onRerollHook} />

        <div className="adventure-scenes-grid">
          {sceneSlots.map((index) => (
            <AdventureSceneCard
              key={index}
              scene={adventure?.scenes[index]}
              index={index}
              onRerollScene={() => onRerollScene(index, 'scene')}
              onRerollLocation={() => onRerollScene(index, 'location')}
              onRerollTechnology={() => onRerollScene(index, 'technology')}
              onRerollEnemies={() => onRerollScene(index, 'enemies')}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
