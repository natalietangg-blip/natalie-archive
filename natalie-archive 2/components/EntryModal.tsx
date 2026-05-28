import { Entry } from '@/lib/supabase'
import { useEffect } from 'react'

const R2 = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''

export default function EntryModal({
  entry, lang, onClose
}: { entry: Entry; lang: 'zh' | 'en'; onClose: () => void }) {
  const title = lang === 'zh' ? entry.title_zh : entry.title_en
  const caption = lang === 'zh' ? entry.caption_zh : entry.caption_en
  const notes = lang === 'zh' ? entry.notes_zh : entry.notes_en
  const imgSrc = entry.photo_url ? `${R2}/${entry.photo_url}` : null

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        {imgSrc ? (
          <img src={imgSrc} alt={title || ''} className="modal-img" />
        ) : (
          <div className="modal-no-img">N</div>
        )}

        <div className="modal-body">
          <div className="modal-meta">
            {entry.location && <span className="modal-location">{entry.location}</span>}
            {entry.category && <span className="modal-category">{entry.category}</span>}
          </div>

          {title && <h2 className="modal-title">{title}</h2>}

          {caption && (
            <div>
              <div className="modal-section-label">
                {lang === 'zh' ? 'Caption' : 'Caption'}
              </div>
              <p className="modal-caption">{caption}</p>
            </div>
          )}

          {notes && (
            <div>
              <div className="modal-section-label">
                {lang === 'zh' ? '筆記' : 'Notes'}
              </div>
              <p className="modal-notes">{notes}</p>
            </div>
          )}

          {entry.tags?.length > 0 && (
            <div>
              <div className="modal-section-label">Tags</div>
              <div className="modal-tags">
                {entry.tags.map(t => (
                  <span key={t} className="modal-tag">{t}</span>
                ))}
              </div>
            </div>
          )}

          {entry.keywords?.length > 0 && (
            <div>
              <div className="modal-section-label">Keywords</div>
              <div className="modal-keywords">
                {entry.keywords.map(k => (
                  <span key={k} className="modal-keyword">{k}</span>
                ))}
              </div>
            </div>
          )}

          {entry.further_reading?.length > 0 && (
            <div>
              <div className="modal-section-label">
                {lang === 'zh' ? '延伸閱讀' : 'Further reading'}
              </div>
              <div className="modal-further">
                {entry.further_reading.map((r, i) => (
                  <a key={i} href={r.url} target="_blank" rel="noopener noreferrer">
                    {r.title} ↗
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="modal-date">
            {new Date(entry.created_at).toLocaleDateString(
              lang === 'zh' ? 'zh-HK' : 'en-GB',
              { year: 'numeric', month: 'long', day: 'numeric' }
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
