````markdown
# PyForge

PyForge is a lightweight Python framework for writing technical documentation and system-engineering models as code. Its core philosophy is to maintain a single source of truth—your Python scripts—while enabling multiple output formats (Markdown, HTML, Streamlit, etc.).

---

## Key Features

- **Code-first documents**  
  Write your docs in Python, mixing Markdown strings with programmatic content.
- **System-engineering primitives**  
  Define parameters, hierarchical systems, requirements, and simulations in a structured API.
- **Minimal dependencies**  
  Pure Python + a few small libraries—no heavy toolchain to install.

---

## Installation

**Using `uv`** (recommended for this repo):

```bash
git clone https://github.com/charloupioupiou/pyforge.git
cd pyforge
uv sync
````

**Or via `pip`:**

```bash
git clone https://github.com/charloupioupiou/pyforge.git
cd pyforge
pip install -e .
```

---

## Project Structure

Organize your files by purpose. PyForge will discover and import them in this order:

* **`parameters_*.py`**
  Define engineering parameters (with units).
* **`systems_*.py`**
  Build hierarchical system definitions and attach requirements.
* **`simulation_*.py`**
  Implement computations, simplified physics models, or performance estimates.
* **`tools_*.py`**
  Helpers and domain-specific utilities.
* **`design.py`**
  Main entry point. Imports all other modules and orchestrates the design.

!!! tip
    Any `display()` statements in your modules will be captured and fed into the next iteration of the pipeline. Don’t wrap them in an `if __name__ == "__main__"` guard.

---

## Usage: Defining Systems

```python
from pyforge import Parameters, System, Requirement, Quantity

class BridgeParameters(Parameters):
    length: Quantity        = Quantity(120, "m")
    height: Quantity        = Quantity(15, "m")
    width: Quantity         = Quantity(12, "m")
    deck_thickness: Quantity= Quantity(0.25, "m")
    design_life: int        = 40  # years

BRIDGE = BridgeParameters()

# Root system
bridge = System(name="Bridge")

# Structural subsystem
structural = System(
    name="Structural System",
    description=(
        f"Spans {BRIDGE.length.value}{BRIDGE.length.units}, "
        f"{BRIDGE.height.value}{BRIDGE.height.units} high "
        f"with a {BRIDGE.deck_thickness.value}{BRIDGE.deck_thickness.units} deck."
    ),
    requirements=[
        Requirement(
            name="Load Capacity",
            description=(
                f"Carry traffic safely for {BRIDGE.design_life} years "
                f"across a {BRIDGE.width.value}{BRIDGE.width.units} deck."
            ),
        ),
    ],
)

# Safety subsystem
safety = System(
    name="Safety System",
    description=(
        f"Railing and walkways along the {BRIDGE.length.value}{BRIDGE.length.units} span."
    ),
    requirements=[
        Requirement(
            name="Guardrail Height",
            description=(
                f"Minimum 1.2 m tall railing at "
                f"{BRIDGE.height.value}{BRIDGE.height.units} above ground."
            ),
        ),
    ],
)

# Assemble hierarchy
bridge.add_children(structural, safety)
```

---

## Usage: Writing Documents

Leverage Python logic alongside Markdown-style content. PyForge lets you embed tables, figures, citations, and more.

```python
from pathlib import Path
import pandas as pd
from pyforge.note import (
    Citation, DocumentConfig, Figure, Reference, Table, Title, display
)

# Configure document metadata
config = DocumentConfig(
    title="Example PyForge Document",
    author="Your Name",
    date="2025-05-16"
)
display(config)

# Sample DataFrame
df = pd.DataFrame({
    "Name": ["Alice", "Bob", "Charlie"],
    "Age": [25, 30, 35],
    "City": ["New York", "London", "Paris"]
})

display(
    "# Introduction\n"
    "This document demonstrates PyForge’s capabilities.\n\n"
    "## PyForge Overview\n"
    "Write docs in Python with Markdown strings and special classes."
)

display(
    Table(df, "Sample data table", "tbl-sample"),
    "Reference the table above:", Reference("tbl-sample", "Table 1"),
    "Include citations:", Citation("smith2023", "Smith et al. (2023)"),
    Title("# Conclusion"),
    "PyForge makes it easy to generate and version technical documents."
)
```

---

## CLI & Display Modes

* **Markdown export**

  ```bash
  pyforge markdown design.py output.md
  ```
* **Interactive preview**

  ```bash
  pyforge view design.py
  # (uses Streamlit under the hood)
  ```

See the `docs/` folder for example scripts:

* `simple_doc.py` — basic usage
* `complex_doc.py` — figures, tables, and citations

---

## Philosophy

PyForge is intentionally minimalist. It gives you just enough structure to programmatically create and version technical documents—without locking you into a heavyweight toolchain.

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

