# Projects

My work focuses on **making AI succeed in complex engineering and technical tasks**. This theme connects all my projects—from transforming traditional engineering workflows to building infrastructure for AI agents.

---

## Jimmy Energy: Engineering-as-Code Transformation

**Role:** CIO (2022-2024)

**Challenge:** Traditional engineering companies rely on legacy PLM systems, siloed tools, and manual document management. Engineers spend more time managing files than doing engineering.

**Solution:** Led my team to rebuild the entire engineering workflow from scratch:
- Migrated all engineering data to a single Git monorepo
- Built custom Python tools (PyJimmy) to replace legacy PLM
- Enabled version control for all engineering artifacts (models, simulations, docs)
- Integrated AI capabilities directly into engineering workflows

**Impact:**
- Entire engineering team working from a unified codebase
- Cleaner, versioned data enabling AI integration
- Engineers spending more time on actual engineering

**Tech:** Python, Git, AWS, CI/CD, GitHub Actions

---

## OmniAgents: Unified AI Coding Agent Interface

[GitHub](https://github.com/charles-azam/OmniAgents) | **Status:** Active development

**Problem:** Building AI coding agents requires choosing between fragmented execution environments (local, Docker, E2B) and AI frameworks (smolagents, Pydantic-AI, LangChain). Each combination requires different code.

**Solution:** A unified interface that abstracts away execution environments and AI frameworks, letting developers focus on agent logic instead of infrastructure.

**Features:**
- Support for multiple execution environments (Local, Docker, E2B)
- Compatible with multiple AI frameworks (smolagents, Pydantic-AI, LangChain)
- Clean API for building production-grade AI coding agents
- Easy switching between environments for development and production

**Why it matters:** AI agent development is held back by infrastructure fragmentation. OmniAgents solves this.

**Tech:** Python, Docker, E2B, smolagents, Pydantic-AI, LangChain

---

## Predibench: AI Agents on Prediction Markets

[Live Platform](https://predibench.com) | [GitHub](https://github.com/charles-azam/predibench) | [HuggingFace Article](https://huggingface.co/blog/charles-azam/predibench)

**Concept:** Can AI models beat humans at forecasting real-world events? Test them on Polymarket.

**What it does:**
- Benchmarks AI models on real-world prediction markets
- Agents make forecasts on Polymarket events
- Tracks performance against human forecasters
- Public leaderboard showing which models perform best

**Why it matters:** Most AI benchmarks use static datasets. Prediction markets provide real-time, real-stakes evaluation of AI reasoning capabilities.

**Status:** Live platform with active testing

**Tech:** Python, Polymarket API, RAG, LLM agents

---

## Webportal: Web Interface for AI Agents

[Live Platform](https://webportal-468213.web.app) | [GitHub](https://github.com/aymeric-roucher/webportal)

**Achievement:** 3rd place at HuggingFace x Anthropic AI Agent Hackathon

**Problem:** AI agents struggle with web interaction—they need better tools to navigate, extract, and interact with web content.

**Solution:** A web platform designed specifically for AI agent interaction with the web.

**Tech:** Firebase, Web APIs, AI agents

---

## DeepDraft: AI for Technical Documentation

[Website](https://deepdraft.dev) | **Status:** Work in progress

**Vision:** AI tools that can generate engineering design documents, technical reports, diagrams, and plans.

**Challenge:** Most AI writing tools work for blog posts and marketing copy. Technical documentation requires understanding of engineering concepts, scientific reasoning, and domain expertise.

**Approach:** Deep search specialized in scientific and technical questions, combined with document generation capabilities.

**Tech:** Python, RAG, LLM agents, technical document processing

---

## Pyforge: Engineering-as-Code Library

[GitHub](https://github.com/charles-azam/pyforge)

**What it is:** A minimalist Python library for managing engineering projects using Git workflows.

**Philosophy:** Engineering should be code. Models, simulations, and documentation should be versioned, tested, and automated like software.

**Use case:** Born from the Jimmy Energy transformation, Pyforge codifies the patterns we developed for engineering-as-code.

**Features:**
- Git-based version control for engineering artifacts
- Python API for managing models and simulations
- Integration with standard engineering tools
- Lightweight and focused on simplicity

**Tech:** Python, Git

---

## AIEngineer: AI Agent for Engineering Projects

[GitHub](https://github.com/charles-azam/aiengineer)

**Concept:** If engineering can be code (Pyforge), can AI generate it automatically?

**What it does:** An AI agent that scaffolds engineering projects following Pyforge conventions.

**Approach:** Uses Aider to programmatically generate code for engineering projects.

**Status:** Experimental—learning what AI can and can't do for complex engineering tasks.

**Tech:** Python, Aider, Pyforge, LLM agents

---

## The Unifying Thread

All these projects stem from one question: **How do we make AI work for hard, technical problems?**

- **Jimmy Energy** proved traditional engineering can become code-driven
- **Pyforge** codified those patterns
- **AIEngineer** tested if AI could generate engineering code
- **OmniAgents** builds infrastructure for production AI agents
- **Predibench** evaluates AI on real-world reasoning tasks
- **Webportal** improves AI agent capabilities
- **DeepDraft** pushes AI into technical documentation

This isn't just about demos—it's about pushing AI to handle the complexity of real engineering and scientific work.