import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Blog' },
  { to: '/consulting', label: 'Consulting' },
  { to: '/manifesto', label: 'Manifesto' },
  { to: '/books', label: 'Books' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-5xl px-6 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="group flex items-center gap-2 transition-colors"
        >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-[var(--color-accent)] text-white text-xs font-bold font-mono leading-none">
            CA
          </span>
          <span className="text-sm font-medium text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors hidden sm:inline">
            Charles Azam
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded text-sm transition-colors ${
                  isActive
                    ? 'text-[var(--color-accent)] bg-[var(--color-accent-light)] font-medium'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-[var(--color-border)] px-6 py-3 space-y-1 bg-[var(--color-bg-secondary)]">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded text-sm transition-colors ${
                  isActive
                    ? 'text-[var(--color-accent)] bg-[var(--color-accent-light)] font-medium'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
