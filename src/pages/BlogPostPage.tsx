import { useParams, Link } from 'react-router-dom'
import { getPostBySlug } from '../lib/markdown'
import { MarkdownRenderer } from '../components/blog/MarkdownRenderer'

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug) : undefined

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-4">Post not found</h1>
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
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        to="/blog"
        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-6 inline-block"
      >
        &larr; Back to blog
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{post.title}</h1>
        <time className="text-sm text-[var(--color-text-muted)]">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </header>

      <MarkdownRenderer content={post.content} />
    </div>
  )
}
