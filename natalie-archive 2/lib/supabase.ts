import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Entry = {
  id: string
  created_at: string
  title_zh: string | null
  title_en: string | null
  caption_zh: string | null
  caption_en: string | null
  notes_zh: string | null
  notes_en: string | null
  tags: string[]
  keywords: string[]
  photo_url: string | null
  category: string | null
  location: string | null
  further_reading: { title: string; url: string }[]
}
