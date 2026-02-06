import { books } from '../content/books'

export function BooksPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Books</h1>
      <p className="text-[var(--color-text-muted)] mb-10">A curated list of my favorite books.</p>

      <ul className="space-y-3">
        {books.map((book) => (
          <li key={book.title} className="flex items-baseline gap-2">
            <span className="text-[var(--color-accent)]">-</span>
            <span>
              <em className="text-white">{book.title}</em>
              {book.originalTitle && (
                <span className="text-[var(--color-text-muted)]"> ({book.originalTitle})</span>
              )}
              <span className="text-[var(--color-text-muted)]">, {book.author}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
