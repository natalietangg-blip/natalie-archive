'use client'

import { useEffect, useState } from 'react'

const R2 = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''

type Tab = 'overview' | 'photos' | 'palette' | 'research'

type Props = {
  entry: any
  lang: 'zh' | 'en'
  onClose: () => void
}

export default function EntryModal({ entry, lang, onClose }: Props) {
  const title = lang === 'zh' ? entry.title_zh : entry.title_en
  const caption = lang === 'zh' ? entry.caption_zh : entry.caption_en
  const notes = lang === 'zh' ? entry.notes_zh : entry.notes_en
  const imgSrc = entry.photo_url ? `${R2}/${entry.photo_url}` : null
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [lightbox, setLightbox] = useState<string | null>(null)

  const hasPhotos = !!(entry.photo_sections && entry.photo_sections.length)
  const hasPalette = !!(entry.colour_palettes && entry.colour_palettes.length)
  const hasResearch = !!(entry.research && entry.research.length)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') lightbox ? setLightbox(null) : onClose()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose, lightbox])

  return (
    <>
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.96)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out'
          }}
        >
          <img
            src={lightbox}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '95vw', maxHeight: '95vh', objectFit: 'contain', cursor: 'default' }}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff', width: 44, height: 44, borderRadius: '50%',
              fontSize: 22, cursor: 'pointer', lineHeight: '42px', textAlign: 'center'
            }}
          >×</button>
        </div>
      )}

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-full" onClick={(e) => e.stopPropagation()}>
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
            <button className={`modal-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              {lang === 'zh' ? '筆記' : 'Notes'}
            </button>
            {hasPhotos && (
              <button className={`modal-tab ${activeTab === 'photos' ? 'active' : ''}`} onClick={() => setActiveTab('photos')}>
                {lang === 'zh' ? '相片' : 'Photos'}
              </button>
            )}
            {hasPalette && (
              <button className={`modal-tab ${activeTab === 'palette' ? 'active' : ''}`} onClick={() => setActiveTab('palette')}>
                {lang === 'zh' ? '色板' : 'Palette'}
              </button>
            )}
            {hasResearch && (
              <button className={`modal-tab ${activeTab === 'research' ? 'active' : ''}`} onClick={() => setActiveTab('research')}>
                {lang === 'zh' ? '延伸資料' : 'Research'}
              </button>
            )}
          </div>

          <div className="modal-content">

            {activeTab === 'overview' && (
              <div className="tab-pane">
                {imgSrc
                  ? <img src={imgSrc} alt={title || ''} className="modal-hero-img" style={{cursor:'zoom-in'}} onClick={() => setLightbox(imgSrc)} />
                  : <div className="modal-no-img">N</div>
                }
                {notes && (
                  <div className="modal-section">
                    <div className="modal-section-label">{lang === 'zh' ? '筆記' : 'Notes'}</div>
                    <p className="modal-notes">{notes}</p>
                  </div>
                )}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="modal-section">
                    <div className="modal-section-label">Tags</div>
                    <div className="modal-tags">
                      {entry.tags.map((t: string) => <span key={t} className="modal-tag">{t}</span>)}
                    </div>
                  </div>
                )}
                {entry.keywords && entry.keywords.length > 0 && (
                  <div className="modal-section">
                    <div className="modal-section-label">Keywords</div>
                    <div className="modal-keywords">
                      {entry.keywords.map((k: string) => <span key={k} className="modal-keyword">{k}</span>)}
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
            )}

            {activeTab === 'photos' && (
              <div className="tab-pane">
                {entry.photo_sections.map((section: any, si: number) => (
                  <div key={si} className="photo-section">
                    <h3 className="photo-section-title">{section.section_title}</h3>
                    {section.section_note && <p className="photo-section-note">{section.section_note}</p>}
                    <div className="photo-grid">
                      {section.photos && section.photos.map((photo: any, pi: number) => {
                        const photoCaption = lang === 'zh' ? photo.caption_zh : photo.caption_en
                        return (
                          <div key={pi} className="photo-item">
                            {photo.img
                              ? (
                                <div style={{position:'relative', cursor:'zoom-in'}} onClick={() => setLightbox(photo.img)}>
                                  <img src={photo.img} alt={photo.label} className="photo-img" />
                                  <div style={{
                                    position:'absolute', bottom:8, right:8,
                                    background:'rgba(0,0,0,0.5)', color:'#fff',
                                    fontSize:11, padding:'3px 8px', letterSpacing:'0.05em'
                                  }}>⊕ 放大</div>
                                </div>
                              )
                              : (
                                <div className="photo-placeholder">
                                  <span>N</span>
                                  <p>{lang === 'zh' ? '相片待上傳' : 'Photo pending upload'}</p>
                                </div>
                              )
                            }
                            <div className="photo-body">
                              <div className="photo-label">{photo.label}</div>
                              {photoCaption && <p className="photo-caption">{photoCaption}</p>}
                              {photo.design_notes && photo.design_notes.map((note: any, ni: number) => (
                                <div key={ni} className="design-note">
                                  <span className="design-note-icon">{note.icon}</span>
                                  <div>
                                    <div className="design-note-title">{note.title}</div>
                                    <div className="design-note-content">{note.content}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'palette' && (
              <div className="tab-pane">
                {entry.colour_palettes.map((palette: any, pi: number) => (
                  <div key={pi} className="palette-group">
                    <div className="palette-name">{palette.name}</div>
                    <div className="palette-swatches">
                      {palette.colours && palette.colours.map((colour: any, ci: number) => (
                        <div key={ci} className="swatch">
                          <div className="swatch-colour" style={{ background: colour.hex }} />
                          <div className="swatch-hex">{colour.hex}</div>
                          <div className="swatch-name">{colour.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'research' && (
              <div className="tab-pane">
                {entry.research.map((item: any, ri: number) => (
                  <div key={ri} className="research-item">
                    <div className="research-title">{item.title}</div>
                    <p className="research-content">{item.content}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}
