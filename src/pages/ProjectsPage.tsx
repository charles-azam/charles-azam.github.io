import { projects } from '../content/projects'

export function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 animate-page-in">
      <p className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-widest mb-3">
        Portfolio
      </p>
      <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-text)] mb-3">
        Projects
      </h1>
      <p className="text-[var(--color-text-muted)] mb-12 max-w-lg">
        Making AI work for complex engineering and technical problems.
      </p>

      <div className="space-y-6">
        {projects.map((project) => (
          <article
            key={project.title}
            className="p-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]"
          >
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">{project.title}</h2>
              {project.role && project.period && (
                <span className="text-xs font-mono text-[var(--color-text-muted)]">
                  {project.role} ({project.period})
                </span>
              )}
              {project.status && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-accent-light)] text-[var(--color-accent)]">
                  {project.status}
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--color-text-muted)] italic mb-3">{project.tagline}</p>
            <p className="text-sm mb-3 leading-relaxed">{project.description}</p>
            {project.impact && (
              <p className="text-sm text-[var(--color-text-muted)] mb-3">
                <span className="text-[var(--color-text)] font-medium">Impact:</span> {project.impact}
              </p>
            )}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-[var(--color-border)]">
              <p className="text-xs font-mono text-[var(--color-text-muted)]">
                {project.stack}
              </p>
              <div className="flex gap-3">
                {project.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target={link.url.startsWith('/') ? undefined : '_blank'}
                    rel={link.url.startsWith('/') ? undefined : 'noopener noreferrer'}
                    className="text-sm font-mono text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] link-underline transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
