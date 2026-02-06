export function ConsultingPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 animate-page-in">
      <p className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-widest mb-3">
        Services
      </p>
      <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-text)] mb-3">
        Consulting
      </h1>
      <p className="text-[var(--color-text-muted)] mb-12 max-w-lg">
        Selective projects in AI and automation, particularly traditional industries modernizing technical workflows.
      </p>

      <div className="space-y-10">
        <section className="p-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <h2 className="font-[var(--font-display)] text-xl text-[var(--color-text)] mb-4">Experience</h2>
          <p className="mb-4 leading-relaxed">
            <span className="text-[var(--color-text)] font-semibold">Jimmy Energy (CIO, 2022-2024)</span>
            <br />
            Led transition from legacy PLM to code-driven engineering platform. Understand both technical
            challenges and organizational dynamics of AI adoption in traditional industries.
          </p>
          <p className="mb-4 leading-relaxed">
            <span className="text-[var(--color-text)] font-semibold">Production focus:</span> Build live systems
            (Predibench, Webportal, OmniAgents), not proof-of-concepts.
          </p>
          <ul className="space-y-1.5 text-sm text-[var(--color-text-muted)]">
            {[
              'AI agent infrastructure',
              'Engineering-as-Code transformations',
              'RAG systems for technical domains',
              'DevOps, CI/CD, cloud architecture',
              'Team leadership and roadmapping',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="p-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <h2 className="font-[var(--font-display)] text-xl text-[var(--color-text)] mb-4">Approach</h2>
          <p className="text-[var(--color-text)] font-semibold mb-2">Understand the real problem</p>
          <p className="mb-4 leading-relaxed">Immersion in workflows. Identify high-impact opportunities.</p>
          <p className="leading-relaxed text-[var(--color-text-muted)]">
            Most companies will try to sell you their very generalistic solution. But each company has a
            very specific situation and to yield the best results, we need to understand the specific
            situation and to tailor the solution to the specific situation.
          </p>
        </section>

        <section className="p-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <h2 className="font-[var(--font-display)] text-xl text-[var(--color-text)] mb-4">Availability</h2>
          <p className="mb-4 leading-relaxed">
            Primarily focused on open-source tools and hard technical problems. Consulting engagements
            selective — projects aligned with making AI succeed at complex engineering tasks.
          </p>
          <a
            href="mailto:azamcharles0@gmail.com"
            className="inline-flex items-center gap-2 font-mono text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] link-underline transition-colors"
          >
            azamcharles0@gmail.com
          </a>
        </section>
      </div>
    </div>
  )
}
