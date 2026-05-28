import { Entry } from '@/lib/supabase'

const R2 = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''

export default function EntryCard({
  entry, lang, onClick
}: { entry: Entry; lang: 'zh' | 'en'; onClick: () => void }) {
  const title = lang === 'zh' ? entry.title_zh : entry.title_en
  const caption = lang === 'zh' ? entry.caption_zh : entry.caption_en
  const imgSrc = entry.photo_url ? `${R2}/${entry.photo_url}` : null

  return (
    <div className="entry-card" onClick={onClick}>
      {imgSrc ? (
        <img src={imgSrc} alt={title || ''} className="entry-card-img" loading="lazy" />
      ) : (
        <div className="entry-card-no-img">N</div>
      )}
      <div className="entry-card-body">
        {entry.location && <div className="entry-card-location">{entry.location}</div>}
        {title && <div className="entry-card-title">{title}</div>}
        {caption && <div className="entry-card-caption">{caption}</div>}
        {entry.tags?.length > 0 && (
          <div className="entry-card-tags">
            {entry.tags.slice(0, 3).map(t => (
              <span key={t} className="entry-card-tag">{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
