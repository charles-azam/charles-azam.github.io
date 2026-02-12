export interface Subproject {
  title: string
  description: string
  description_fr?: string
  url: string
}

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
  subprojects?: Subproject[]
  status?: string
  status_fr?: string
}

export const projects: Project[] = [
  {
    title: 'CLIArena',
    tagline: 'Benchmarking CLI coding agents — and forking them',
    tagline_fr: 'Benchmarking des agents de codage CLI — et leurs forks',
    description:
      'Read the codebases of Codex, Gemini CLI, Mistral Vibe, and OpenCode, then forked three of them to run GLM-4.7 on Terminal-Bench 2.0. Same model, 2x performance gap — the scaffolding is what matters. Also benchmarked all four agents on an unpublished NP-hard optimization problem; Claude Code beat my 8-year-old C++ solution. Forks now updated to support GLM-5.',
    description_fr:
      "Lecture des codebases de Codex, Gemini CLI, Mistral Vibe et OpenCode, puis fork de trois d'entre eux pour exécuter GLM-4.7 sur Terminal-Bench 2.0. Même modèle, écart de performance 2x — c'est le scaffolding qui compte. Benchmark des quatre agents sur un problème d'optimisation NP-difficile non publié ; Claude Code a battu ma solution C++ vieille de 8 ans. Forks désormais mis à jour pour supporter GLM-5.",
    stack: 'Python, Rust, TypeScript, Docker, Harbor',
    links: [
      { label: 'GitHub', url: 'https://github.com/charles-azam/CLIArena' },
      { label: 'Deep Dive Article', label_fr: 'Article Deep Dive', url: '/blog/deepdive-benchmark' },
      { label: 'KIRO Article', label_fr: 'Article KIRO', url: '/blog/kiro-benchmark' },
    ],
    subprojects: [
      {
        title: 'codex-zai',
        description: 'Fork of OpenAI Codex with GLM-5 support. Hardest fork — full Responses API translation across 52 Rust crates.',
        description_fr: "Fork d'OpenAI Codex avec support GLM-5. Fork le plus difficile — traduction complète de l'API Responses à travers 52 crates Rust.",
        url: 'https://github.com/charles-azam/codex-zai',
      },
      {
        title: 'gemini-cli-zai',
        description: 'Fork of Gemini CLI with GLM-5 support. 812-line content generator bridging Google and OpenAI protocol formats.',
        description_fr: 'Fork de Gemini CLI avec support GLM-5. Générateur de contenu de 812 lignes reliant les formats de protocole Google et OpenAI.',
        url: 'https://github.com/charles-azam/gemini-cli-zai',
      },
      {
        title: 'mistral-vibe-zai',
        description: 'Fork of Mistral Vibe with GLM-5 support. Easiest fork — clean adapter pattern, 13 files changed, one commit.',
        description_fr: 'Fork de Mistral Vibe avec support GLM-5. Fork le plus simple — pattern adapter propre, 13 fichiers modifiés, un commit.',
        url: 'https://github.com/charles-azam/mistral-vibe-zai',
      },
    ],
  },
  {
    title: 'OmniAgents',
    tagline: 'Unified interface for AI coding agents',
    tagline_fr: 'Interface unifiée pour les agents de codage IA',
    description:
      'Unified interface for AI coding agents across execution environments (Local, Docker, E2B) and frameworks (smolagents, Pydantic-AI, LangChain). No longer actively developed — the exploration led to rebuilding OpenHands from scratch to understand agent internals.',
    description_fr:
      "Interface unifiée pour les agents de codage IA à travers les environnements d'exécution (Local, Docker, E2B) et les frameworks (smolagents, Pydantic-AI, LangChain). Plus maintenu activement — l'exploration a mené à la reconstruction d'OpenHands from scratch pour comprendre les mécanismes internes des agents.",
    stack: 'Python, Docker, E2B',
    links: [
      { label: 'GitHub', url: 'https://github.com/charles-azam/OmniAgents' },
      { label: 'Article', url: '/blog/rebuilt-openhands' },
    ],
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
    title: 'Jimmy Energy',
    role: 'Head of Software — Comex member',
    period: '2022-2025',
    tagline: 'Engineering-as-Code transformation',
    tagline_fr: 'Transformation Engineering-as-Code',
    description:
      'As a director and Comex member, built and led the software team that transformed a traditional engineering company to a Git-based workflow. Replaced legacy PLM with custom Python tools (PyJimmy). Entire engineering team now works from unified codebase with version control, CI/CD, and AI integration.',
    description_fr:
      "En tant que directeur et membre du Comex, j'ai constitué et dirigé l'équipe logicielle qui a transformé une entreprise d'ingénierie traditionnelle vers un flux de travail basé sur Git. Remplacement du PLM hérité par des outils Python personnalisés (PyJimmy). Toute l'équipe d'ingénierie travaille désormais à partir d'une base de code unifiée avec contrôle de version, CI/CD et intégration de l'IA.",
    impact:
      'Engineers spend time engineering instead of managing files. Clean, versioned data enables AI workflows.',
    impact_fr:
      "Les ingénieurs consacrent leur temps à l'ingénierie plutôt qu'à la gestion de fichiers. Des données propres et versionnées permettent des flux de travail IA.",
    stack: 'Python, Git, AWS, GitHub Actions',
    links: [{ label: 'Website', label_fr: 'Site web', url: 'https://www.jimmy-energy.eu' }],
  },
  {
    title: 'Webportal',
    tagline: 'Web browsing for AI agents via VLM parsing',
    tagline_fr: "Navigation web pour agents IA via parsing VLM",
    description:
      'A web parser using a VLM to analyze pages and backend requests, providing a digested format to LLMs for autonomous web browsing. Built at HuggingFace x Anthropic hackathon (3rd place).',
    description_fr:
      "Un parseur web utilisant un VLM pour analyser les pages et les requêtes backend, fournissant un format digéré aux LLMs pour la navigation web autonome. Construit lors du hackathon HuggingFace x Anthropic (3ème place).",
    stack: 'Firebase, Web APIs, VLM',
    links: [
      { label: 'Platform', label_fr: 'Plateforme', url: 'https://webportal-468213.web.app' },
      { label: 'GitHub', url: 'https://github.com/aymeric-roucher/webportal' },
    ],
  },
  {
    title: 'HuggingFace x Anthropic Hackathon — Travel Booking Agent',
    tagline: 'AI agent that books real travel through a browser (3rd place)',
    tagline_fr: 'Agent IA qui réserve de vrais voyages via un navigateur (3ème place)',
    description:
      'A travel booking agent using smolagents and browser-use. Won 3rd place at the HuggingFace x Anthropic hackathon.',
    description_fr:
      'Un agent de réservation de voyage utilisant smolagents et browser-use. 3ème place au hackathon HuggingFace x Anthropic.',
    stack: 'Python, smolagents, browser-use',
    links: [
      { label: 'GitHub', url: 'https://github.com/charles-azam/hackathon-huggingface' },
    ],
  },
  {
    title: 'DeepDraft',
    tagline: 'Forcing AI agents to follow scientific reasoning',
    tagline_fr: "Forcer les agents IA à suivre un raisonnement scientifique",
    description:
      'The objective was to force agents to follow a rigorous scientific reasoning process to answer questions. If rebuilt today, would be based on an open-source CLI agent like Mistral Vibe or Codex.',
    description_fr:
      "L'objectif était de forcer les agents à suivre un processus de raisonnement scientifique rigoureux pour répondre aux questions. Si c'était à refaire aujourd'hui, serait basé sur un agent CLI open-source comme Mistral Vibe ou Codex.",
    stack: 'Python, RAG, LLM agents',
    links: [{ label: 'Website', label_fr: 'Site web', url: 'https://deepdraft.dev' }],
  },
  {
    title: 'Pyforge',
    tagline: 'Minimalist Python library for engineering-as-code',
    tagline_fr: "Bibliothèque Python minimaliste pour l'engineering-as-code",
    description:
      'Version control for engineering artifacts — models, simulations, docs. An example of engineering-as-code: treating engineering data with the same rigor as software.',
    description_fr:
      "Contrôle de version pour les artefacts d'ingénierie — modèles, simulations, docs. Un exemple d'engineering-as-code : traiter les données d'ingénierie avec la même rigueur que le logiciel.",
    stack: 'Python, Git',
    links: [{ label: 'GitHub', url: 'https://github.com/charles-azam/pyforge' }],
  },
  {
    title: 'AIEngineer',
    tagline: 'AI agent for engineering project scaffolding',
    tagline_fr: "Agent d'IA pour le scaffolding de projets d'ingénierie",
    description:
      "My first project with AI agents. Used Aider to programmatically generate code for engineering projects. With today's knowledge, would simply build a tool-using agent directly instead of relying on Aider's approach.",
    description_fr:
      "Mon premier projet avec des agents IA. Utilisait Aider pour générer du code par programmation pour des projets d'ingénierie. Avec les connaissances d'aujourd'hui, je construirais simplement un agent avec des outils directement plutôt que de m'appuyer sur l'approche d'Aider.",
    stack: 'Python, Aider, Pyforge',
    links: [{ label: 'GitHub', url: 'https://github.com/charles-azam/aiengineer' }],
  },
]
