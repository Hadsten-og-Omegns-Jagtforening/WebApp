type PostInput = {
  title: string
  teaser: string
  category: string
  body: string
}

function hasBodyContent(body: string) {
  return body
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .trim()
    .length > 0
}

export function validatePostInput({ title, teaser, category, body }: PostInput) {
  if (!title.trim()) return 'Overskrift er påkrævet.'
  if (!teaser.trim()) return 'Uddrag er påkrævet.'
  if (!category.trim()) return 'Kategori er påkrævet.'
  if (!hasBodyContent(body)) return 'Indhold er påkrævet.'
  return null
}
