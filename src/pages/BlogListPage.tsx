import { Link } from 'react-router-dom'
import { getAllPosts } from '../lib/markdown'

export function BlogListPage() {
  const posts = getAllPosts()

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">Blog</h1>
      <p className="text-[var(--color-text-muted)] mb-10">
        Writing about AI, engineering, and building things.
      </p>

      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="border-b border-[var(--color-border)] pb-8 last:border-b-0">
            <Link to={`/blog/${post.slug}`} className="group block">
              <h2 className="text-xl font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors mb-2">
                {post.title}
              </h2>
              <time className="text-sm text-[var(--color-text-muted)] block mb-2">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <p className="text-[var(--color-text-muted)]">{post.description}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
