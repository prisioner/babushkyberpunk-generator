import { Dice } from '../../components/Dice'
import { RerollButton } from '../../components/RerollButton'
import { getSongsTable, rollSong } from '../../lib/songs'

const songsTable = getSongsTable()

interface SongsPageProps {
  activeSongKey: string | null
  onActiveSongKeyChange: (songKey: string | null) => void
}

export function SongsPage({
  activeSongKey,
  onActiveSongKeyChange,
}: SongsPageProps) {
  function handleRerollSong() {
    onActiveSongKeyChange(rollSong().key)
  }

  return (
    <section className="songs-page">
      <div className="generator-panel songs-panel">
        <div className="songs-header">
          <h1 className="songs-title troika-heading">D6 частушек на любой случай</h1>
          <RerollButton
            label="Выбрать случайную частушку"
            onClick={handleRerollSong}
          />
        </div>

        <div className="songs-list">
          {songsTable.entries.map((entry) => (
            <article
              key={entry.key}
              className={`songs-entry${activeSongKey === entry.key ? ' is-active' : ''}`}
            >
              <div className="songs-entry-key" aria-hidden="true">
                <Dice value={Number(entry.key) as 1 | 2 | 3 | 4 | 5 | 6} size="2.35em" />
              </div>

              <p className="songs-entry-label">{entry.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
