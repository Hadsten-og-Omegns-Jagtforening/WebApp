export type NewsStatus = 'draft' | 'published'

export type NewsCategory = string

export type ResultRow = {
  rank: string
  name: string
  score: string
}

export type NewsPost = {
  id: string
  slug: string
  title: string
  category: NewsCategory
  teaser: string
  body: string
  image_url: string | null
  has_results: boolean
  results: ResultRow[] | null
  status: NewsStatus
  highlighted: boolean
  allow_comments: boolean
  published_at: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export type NewsPostInsert = Omit<NewsPost, 'id' | 'created_at' | 'updated_at'>
export type NewsPostUpdate = Partial<NewsPostInsert>

export type NewsCategoryRow = {
  id: string
  name: string
  sort_order: number
  created_at: string
}

export type PrizeActivity = {
  id: string
  slug: string
  title: string
  month_label: string
  card_description: string
  body: string
  icon: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type PrizeActivityInsert = Omit<PrizeActivity, 'id' | 'created_at' | 'updated_at'>
export type PrizeActivityUpdate = Partial<PrizeActivityInsert>
