'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, Entry } from '@/lib/supabase'
import EntryCard from '@/components/EntryCard'
import EntryModal from '@/components/EntryModal'
import SearchBar from '@/components/SearchBar'

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [filtered, setFiltered] = useState<Entry[]>([])
  const [selected, setSelected] = useState<Entry | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [lang, setLang] = useState<'zh' | 'en'>('zh')

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) {
      setEntries(data)
      setFiltered(data)
    }
    setLoading(false)
  }

  const allTags = Array.from(new Set(entries.flatMap(e => e.tags || []))).sort()

  const doFilter = useCallback((q: string, tag: string | null, list: Entry[]) => {
    let out = list
    if (tag) out = out.filter(e => e.tags?.includes(tag))
    if (q.trim()) {
      const ql = q.toLowerCase()
      out = out.filter(e =>
        [e.title_zh, e.title_en, e.caption_zh, e.caption_en,
         e.notes_zh, e.notes_en, e.location, e.category,
         ...(e.tags || []), ...(e.keywords || [])]
          .join(' ').toLowerCase().includes(ql)
      )
    }
    setFiltered(out)
  }, [])

  useEffect(() => { doFilter(search, activeTag, entries) }, [search, activeTag, entries, doFilter])

  return (
    <main className="main">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-n">N</span>
            <span className="logo-text">ARCHIVE</span>
          </div>
          <div className="header-right">
            <button
              className={`lang-btn ${lang === 'zh' ? 'active' : ''}`}
              onClick={() => setLang('zh')}>中</button>
            <button
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}>EN</button>
          </div>
        </div>
        <SearchBar value={search} onChange={setSearch} lang={lang} />
        {allTags.length > 0 && (
          <div className="tags-row">
            <button
              className={`tag-pill ${!activeTag ? 'active' : ''}`}
              onClick={() => setActiveTag(null)}>
              {lang === 'zh' ? '全部' : 'All'}
            </button>
            {allTags.map(t => (
              <button
                key={t}
                className={`tag-pill ${activeTag === t ? 'active' : ''}`}
                onClick={() => setActiveTag(activeTag === t ? null : t)}>
                {t}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="count-bar">
        {loading ? '...' : `${filtered.length} ${lang === 'zh' ? '個靈感' : 'entries'}`}
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-dots"><span/><span/><span/></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          {lang === 'zh' ? '未有靈感' : 'No entries found'}
        </div>
      ) : (
        <div className="grid">
          {filtered.map(entry => (
            <EntryCard
              key={entry.id}
              entry={entry}
              lang={lang}
              onClick={() => setSelected(entry)}
            />
          ))}
        </div>
      )}

      {selected && (
        <EntryModal
          entry={selected}
          lang={lang}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  )
}
