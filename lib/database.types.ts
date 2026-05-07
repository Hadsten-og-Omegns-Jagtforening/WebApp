export type NewsStatus = 'draft' | 'published'

export type NewsCategory =
  | 'Nyhed'
  | 'Jagt'
  | 'Præmieskydning'
  | 'Klubaften'
  | 'Praktisk info'

export type ResultRow = {
  rank: string
  name: string
  score: string
}

export type GalleryImage = {
  url: string
  alt: string
}

export type NewsPost = {
  id: string
  slug: string
  title: string
  category: NewsCategory
  teaser: string
  body: string
  image_url: string | null
  gallery_images: GalleryImage[] | null
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
