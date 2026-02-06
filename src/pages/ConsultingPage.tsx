export function ConsultingPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Consulting</h1>
      <p className="text-[var(--color-text-muted)] mb-10">
        Selective projects in AI and automation, particularly traditional industries modernizing technical workflows.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-4">Experience</h2>
        <p className="mb-4">
          <span className="text-white font-medium">Jimmy Energy (CIO, 2022-2024)</span>
          <br />
          Led transition from legacy PLM to code-driven engineering platform. Understand both technical
          challenges and organizational dynamics of AI adoption in traditional industries.
        </p>
        <p className="mb-4">
          <span className="text-white font-medium">Production focus:</span> Build live systems
          (Predibench, Webportal, OmniAgents), not proof-of-concepts.
        </p>
        <ul className="list-disc list-inside space-y-1 text-[var(--color-text)]">
          <li>AI agent infrastructure</li>
          <li>Engineering-as-Code transformations</li>
          <li>RAG systems for technical domains</li>
          <li>DevOps, CI/CD, cloud architecture</li>
          <li>Team leadership and roadmapping</li>
        </ul>
      </section>

      <section className="mb-10 border-t border-[var(--color-border)] pt-10">
        <h2 className="text-xl font-semibold text-white mb-4">Approach</h2>
        <p className="text-white font-medium mb-2">Understand the real problem</p>
        <p className="mb-4">Immersion in workflows. Identify high-impact opportunities.</p>
        <p>
          Most companies will try to sell you their very generalistic solution. But each company has a
          very specific situation and to yield the best results, we need to understand the specific
          situation and to tailor the solution to the specific situation.
        </p>
      </section>

      <section className="border-t border-[var(--color-border)] pt-10">
        <h2 className="text-xl font-semibold text-white mb-4">Availability</h2>
        <p className="mb-4">
          Primarily focused on open-source tools and hard technical problems. Consulting engagements
          selective — projects aligned with making AI succeed at complex engineering tasks.
        </p>
        <a
          href="mailto:azamcharles0@gmail.com"
          className="inline-block text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
        >
          azamcharles0@gmail.com
        </a>
      </section>
    </div>
  )
}
