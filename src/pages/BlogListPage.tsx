import { Link } from 'react-router-dom'
import { getAllPosts } from '../lib/markdown'

function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 230))
  return `${minutes} min read`
}

export function BlogListPage() {
  const posts = getAllPosts()

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 animate-page-in">
      <p className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-widest mb-3">
        Blog
      </p>
      <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-text)] mb-3">
        Writing
      </h1>
      <p className="text-[var(--color-text-muted)] mb-12 max-w-lg">
        Thoughts on AI systems, engineering culture, and building things that work.
      </p>

      <div className="space-y-0 divide-y divide-[var(--color-border)]">
        {posts.map((post) => (
          <article key={post.slug}>
            <Link to={`/blog/${post.slug}`} className="group block py-6">
              <div className="flex items-center gap-3 mb-2">
                <time className="text-xs font-mono text-[var(--color-text-muted)]">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
                <span className="text-[var(--color-border)]">/</span>
                <span className="text-xs font-mono text-[var(--color-text-muted)]">
                  {readingTime(post.content)}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{post.description}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
