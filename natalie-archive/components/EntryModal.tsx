import { Entry, ColourPalette, PhotoSection, ResearchItem } from '@/lib/supabase'
import { useEffect, useState } from 'react'

const R2 = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''

export default function EntryModal({
  entry, lang, onClose
}: { entry: Entry; lang: 'zh' | 'en'; onClose: () => void }) {
  const title = lang === 'zh' ? entry.title_zh : entry.title_en
  const caption = lang === 'zh' ? entry.caption_zh : entry.caption_en
  const notes = lang === 'zh' ? entry.notes_zh : entry.notes_en
  const imgSrc = entry.photo_url ? `${R2}/${entry.photo_url}` : null
  const [activeTab, setActiveTab] = useState<'overview'|'photos'|'palette'|'research'>('overview')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const hasPhotos = entry.photo_sections?.length > 0
  const hasPalette = entry.colour_palettes?.length > 0
  const hasResearch = entry.research?.length > 0

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-full" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-header">
          <div className="modal-meta">
            {entry.location && <span className="modal-location">{entry.location}</span>}
            {entry.category && <span className="modal-category">{entry.category}</span>}
          </div>
          {title && <h2 className="modal-title">{title}</h2>}
          {caption && <p className="modal-caption">{caption}</p>}
        </div>

        <div className="modal-tabs">
          <button className={`modal-tab ${activeTab==='overview'?'active':''}`} onClick={()=>setActiveTab('overview')}>
            {lang==='zh'?'筆記':'Notes'}
          </button>
          {hasPhotos && (
            <button className={`modal-tab ${activeTab==='photos'?'active':''}`} onClick={()=>setActiveTab('photos')}>
              {lang==='zh'?'相片':'Photos'}
            </button>
          )}
          {hasPalette && (
            <button className={`modal-tab ${activeTab==='palette'?'active':''}`} onClick={()=>setActiveTab('palette')}>
              {lang==='zh'?'色板':'Palette'}
            </button>
          )}
          {hasResearch && (
            <button className={`modal-tab ${activeTab==='research'?'active':''}`} onClick={()=>setActiveTab('research')}>
              {lang==='zh'?'延伸資料':'Research'}
            </button>
          )}
        </div>

        <div className="modal-content">

          {activeTab === 'overview' && (
            <div className="tab-pane">
              {imgSrc ? (
                <img src={imgSrc} alt={title||''} className="modal-hero-img" />
              ) : (
                <div className="modal-no-img">N</div>
              )}
              {notes && (
                <div className="modal-section">
                  <div className="modal-section-label">{lang==='zh'?'筆記':'Notes'}</div>
                  <p className="modal-notes">{notes}</p>
                </div>
              )}
              {entry.tags?.length > 0 && (
                <div className="modal-section">
                  <div className="modal-section-label">Tags</div>
                  <div className="modal-tags">
                    {entry.tags.map(t => <span key={t} className="modal-tag">{t}</span>)}
                  </div>
                </div>
              )}
              {entry.keywords?.length > 0 && (
                <div className="modal-section">
                  <div className="modal-section-label">Keywords</div>
                  <div className="modal-keywords">
                    {entry.keywords.map(k => <span key={k} className="modal-keyword">{k}</span>)}
                  </div>
                </div>
              )}
              <div className="modal-date">
                {new Date(entry.created_at).toLocaleDateString(
                  lang==='zh'?'zh-HK':'en-GB',
                  {year:'numeric', month:'long', day:'numeric'}
                )}
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="tab-pane">
              {entry.photo_sections?.map((section: PhotoSection, si: number) => (
                <div key={si} className="photo-section">
                  <h3 className="photo-section-title">{section.section_title}</h3>
                  {section.section_note && (
                    <p className="photo-section-note">{section.section_note}</p>
                  )}
                  <div
