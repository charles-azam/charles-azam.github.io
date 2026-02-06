import { books } from '../content/books'

export function BooksPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 animate-page-in">
      <p className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-widest mb-3">
        Reading
      </p>
      <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-text)] mb-3">
        Books
      </h1>
      <p className="text-[var(--color-text-muted)] mb-12 max-w-lg">
        A curated list of books that shaped my thinking.
      </p>

      <div className="space-y-3">
        {books.map((book) => (
          <div
            key={book.title}
            className="flex items-baseline gap-3 py-2"
          >
            <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] shrink-0 relative top-[-2px]" />
            <span className="leading-relaxed">
              <em className="text-[var(--color-text)] font-medium not-italic font-[var(--font-display)]">
                {book.title}
              </em>
              {book.originalTitle && (
                <span className="text-sm text-[var(--color-text-muted)]"> ({book.originalTitle})</span>
              )}
              <span className="text-sm text-[var(--color-text-muted)]"> — {book.author}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
