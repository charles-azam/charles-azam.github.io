export interface Project {
  title: string
  role?: string
  period?: string
  tagline: string
  tagline_fr?: string
  description: string
  description_fr?: string
  impact?: string
  impact_fr?: string
  stack: string
  links: { label: string; label_fr?: string; url: string }[]
  status?: string
  status_fr?: string
}

export const projects: Project[] = [
  {
    title: 'Jimmy Energy',
    role: 'CIO',
    period: '2022-2025',
    tagline: 'Engineering-as-Code transformation',
    tagline_fr: 'Transformation Engineering-as-Code',
    description:
      'Transformed traditional engineering company to Git-based workflow. Replaced legacy PLM with custom Python tools (PyJimmy). Entire engineering team now works from unified codebase with version control, CI/CD, and AI integration.',
    description_fr:
      "Transformation d'une entreprise d'ingénierie traditionnelle vers un flux de travail basé sur Git. Remplacement du PLM hérité par des outils Python personnalisés (PyJimmy). Toute l'équipe d'ingénierie travaille désormais à partir d'une base de code unifiée avec contrôle de version, CI/CD et intégration de l'IA.",
    impact:
      'Engineers spend time engineering instead of managing files. Clean, versioned data enables AI workflows.',
    impact_fr:
      "Les ingénieurs consacrent leur temps à l'ingénierie plutôt qu'à la gestion de fichiers. Des données propres et versionnées permettent des flux de travail IA.",
    stack: 'Python, Git, AWS, GitHub Actions',
    links: [{ label: 'Website', label_fr: 'Site web', url: 'https://www.jimmy-energy.eu' }],
  },
  {
    title: 'OmniAgents',
    tagline: 'Unified interface for AI coding agents',
    tagline_fr: 'Interface unifiée pour les agents de codage IA',
    description:
      'Unified interface for AI coding agents across execution environments (Local, Docker, E2B) and frameworks (smolagents, Pydantic-AI, LangChain).',
    description_fr:
      "Interface unifiée pour les agents de codage IA à travers les environnements d'exécution (Local, Docker, E2B) et les frameworks (smolagents, Pydantic-AI, LangChain).",
    stack: 'Python, Docker, E2B',
    links: [{ label: 'GitHub', url: 'https://github.com/charles-azam/OmniAgents' }],
    status: 'Active development',
    status_fr: 'Développement actif',
  },
  {
    title: 'Predibench',
    tagline: 'Benchmark AI on real-world prediction markets',
    tagline_fr: "Benchmark de l'IA sur les marchés de prédiction réels",
    description:
      'Benchmark AI models on real-world prediction markets. Live platform testing if AI can beat humans at forecasting.',
    description_fr:
      "Évaluation des modèles d'IA sur les marchés de prédiction réels. Plateforme en direct testant si l'IA peut battre les humains en prévision.",
    stack: 'Python, Polymarket API, RAG',
    links: [
      { label: 'Platform', label_fr: 'Plateforme', url: 'https://predibench.com' },
      { label: 'GitHub', url: 'https://github.com/charles-azam/predibench' },
      { label: 'Article', url: '/blog/predibench' },
    ],
  },
  {
    title: 'Webportal',
    tagline: 'Web interface for AI agents',
    tagline_fr: "Interface web pour les agents d'IA",
    description:
      'Web interface for AI agents. Built at HuggingFace x Anthropic hackathon (3rd place).',
    description_fr:
      "Interface web pour les agents d'IA. Construit lors du hackathon HuggingFace x Anthropic (3ème place).",
    stack: 'Firebase, Web APIs',
    links: [
      { label: 'Platform', label_fr: 'Plateforme', url: 'https://webportal-468213.web.app' },
      { label: 'GitHub', url: 'https://github.com/aymeric-roucher/webportal' },
    ],
  },
  {
    title: 'DeepDraft',
    tagline: 'AI tool for technical documentation',
    tagline_fr: "Outil d'IA pour la documentation technique",
    description:
      'AI tool for technical documentation — design docs, reports, diagrams, plans. Deep search specialized in scientific questions.',
    description_fr:
      "Outil d'IA pour la documentation technique — documents de conception, rapports, diagrammes, plans. Recherche approfondie spécialisée dans les questions scientifiques.",
    stack: 'Python, RAG, LLM agents',
    links: [{ label: 'Website', label_fr: 'Site web', url: 'https://deepdraft.dev' }],
    status: 'Work in progress',
    status_fr: 'En cours',
  },
  {
    title: 'Pyforge',
    tagline: 'Minimalist Python library for engineering-as-code',
    tagline_fr: "Bibliothèque Python minimaliste pour l'engineering-as-code",
    description:
      'Version control for engineering artifacts — models, simulations, docs. Born from Jimmy Energy transformation.',
    description_fr:
      "Contrôle de version pour les artefacts d'ingénierie — modèles, simulations, docs. Né de la transformation de Jimmy Energy.",
    stack: 'Python, Git',
    links: [{ label: 'GitHub', url: 'https://github.com/charles-azam/pyforge' }],
  },
  {
    title: 'AIEngineer',
    tagline: 'AI agent for engineering project scaffolding',
    tagline_fr: "Agent d'IA pour le scaffolding de projets d'ingénierie",
    description:
      'AI agent that scaffolds engineering projects following Pyforge conventions. Uses Aider to programmatically generate code.',
    description_fr:
      "Agent d'IA qui génère la structure de projets d'ingénierie suivant les conventions Pyforge. Utilise Aider pour générer du code par programmation.",
    stack: 'Python, Aider, Pyforge',
    links: [{ label: 'GitHub', url: 'https://github.com/charles-azam/aiengineer' }],
    status: 'Experimental',
    status_fr: 'Expérimental',
  },
]
