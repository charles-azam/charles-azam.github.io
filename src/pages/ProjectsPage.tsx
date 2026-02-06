import { projects } from '../content/projects'

export function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">Projects</h1>
      <p className="text-[var(--color-text-muted)] mb-10">
        Making AI work for complex engineering and technical problems.
      </p>

      <div className="space-y-10">
        {projects.map((project) => (
          <article key={project.title} className="border-b border-[var(--color-border)] pb-10 last:border-b-0">
            <div className="flex items-baseline gap-3 mb-2 flex-wrap">
              <h2 className="text-xl font-semibold text-[var(--color-text)]">{project.title}</h2>
              {project.role && project.period && (
                <span className="text-sm text-[var(--color-text-muted)]">
                  {project.role} ({project.period})
                </span>
              )}
              {project.status && (
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-bg-secondary)] text-[var(--color-accent)] border border-[var(--color-border)]">
                  {project.status}
                </span>
              )}
            </div>
            <p className="text-[var(--color-text-muted)] text-sm mb-3">{project.tagline}</p>
            <p className="mb-3">{project.description}</p>
            {project.impact && (
              <p className="text-sm text-[var(--color-text-muted)] mb-3">
                <span className="text-[var(--color-text)] font-medium">Impact:</span> {project.impact}
              </p>
            )}
            <p className="text-sm text-[var(--color-text-muted)] mb-3">
              <span className="text-[var(--color-text)] font-medium">Stack:</span> {project.stack}
            </p>
            <div className="flex gap-4">
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target={link.url.startsWith('/') ? undefined : '_blank'}
                  rel={link.url.startsWith('/') ? undefined : 'noopener noreferrer'}
                  className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
