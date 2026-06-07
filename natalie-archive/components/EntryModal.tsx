'use client'

import { useEffect, useState } from 'react'

const R2 = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''
type Tab = 'overview' | 'photos' | 'palette' | 'research'
type Props = { entry: any; lang: 'zh' | 'en'; onClose: () => void }

function Lightbox({ photos, startIndex, lang, onClose }: {
  photos: any[], startIndex: number, lang: 'zh' | 'en', onClose: () => void
}) {
  const [idx, setIdx] = useState(startIndex)
  const photo = photos[idx]
  const caption = lang === 'zh' ? photo?.caption_zh : photo?.caption_en

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIdx(i => Math.min(i + 1, photos.length - 1))
      if (e.key === 'ArrowLeft') setIdx(i => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, photos.length])

  return (
    <div onClick={onClose} style={{
      position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.97)',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'
    }}>
      {/* Close */}
      <button onClick={onClose} style={{
        position:'absolute', top:20, right:20, background:'rgba(255,255,255,0.15)',
        border:'1px solid rgba(255,255,255,0.3)', color:'#fff', width:44, height:44,
        borderRadius:'50%', fontSize:22, cursor:'pointer', zIndex:10
      }}>×</button>

      {/* Counter */}
      <div style={{position:'absolute', top:24, left:'50%', transform:'translateX(-50%)',
        color:'rgba(255,255,255,0.5)', fontSize:12, letterSpacing:'0.15em'}}>
        {idx + 1} / {photos.length}
      </div>

      {/* Prev */}
      {idx > 0 && (
        <button onClick={e => { e.stopPropagation(); setIdx(i => i - 1) }} style={{
          position:'absolute', left:20, top:'50%', transform:'translateY(-50%)',
          background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)',
          color:'#fff', width:48, height:48, borderRadius:'50%', fontSize:26, cursor:'pointer'
        }}>‹</button>
      )}

      {/* Next */}
      {idx < photos.length - 1 && (
        <button onClick={e => { e.stopPropagation(); setIdx(i => i + 1) }} style={{
          position:'absolute', right:20, top:'50%', transform:'translateY(-50%)',
          background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)',
          color:'#fff', width:48, height:48, borderRadius:'50%', fontSize:26, cursor:'pointer'
        }}>›</button>
      )}

      {/* Image */}
      <img
        src={photo?.img} alt={photo?.label || ''}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth:'90vw', maxHeight:'75vh', objectFit:'contain', cursor:'default' }}
      />

      {/* Caption */}
      <div onClick={e => e.stopPropagation()} style={{
        marginTop:20, maxWidth:640, textAlign:'center', padding:'0 24px'
      }}>
        {photo?.label && (
          <div style={{fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase',
            color:'rgba(201,168,76,0.9)', marginBottom:8}}>{photo.label}</div>
        )}
        {caption && (
          <p style={{fontSize:13, color:'rgba(255,255,255,0.75)', lineHeight:1.7, fontStyle:'italic'}}>
            {caption}
          </p>
        )}
        {photo?.design_notes && photo.design_notes.length > 0 && (
          <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:8, textAlign:'left'}}>
            {photo.design_notes.map((note: any, i: number) => (
              <div key={i} style={{display:'flex', gap:8, background:'rgba(255,255,255,0.05)', padding:'8px 12px'}}>
                <span style={{fontSize:14}}>{note.icon}</span>
                <div>
                  <div style={{fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase',
                    color:'rgba(255,255,255,0.5)', marginBottom:3}}>{note.title}</div>
                  <div style={{fontSize:12, color:'rgba(255,255,255,0.6)', lineHeight:1.6}}>{note.content}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function EntryModal({ entry, lang, onClose }: Props) {
  const title = lang === 'zh' ? entry.title_zh : entry.title_en
  const caption = lang === 'zh' ? entry.caption_zh : entry.caption_en
  const notes = lang === 'zh' ? entry.notes_zh : entry.notes_en
  const imgSrc = entry.photo_url ? `${R2}/${entry.photo_url}` : null
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [lightbox, setLightbox] = useState<{photos: any[], index: number} | null>(null)

  const hasPhotos = !!(entry.photo_sections && entry.photo_sections.length)
  const hasPalette = !!(entry.colour_palettes && entry.colour_palettes.length)
  const hasResearch = !!(entry.research && entry.research.length)

  const allPhotos = entry.photo_sections?.flatMap((s: any) => s.photos || []) || []

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && !lightbox) onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [onClose, lightbox])

  return (
    <>
      {lightbox && (
        <Lightbox
          photos={lightbox.photos}
          startIndex={lightbox.index}
          lang={lang}
          onClose={() => setLightbox(null)}
        />
      )}

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
                {imgSrc
                  ? <img src={imgSrc} alt={title||''} className="modal-hero-img" style={{cursor:'zoom-in'}}
                      onClick={() => setLightbox({photos:[{img:imgSrc,label:title,caption_zh:entry.caption_zh,caption_en:entry.caption_en}], index:0})} />
                  : <div className="modal-no-img">N</div>
                }
                {notes && (
                  <div className="modal-section">
                    <div className="modal-section-label">{lang==='zh'?'筆記':'Notes'}</div>
                    <p className="modal-notes">{notes}</p>
                  </div>
                )}
                {entry.tags?.length > 0 && (
                  <div className="modal-section">
                    <div className="modal-section-label">Tags</div>
                    <div className="modal-tags">{entry.tags.map((t:string)=><span key={t} className="modal-tag">{t}</span>)}</div>
                  </div>
                )}
                {entry.keywords?.length > 0 && (
                  <div className="modal-section">
                    <div className="modal-section-label">Keywords</div>
                    <div className="modal-keywords">{entry.keywords.map((k:string)=><span key={k} className="modal-keyword">{k}</span>)}</div>
                  </div>
                )}
                <div className="modal-date">
                  {new Date(entry.created_at).toLocaleDateString(lang==='zh'?'zh-HK':'en-GB',{year:'numeric',month:'long',day:'numeric'})}
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
                      {section.photos?.map((photo: any, pi: number) => {
                        const photoCaption = lang==='zh' ? photo.caption_zh : photo.caption_en
                        const globalIdx = allPhotos.findIndex((p:any) => p === photo)
                        return (
                          <div key={pi} className="photo-item">
                            {photo.img
                              ? (
                                <div style={{position:'relative',cursor:'zoom-in'}}
                                  onClick={() => setLightbox({photos: allPhotos, index: globalIdx >= 0 ? globalIdx : pi})}>
                                  <img src={photo.img} alt={photo.label} className="photo-img" />
                                  <div style={{
                                    position:'absolute',bottom:8,right:8,
                                    background:'rgba(0,0,0,0.5)',color:'#fff',
                                    fontSize:11,padding:'3px 8px',letterSpacing:'0.05em'
                                  }}>⊕ 放大</div>
                                </div>
                              )
                              : (
                                <div className="photo-placeholder">
                                  <span>N</span>
                                  <p>{lang==='zh'?'相片待上傳':'Photo pending upload'}</p>
                                </div>
                              )
                            }
                            <div className="photo-body">
                              <div className="photo-label">{photo.label}</div>
                              {photoCaption && <p className="photo-caption">{photoCaption}</p>}
                              {photo.design_notes?.map((note:any, ni:number) => (
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
                {entry.colour_palettes.map((palette:any, pi:number) => (
                  <div key={pi} className="palette-group">
                    <div className="palette-name">{palette.name}</div>
                    <div className="palette-swatches">
                      {palette.colours?.map((colour:any, ci:number) => (
                        <div key={ci} className="swatch">
                          <div className="swatch-colour" style={{background:colour.hex}} />
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
                {entry.research.map((item:any, ri:number) => (
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
