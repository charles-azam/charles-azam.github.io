---
title: "I Accidentally Rebuilt OpenHands From Scratch -- Here's What I Learned"
title_fr: "J'ai accidentellement reconstruit OpenHands à partir de zéro — voici ce que j'ai appris"
date: "2026-01-02"
description: "Building omniagents, a ~2000-line Python framework for multi-tenant AI coding agents, only to discover OpenHands already existed. Lessons on agent architecture, isolation, persistence, and costs."
description_fr: "Comment j'ai construit omniagents, un framework Python de ~2000 lignes pour des agents de codage IA multi-tenants, pour découvrir qu'OpenHands existait déjà. Leçons sur l'architecture des agents, l'isolation, la persistance et les coûts."
slug: "rebuilt-openhands"
---

## The Problem I Was Trying to Solve

Building a SaaS where users describe features in plain English and AI agents write code requires solving three challenges:

1. **User isolation** -- User A's code can't leak to User B
2. **Persistence** -- Users expect work to persist across sessions
3. **Security** -- Untrusted code can't run dangerous commands on production servers

Existing solutions didn't combine all three: tools + isolated execution + session persistence.

---

## What I Built

### 10 Coding Tools (Inspired by Gemini CLI)

```python
from omniagents.tools.write_file_tool import WriteFileTool
from omniagents.tools.read_file_tool import ReadFileTool
from omniagents.tools.run_shell_command_tool import RunShellCommandTool
from omniagents.tools.glob_tool import GlobTool
from omniagents.tools.search_file_content_tool import SearchFileContentTool
from omniagents.tools.replace_tool import ReplaceTool
# + 4 more
```

Framework-agnostic tools that don't depend on LangChain or smolagents.

### 3 Execution Backends

```python
from omniagents.backends.local_backend import LocalBackend      # Your machine
from omniagents.backends.docker_backend import DockerBackend    # Isolated container
from omniagents.backends.e2b_backend import E2BBackend          # Cloud sandbox
```

Same tools, different environments. Swap backends without changing agent logic.

### 3 State Managers

```python
from omniagents.backends.state_manager import (
    NoOpStateManager,    # No persistence
    GitStateManager,     # Save to GitHub branches
    GCSStateManager,     # Save to Google Cloud Storage
)
```

---

## The Multi-Tenant Pattern

**Core insight:** One backend per user, identified by `project_id`.

```python
def get_agent_for_user(user_id: str):
    backend = DockerBackend(
        project_id=f"user-{user_id}",      # Unique per user
        state_manager=GCSStateManager(),    # Persists to cloud
    )
    backend.start()  # Loads previous state if exists

    return LangChainAgent(
        backend=backend,
        model=ChatOpenAI(model="gpt-4"),
        preset=PythonUVPreset(),
    )

# Alice gets her own container + persistent storage
alice = get_agent_for_user("alice")
alice.run("Create a Flask app")
alice.backend.shutdown()  # Saves to GCS

# Bob is completely isolated
bob = get_agent_for_user("bob")
bob.run("Build a CLI tool")
bob.backend.shutdown()

# Alice returns tomorrow -- her Flask app is still there
alice = get_agent_for_user("alice")
alice.run("Add authentication")
```

---

## Framework Agnostic by Design

Same tools work with any framework:

```python
agent = LangChainAgent(backend=backend, model=model, preset=preset)
agent = PydanticAIAgent(backend=backend, model=model, preset=preset)
agent = SmolagentsAgent(backend=backend, model=model, preset=preset)
```

Each tool has conversion methods (`to_langchain_tool()`, `to_pydantic_ai_tool()`, `to_smolagents_tool()`).

---

## The Architecture

```
+------------------------------------------+
|         Your LLM Framework               |
|   (LangChain, Pydantic-AI, smolagents)   |
+--------------------+---------------------+
                     |
+--------------------v---------------------+
|            10 Core Tools                 |
|  (framework-agnostic, just functions)    |
+--------------------+---------------------+
                     |
+--------------------v---------------------+
|        Execution Backend                 |
|     (Local, Docker, or E2B)              |
+--------------------+---------------------+
                     |
+--------------------v---------------------+
|          State Manager                   |
|      (Git, GCS, or nothing)              |
+------------------------------------------+
```

Each layer is swappable.

---

## What I Learned

### You Can Do a Lot with a Few Tools

All coding agents use roughly the same core tools (read file, write file, run command). Quality varies based on attention to detail.

Best agents also implement:
- **Empowering tools** (browsing, search, etc.)
- **Task Tracker Tool** (Plan Mode)
- **Think Tool** (for complex reasoning)
- **Delegate Tool** (sub-agents for complex tasks)

### Agent Frameworks Help You Start, Not Finish

Frameworks (smolagents, LangChain, Pydantic-AI) are great for prototyping, but hit walls when you need customization. A basic agent loop is only ~50 lines of code. When you own it, customization is trivial.

**Recommendation:** Use a framework to validate your idea, then rewrite the core loop yourself for control.

### Where the Costs Come From

**LLM costs:** Proprietary models (GPT-4, Claude) add up fast. Open-source alternatives via HuggingFace providers (Groq, Cerebras) offer better rates and rate limits.

**Compute options:**
- **E2B** -- Handles everything but expensive, Python-only
- **Local Docker on EC2** -- Predictable pricing, full control, security concerns with untrusted code
- **Fly.io or Modal** -- Per-request scaling, mid-range cost

For side projects: start with local Docker. For production: explore Fly.io.

### State Persistence Is Underrated

Real products need persistence for:
- Resuming work
- Debugging previous state
- Billing tied to artifacts

Git-based storage works well for small projects (free, version-controlled). GCS for larger files.

### OpenHands Exists (And That's OK)

OpenHands is an **application** (full product to deploy). Omniagents is a **library** (primitives to compose). Different goals.

---

## Try It

```bash
uv add git+https://github.com/charles-azam/omniagents.git
```

```python
from omniagents.backends.local_backend import LocalBackend
from omniagents.backends.state_manager import NoOpStateManager
from omniagents.tools.write_file_tool import WriteFileTool
from omniagents.tools.run_shell_command_tool import RunShellCommandTool

backend = LocalBackend(project_id="demo", state_manager=NoOpStateManager())
backend.start()

write = WriteFileTool(backend=backend)
write.execute(absolute_path="hello.py", content="print('Hello from Omniagents!')")

shell = RunShellCommandTool(backend=backend)
result = shell.execute(command="python hello.py")
print(result.content)  # "Hello from Omniagents!"

backend.shutdown()
```

---

## What's Next?

Plans include:
- Fly.io backend
- MCP server interface for Claude Desktop integration

---

## Links

- [Omniagents on GitHub](https://github.com/charles-azam/omniagents)
- [OpenHands on GitHub](https://github.com/All-Hands-AI/OpenHands)
- [Documentation](https://github.com/charles-azam/omniagents/tree/main/docs)
