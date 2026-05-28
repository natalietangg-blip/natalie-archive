export default function SearchBar({
  value, onChange, lang
}: { value: string; onChange: (v: string) => void; lang: 'zh' | 'en' }) {
  return (
    <div className="search-wrap">
      <input
        className="search-input"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={lang === 'zh' ? '搜尋靈感、地點、關鍵字…' : 'Search by keyword, location, tag…'}
      />
      <span className="search-icon">⌕</span>
    </div>
  )
}
