export function ManifestoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 animate-page-in">
      <div className="mb-12">
        <p className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-widest mb-3">
          Philosophy
        </p>
        <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-text)] mb-3">
          Engineering-as-Code Manifesto
        </h1>
      </div>

      <div className="prose prose-lg max-w-none">
        <p>
          We're brilliant engineers — experts in thermodynamics, mechanics, simulations, design. Yet we
          wrestle with Word docs, Excel sheets, endless email chains. We duplicate files, lose track of
          revisions, spend more time tracking changes than innovating.
        </p>

        <p>Time to reclaim our craft.</p>

        <p><strong>Engineering should be:</strong></p>
        <ul>
          <li>Paper-and-pen thinking</li>
          <li>Converting thoughts to code</li>
          <li>Building on others' work</li>
          <li><strong>Doing everything once</strong></li>
        </ul>

        <hr />

        <h2>Version Everything</h2>
        <p>
          <strong>Stop emailing "report_v2_final_rev.xlsx"</strong>
          <br />
          Design files, scripts, docs together in Git.
        </p>
        <p>
          <strong>Every change traceable</strong>
          <br />
          Pull requests = peer reviews. No guessing who changed what, when, why.
        </p>

        <h2>Code Everything</h2>
        <p>
          <strong>Parameterize</strong>
          <br />
          Code-driven models, not manual tables. Change once, pipelines regenerate results, diagrams, reports.
        </p>
        <p>
          <strong>Automate</strong>
          <br />
          CI/CD with GitHub Actions: tests, docs, notifications — automatic.
        </p>

        <h2>Use AI</h2>
        <p>
          <strong>Smart assistants</strong>
          <br />
          AI agents (RAG, LangChain, SmolAgents) draft scripts, validate conditions, summarize results.
        </p>
        <p>
          <strong>Insight over inbox</strong>
          <br />
          Ask AI for project status. Get instant briefing.
        </p>

        <h2>Clean Data</h2>
        <p>
          <strong>Monorepo</strong>
          <br />
          Simulations, CAD, reports — one place. Clean, versioned data = fewer errors, faster onboarding.
        </p>
        <p>
          <strong>Interoperability</strong>
          <br />
          Custom connectors feed simulation outputs to AI, dashboards, tools.
        </p>

        <h2>Continuous Improvement</h2>
        <p>
          <strong>Shared libraries</strong>
          <br />
          Everyone contributes: meshing scripts, post-processing, visualizations.
        </p>
        <p>
          <strong>Iterate fast</strong>
          <br />
          Lightweight pipelines. New ideas in minutes. Fail fast, learn faster.
        </p>
      </div>
    </div>
  )
}
