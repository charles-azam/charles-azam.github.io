const links = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/charles-azam-a4223b135/' },
  { label: 'GitHub', href: 'https://github.com/charles-azam' },
  { label: 'HuggingFace', href: 'https://huggingface.co/charles-azam' },
  { label: 'Email', href: 'mailto:azamcharles0@gmail.com' },
]

export function Footer() {
  return (
    <footer className="mt-auto bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-5xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[var(--color-text-muted)]">
          Charles Azam
        </p>
        <div className="flex gap-5">
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              className="text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
