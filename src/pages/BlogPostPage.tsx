import { useParams, Link } from 'react-router-dom'
import { getPostBySlug } from '../lib/markdown'
import { MarkdownRenderer } from '../components/blog/MarkdownRenderer'

function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 230))
  return `${minutes} min read`
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug) : undefined

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 animate-page-in">
        <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-text)] mb-4">
          Post not found
        </h1>
        <Link
          to="/blog"
          className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
        >
          &larr; Back to blog
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 animate-page-in">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-8"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 12L6 8l4-4" />
        </svg>
        Blog
      </Link>

      <header className="mb-10">
        <h1 className="font-[var(--font-display)] text-4xl lg:text-[2.75rem] leading-tight text-[var(--color-text)] mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-sm font-mono text-[var(--color-text-muted)]">
          <time>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span className="text-[var(--color-border)]">/</span>
          <span>{readingTime(post.content)}</span>
        </div>
      </header>

      <MarkdownRenderer content={post.content} />
    </div>
  )
}
