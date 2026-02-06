export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-auto">
      <div className="mx-auto max-w-5xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          Charles AZAM
        </p>
        <div className="flex gap-6">
          <a
            href="https://www.linkedin.com/in/charles-azam-a4223b135/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/charles-azam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://huggingface.co/charles-azam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
          >
            HuggingFace
          </a>
          <a
            href="mailto:azamcharles0@gmail.com"
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}
