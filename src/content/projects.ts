export interface Project {
  title: string
  role?: string
  period?: string
  tagline: string
  description: string
  impact?: string
  stack: string
  links: { label: string; url: string }[]
  status?: string
}

export const projects: Project[] = [
  {
    title: 'Jimmy Energy',
    role: 'CIO',
    period: '2022-2025',
    tagline: 'Engineering-as-Code transformation',
    description:
      'Transformed traditional engineering company to Git-based workflow. Replaced legacy PLM with custom Python tools (PyJimmy). Entire engineering team now works from unified codebase with version control, CI/CD, and AI integration.',
    impact:
      'Engineers spend time engineering instead of managing files. Clean, versioned data enables AI workflows.',
    stack: 'Python, Git, AWS, GitHub Actions',
    links: [{ label: 'Website', url: 'https://www.jimmy-energy.eu' }],
  },
  {
    title: 'OmniAgents',
    tagline: 'Unified interface for AI coding agents',
    description:
      'Unified interface for AI coding agents across execution environments (Local, Docker, E2B) and frameworks (smolagents, Pydantic-AI, LangChain).',
    stack: 'Python, Docker, E2B',
    links: [{ label: 'GitHub', url: 'https://github.com/charles-azam/OmniAgents' }],
    status: 'Active development',
  },
  {
    title: 'Predibench',
    tagline: 'Benchmark AI on real-world prediction markets',
    description:
      'Benchmark AI models on real-world prediction markets. Live platform testing if AI can beat humans at forecasting.',
    stack: 'Python, Polymarket API, RAG',
    links: [
      { label: 'Platform', url: 'https://predibench.com' },
      { label: 'GitHub', url: 'https://github.com/charles-azam/predibench' },
      { label: 'Article', url: '/blog/predibench' },
    ],
  },
  {
    title: 'Webportal',
    tagline: 'Web interface for AI agents',
    description:
      'Web interface for AI agents. Built at HuggingFace x Anthropic hackathon (3rd place).',
    stack: 'Firebase, Web APIs',
    links: [
      { label: 'Platform', url: 'https://webportal-468213.web.app' },
      { label: 'GitHub', url: 'https://github.com/aymeric-roucher/webportal' },
    ],
  },
  {
    title: 'DeepDraft',
    tagline: 'AI tool for technical documentation',
    description:
      'AI tool for technical documentation — design docs, reports, diagrams, plans. Deep search specialized in scientific questions.',
    stack: 'Python, RAG, LLM agents',
    links: [{ label: 'Website', url: 'https://deepdraft.dev' }],
    status: 'Work in progress',
  },
  {
    title: 'Pyforge',
    tagline: 'Minimalist Python library for engineering-as-code',
    description:
      'Version control for engineering artifacts — models, simulations, docs. Born from Jimmy Energy transformation.',
    stack: 'Python, Git',
    links: [{ label: 'GitHub', url: 'https://github.com/charles-azam/pyforge' }],
  },
  {
    title: 'AIEngineer',
    tagline: 'AI agent for engineering project scaffolding',
    description:
      'AI agent that scaffolds engineering projects following Pyforge conventions. Uses Aider to programmatically generate code.',
    stack: 'Python, Aider, Pyforge',
    links: [{ label: 'GitHub', url: 'https://github.com/charles-azam/aiengineer' }],
    status: 'Experimental',
  },
]
