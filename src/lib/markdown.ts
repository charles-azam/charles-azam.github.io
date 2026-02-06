export interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
  content: string
}

/** Simple YAML frontmatter parser — no Node dependencies. */
function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const data: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
    data[key] = value
  }

  return { data, content: match[2] }
}

const blogModules = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export function getAllPosts(): BlogPost[] {
  const posts: BlogPost[] = []

  for (const [path, raw] of Object.entries(blogModules)) {
    const slug = path.split('/').pop()!.replace('.md', '')
    const { data, content } = parseFrontmatter(raw as string)

    posts.push({
      slug,
      title: data.title ?? slug,
      date: data.date ?? '',
      description: data.description ?? '',
      content,
    })
  }

  // Sort by date descending
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return posts
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug)
}
