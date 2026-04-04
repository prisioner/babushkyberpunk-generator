import { Dice } from '../../components/Dice'
import type { D66RollResult } from '../../types/data'

export const ENEMY_TYPE_DICE_COLOR = '#3FAF48'
export const ENEMY_SUBTYPE_DICE_COLOR = '#03A999'

export function AdventureD66DicePair({ roll }: { roll: D66RollResult }) {
  return (
    <span className="suseki-dice-pair">
      <Dice value={roll.firstDie} />
      <Dice value={roll.secondDie} />
    </span>
  )
}
