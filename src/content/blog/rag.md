---
title: "Evaluate Your Own RAG: Why Best Practices Failed Us"
date: "2025-11-05"
description: "We benchmarked our production RAG system across embedding models, chunk sizes, chunking strategies, and retrieval modes. The results contradicted common wisdom."
slug: "rag"
---

## TL;DR (Too Long; Didn't Read)

**Key Findings:**

- **AWS Titan V2 embeddings performed best** (69.2% hit rate vs 57.7% Qwen 8B, 39.1% Mistral embed)
- **Chunk size doesn't really matter** - no significant difference between 2K and 40K characters for document-level retrieval
- **Naive chunking outperformed context-aware strategy** - simpler is better (70.5% vs 63.8% avg hit rate)
- **Mistral OCR is unmatched** for complex scientific PDFs (expensive but worth it)
- **Don't use AWS OpenSearch** for vector search - severely overpriced ($70/day minimum)
- **Qdrant is great** for vector DB - easy to use, solid performance, hybrid search
- **Dense-only search beat hybrid** in tests (69.2% vs 63.5% hit rate for Titan)

---

## RAG Overview

Retrieval-Augmented Generation (RAG) combines large language models (LLMs) with external knowledge retrieval.

**Core components:**

- **PDF Converter** - Extract text from documents
- **Chunking Strategy** - Split documents into retrievable pieces
- **Embedding Model** - Convert text to vector representations
- **Vector Database** - Store and search embeddings
- **Retrieval Mode** - Dense, sparse, or hybrid search
- **LLM** - Generate responses from retrieved context

![rag_mermaid](https://cdn-uploads.huggingface.co/production/uploads/67692674bc5af30a79d06213/0q9Vtq_S8zk7C8-qx6-OQ.png)

---

## Our Benchmark Methodology

### Setup

The benchmark uses real documents from production database:

- **PDFs converted using Mistral OCR** - complex scientific documents with equations, tables, and diagrams
- **Stored in Qdrant** - vector database of choice
- **Production configurations** - same setup as actual RAG system

### Test Dataset

Created test questions covering different difficulty levels:

- **Simple retrieval**: Direct text extractions
- **Complex questions**: Conceptual understanding

**Test dataset composition:**
- **156 unique test queries** per embedding model
- **3 languages**: English, French, Japanese
- **2 query forms**: Interrogative ("What is...?") and affirmative statements ("Characteristics of...")

Example from test set:

```python
MetaQuestion(
    source_document="Jaiman et al. - 2023 - Mechanics of Flow-Induced Vibration Physical Mode.pdf",
    related_questions=[
        # Affirmatives
        Question(
            text="Cylinder vibrations induced by fluid flow",
            language=Language.ENGLISH,
            form=Form.affirmative,
        ),
        Question(
            text="Vibrations des cylindres induites par l'écoulement des fluides",
            language=Language.FRENCH,
            form=Form.affirmative,
        ),
        Question(
            text="流体の流れによって誘発される円筒の振動",
            language=Language.JAPANESE,
            form=Form.affirmative,
        ),
        # Interrogatives
        Question(
            text="What can you tell me about cylinder vibrations induced by fluid flow?",
            language=Language.ENGLISH,
            form=Form.interrogative,
        ),
        Question(
            text="Que peux-tu me dire sur les vibrations des cylindres induites par l'écoulement des fluides ?",
            language=Language.FRENCH,
            form=Form.interrogative,
        ),
        Question(
            text="流体の流れによって誘発される円筒の振動について教えてください。",
            language=Language.JAPANESE,
            form=Form.interrogative,
        ),
    ],
)
```

### Metrics

**Important Note on Retrieval Goal:**

> **Goal:** Retrieve the right document, not necessarily the exact paragraph. Once you have the correct document, the LLM can extract specific information. This distinction is critical for benchmark design and conclusions.

**Metrics:**

- **Top-10 Recall (Hit Rate)**: % of queries where correct document appears in top-10 results
- **MRR (Mean Reciprocal Rank)**: Average of 1/rank for correct documents (higher is better)
- **Top-1 Recall**: % of queries where correct document is in top-1

### Chunking Strategies

**Naive chunking:** Simple character-based splitting with overlap using LangChain's `RecursiveCharacterTextSplitter`. Chunks created by splitting at natural boundaries without understanding document structure.

**Context-aware chunking:** Parses markdown structure into hierarchical tree. Each chunk includes parent section headings as context. Example: chunk from "Section 2.3 -> Subsection 2.3.1" includes both heading levels.

### Test Configurations

Benchmarked combinations of:

- **Chunking strategies**: Naive vs context-aware
- **Chunk sizes**: 2K, 4K, 6K characters for Titan V2; 2K for Mistral Embed; 2K, 10K, 40K characters for Qwen 8B
- **Embedding models**: AWS Titan V2, Qwen 8B, Mistral
- **Retrieval modes**: Dense-only, hybrid (dense + sparse), sparse-only

---

## Results & Key Learnings

### 1. Embedding Models: AWS Titan Wins (Surprisingly!)

Compared three embedding models across all configurations using naive chunking with 2000 character chunk size and 400 overlap.

![model_comparison](https://cdn-uploads.huggingface.co/production/uploads/67692674bc5af30a79d06213/QjYICxbX5rwFR1IGNrUf-.png)

**Model Selection Criteria:**

Specifically wanted **API-accessible embedding models** to avoid managing model inference infrastructure:

- **AWS Titan V2** (`amazon.titan-embed-text-v2:0`): Accessed via AWS Bedrock
- **Qwen 8B** (`Alibaba-NLP/gte-Qwen2-7B-instruct`): Accessed via Hugging Face Inference API (Nebius AI)
- **Mistral Embed** (`mistral-embed`): Accessed via Mistral AI API

**Results:**

- **AWS Titan V2**: 69.2% hit rate
- **Qwen 8B**: 57.7% hit rate
- **Mistral**: 39.1% hit rate

**The MTEB leaderboard surprise:**

AWS Titan V2 isn't even on the [MTEB (Massive Text Embedding Benchmark) leaderboard](https://huggingface.co/spaces/mteb/leaderboard), yet outperformed both Qwen 8B and Mistral.

**Why Titan wins:**

- Cheaper than alternatives with higher rate limits
- Better multilingual performance (critical for EN/FR/JA documents)
- More robust to scientific terminology and technical jargon
- Very inexpensive

**The trap of traditional benchmarks:**

When limiting analysis to English-only affirmative queries:

![model_comparison_english_affirmative](https://cdn-uploads.huggingface.co/production/uploads/67692674bc5af30a79d06213/esexc8MjK1bl5vLhZpWKd.png)

> **Critical Insight:** Under "traditional" benchmark conditions (English affirmative questions only), **Mistral performs almost on par with Titan** (76.9% vs 80.8% hit rate). However, across **all languages and query forms**, Mistral's performance dropped significantly (39.1% overall vs 69.2% for Titan).
>
> **The key difference: consistency.** Titan maintains strong performance across English, French, Japanese, and both query forms. Mistral excels in narrow conditions but lacks robustness.

**Lesson learned:** Test embedding models under diverse conditions matching production use cases. A model dominating English-only benchmarks may struggle with multilingual content or different query formulations.

---

### 2. Chunk Size: Don't Overthink It

Tested various chunk sizes: 2K, 4K, 6K characters with Titan V2 and 2K, 10K, 40K characters with Qwen 8B.

![titan_naive_chunk_size_comparison](https://cdn-uploads.huggingface.co/production/uploads/67692674bc5af30a79d06213/NlkB82tzCOtBu2YR1HizJ.png)

![qwen_naive_chunk_size_comparison](https://cdn-uploads.huggingface.co/production/uploads/67692674bc5af30a79d06213/xwJFwsMwXrLUF2CfkOqLA.png)

**Results:** Chunk size had **minimal impact on performance**. Variation between different sizes was negligible -- all configurations performed within a few percentage points.

**Why chunk size doesn't matter:**

Goal is **document-level retrieval**, not finding exact paragraphs. As long as any chunk from correct document ranks highly, we succeed. Larger chunks still contain relevant content.

**Practical recommendation: Don't over-optimize**

Unlike typical RAG advice emphasizing chunk size tuning:

- **No performance penalty with larger chunks** - 2K performed similarly to 40K
- **Larger chunks = Lower costs**:
  - Inference provider: less overlap tokens (cheaper, less rate limit risk)
  - Vector DB: less storage, faster indexing, fewer similarity comparisons at query time

**Configuration used:**

- **Titan V2**: 6K characters
- **Qwen 8B**: 40K characters

**Bottom line:** Switched from 2K to larger chunks for cost efficiency. Any reasonable size works -- don't spend days optimizing this. Focus on embedding model selection and retrieval mode instead.

---

### 3. Chunking Strategy: Naive Matches Context-Aware

Tested naive chunking vs context-aware chunking.

![strategy_comparison_titan](https://cdn-uploads.huggingface.co/production/uploads/67692674bc5af30a79d06213/NcP9BPaT_sSVdUjMg1mzO.png)

![strategy_comparison_qwen](https://cdn-uploads.huggingface.co/production/uploads/67692674bc5af30a79d06213/Tmifa8YDXrcpYWIQjBYsq.png)

**Results:** Naive chunking **outperformed** context-aware for Titan embeddings (71.8% vs 67.9% at best, 70.5% vs 63.8% average with dense-only).

**Interpretation:**

- For technical documents, strict structural boundaries can split related content
- Naive chunking with overlap captured context sufficiently
- Context-aware chunking adds complexity without clear benefit

**Recommendation:** Start simple with naive chunking. Only use context-aware for specific structure-dependent requirements.

---

### 4. Dense vs Hybrid Search in Qdrant (Surprising Result)

**Understanding Retrieval Modes:**

- **Dense search**: Uses semantic embeddings to find documents based on meaning. Converts queries and documents into vectors and finds similar vectors. Great for conceptual matches.

- **Sparse search**: Uses keyword-based matching (BM25-like). Excellent for exact term matches but misses semantic similarity.

- **Hybrid search**: Combines both -- semantic understanding + keyword precision. Score fusion merges results.

**Our Findings:**

Conventional wisdom says hybrid should outperform dense-only. **The data shows the opposite.**

![metrics_by_sparse_mode_titan](https://cdn-uploads.huggingface.co/production/uploads/67692674bc5af30a79d06213/O0W093q0DvuSwBCqcc5y4.png)

![metrics_by_sparse_mode_qwen](https://cdn-uploads.huggingface.co/production/uploads/67692674bc5af30a79d06213/vdgBhAu7-ERaJtceVCSio.png)

![metrics_by_sparse_mode_mistral](https://cdn-uploads.huggingface.co/production/uploads/67692674bc5af30a79d06213/DrNOjWBrM8piBsPjZHAu4.png)

**Findings:** Dense-only achieved **69.2% hit rate** vs **63.5%** for hybrid (Titan embeddings, 2K character naive chunking).

**Why this might happen:**

- For scientific documents with technical terminology, dense embeddings alone captured semantic meaning effectively
- Sparse search can introduce noise from keyword matches lacking semantic context
- Results are specific to document types and Qdrant's FastEmbed implementation

**Important context:** Chose Qdrant for hybrid search capabilities. While dense-only performed better in benchmarks, hybrid remains valuable for:

- Exact keyword matching requirements
- Regulatory/compliance searches with specific terms
- Fallback when dense embeddings struggle with rare terms

**Recommendation:** Benchmark both modes on your specific corpus. Don't assume hybrid is always better.

---

### 5. Multilingual Performance

Documents span English, French, and Japanese.

**Results:**

- English: 73.1% hit rate
- French: 48.7% hit rate
- Japanese: 44.2% hit rate

English significantly outperformed French and Japanese. Multilingual support of Titan embeddings was validated, even with performance variation.

**Model Comparison Across Languages:**

![model_comparison_by_language](https://cdn-uploads.huggingface.co/production/uploads/67692674bc5af30a79d06213/qiL1mbpwKBwHIJBPHZF_n.png)

Titan consistently outperformed other models across all languages, with particularly strong English performance. Gap between models was most pronounced in French and Japanese.

**Model Comparison Across Query Forms:**

![model_comparison_by_form](https://cdn-uploads.huggingface.co/production/uploads/67692674bc5af30a79d06213/PCyvr0sbr-4nXrojWp8kd.png)

Titan and Mistral perform better with affirmative statements. Qwen performs better with interrogative statements (surprising).

---

## Practical Decisions (Non-Benchmarked)

### PDF Conversion: Mistral OCR

**Decision:** Use Mistral OCR for all document processing.

**Evaluation:** Manually tested 3 complex PDFs with equations, tables, diagrams, and scanned pages:

- [Mistral OCR](https://mistral.ai/fr/news/mistral-ocr)
- [Tesseract](https://tesseract-ocr.github.io/)
- [Markitdown](https://github.com/microsoft/markitdown)
- [Marker](https://github.com/datalab-to/marker)

**Findings:** Only Mistral OCR correctly parsed complex mathematical notation and tables in scanned documents. Output quality difference was dramatic, even working with chemical equations.

**Why Markdown Conversion is Critical:**

Converting all documents to markdown isn't just about performance -- **it's essential for a debuggable RAG system**:

- **Debuggability**: When retrieval fails, you need to inspect what was indexed. With raw PDFs, you're blind. With markdown, open the file, search expected content, understand what chunking did.
- **Performance**: Markdown is lightweight and fast. Chunking markdown is orders of magnitude faster than re-parsing PDFs.
- **Reproducibility**: Markdown gives stable, version-controllable document representation. Track changes, compare versions, ensure consistency.
- **Iteration speed**: Testing different chunking strategies on markdown takes seconds. Makes experimentation practical.

**Bottom line:** Without markdown as intermediate format, you can't effectively debug or iterate on RAG systems. It's not optional -- it's foundational.

**Trade-off:** Mistral OCR costs $1 per 1000 pages. For scientific documents where accuracy is critical, it's worth it. For simpler PDFs, try open-source alternatives first.

---

### Vector Database: Qdrant

**Decision:** Use Qdrant (managed service).

**Context:** Evaluated Milvus, Qdrant, AWS OpenSearch, Pinecone, and PostgreSQL with pgvector. Being AWS-native, initially tried OpenSearch.

> **Critical finding:** **Don't use AWS OpenSearch for vector search.** Cheapest option is $70/day (~$2,100/month) for single-node cluster. Severely overpriced.

**Why Qdrant:**

- Native hybrid search support with FastEmbed
- Easy Docker setup for self-hosting
- Later migrated to managed Qdrant service to avoid maintenance
- Solid performance and features
- Reasonable Qdrant Cloud pricing

**Why not Qdrant:**

- Admin in Qdrant Cloud lacks basic features (like transferring ownership)
- Collections sometimes stay in "gray mode" for unclear reasons (manually start optimization)

**Why not alternatives:**

- PostgreSQL seemed overkill since not using PostgreSQL/Aurora for other purposes
- Pinecone is not open source
- Milvus vs Qdrant: both most-starred open source databases. Team tried deploying both on self-hosted server -- took longer for Milvus, so Qdrant won

---

## Conclusion

Building production RAG systems requires balancing performance, cost, and complexity.

**Recommended Configuration:**

- **Embedding Model**: AWS Titan V2 (69.2% hit rate - best for multilingual scientific content)
- **Chunk Size**: Don't overthink it -- any reasonable size works (6K for Titan, 40K for Qwen for cost efficiency)
- **Chunking Strategy**: Naive chunking (70.5% avg hit rate vs 63.8% context-aware -- simpler and better)
- **Retrieval Mode**: Dense-only for this use case (69.2% vs 63.5% for hybrid with Titan)
- **Vector DB**: Qdrant or Milvus (avoid AWS OpenSearch due to cost)
- **PDF Conversion**: Mistral OCR for complex scientific documents (expensive but necessary)

> **Key Takeaway:** Don't blindly follow "best practices" from blog posts. Benchmark on your specific document types and query patterns. Findings contradicted common wisdom (dense-only beating hybrid, naive beating context-aware), but were reproducible and significant. **What worked here may not work for you.** The only way to know is to measure.

---

## Note on Data Availability

Benchmark code and methodology detailed in article for reproducibility. However, **scientific documents are proprietary and closed-source** (nuclear engineering research and regulatory materials). Source code also can't be shared -- part of mono-repo.

While raw data can't be shared, **happy to answer questions** about methodology, testing approach, or specific findings.

---

## Implementation Details

### Chunking Strategies

**Naive Chunking:**

```python
def split_markdown(s3_markdown_path: Path, max_chunk_size: int, strategy: ChunkingStrategy) -> list[str]:
    if strategy == ChunkingStrategy.naive:
        return RecursiveCharacterTextSplitter(
            chunk_size=max_chunk_size,
            chunk_overlap=400,
            add_start_index=True
        ).split_text(markdown_text)
```

**Context-Aware Chunking:**

```python
class Section:
    def __init__(self, body: str = "", title: str | None = None, level: int = 0):
        self.body: str = body
        self.title: str | None = title
        self.level: int = level
        self.children: list[Section] = []

    @classmethod
    def from_markdown(cls, markdown_text: str) -> Section:
        """Parse markdown into hierarchical sections based on heading levels."""
        lines = markdown_text.split("\n")
        root = cls()
        stack = [root]
        for line in lines:
            if line.startswith("#"):
                level = len(line) - len(line.lstrip("#"))
                title = line.lstrip("#").strip()
                new_section = cls(title=title, level=level)
                while stack and stack[-1].level >= level:
                    stack.pop()
                stack[-1]._add_child(new_section)
                stack.append(new_section)
            else:
                if stack:
                    stack[-1].body += line + "\n"
                return root

    def to_chunks(self, max_chunk_size: int, context: str = "") -> list[str]:
        context += self.current_context
        chunks = []
        if self.body.replace("\n", "").strip():
            if len(context) >= max_chunk_size:
                logger.warning(
                    f"Context too large ({len(context)} chars) for max_chunk_size {max_chunk_size}. Skipping context."
                )
                context = ""
            chunks += [
                context + splitted_body
                for splitted_body in _split_text_into_chunks(self.body, max_chunk_size - len(context))
            ]
        for child in self.children:
            chunks += child.to_chunks(max_chunk_size, context)
        return chunks
```

### PDF Processing with Mistral OCR

**Converting PDFs to Markdown:**

```python
def convert_pdf_to_markdown(pdf_path: Path, output_path: Path) -> tuple[Path, Path]:
    logger.info(f"Start converting PDF {pdf_path} to markdown...")
    pdfs_under_50mb = _split_pdf_to_under_50mb_improved(pdf_path, output_path)

    final_markdown = ""
    final_pages = []
    for pdf in pdfs_under_50mb:
        ocr_response = _convert_pdf_under_50MB_to_markdown(pdf)
        markdown = _get_combined_markdown(ocr_response=ocr_response)
        pages = ocr_response.model_dump()["pages"]
        final_markdown += markdown
        final_pages.extend(pages)

    markdown_path = output_path / f"{pdf_path.stem}.md"
    markdown_path.write_text(final_markdown)
    return markdown_path, yaml_path
```

**Mistral OCR API Call:**

```python
def _convert_pdf_under_50MB_to_markdown(pdf_path: Path) -> OCRResponse:
    uploaded_pdf = MISTRAL_CLIENT.files.upload(
        file=File(
            file_name=pdf_path.name,
            content=pdf_path.read_bytes(),
            content_type="application/pdf"
        ),
        purpose="ocr",
    )

    signed_url = MISTRAL_CLIENT.files.get_signed_url(file_id=uploaded_pdf.id)

    return MISTRAL_CLIENT.ocr.process(
        model="mistral-ocr-latest",
        document={"type": "document_url", "document_url": signed_url.url},
        include_image_base64=True,
    )
```

### Embedding Models Setup

**Configuring Different Embedding Models:**

```python
def get_dense_embedding_model(model: DenseEmbeddingModel) -> Embeddings:
    if model == DenseEmbeddingModel.titan:
        return BedrockEmbeddings(model_id="amazon.titan-embed-text-v2:0")

    if model == DenseEmbeddingModel.qwen:
        return HuggingFaceEndpointEmbeddings(
            client=InferenceClient(provider="nebius", api_key=token),
            model="Qwen/Qwen3-Embedding-8B"
        )

    if model == DenseEmbeddingModel.mistral:
        return MistralAIEmbeddings(
            mistral_api_key=os.environ["PYJIMMY_MISTRAL_API_KEY"],
            model="mistral-embed"
        )

SPARSE_EMBEDDING_MODEL = FastEmbedSparse(model_name="prithvida/Splade_PP_en_v1")
```

### Qdrant Vector Store Configuration

**Creating Collections with Hybrid Search:**

```python
def create_vector_store(collection_name: str, model: DenseEmbeddingModel):
    logger.info(f"Creating Qdrant collection {collection_name}...")
    QdrantVectorStore.from_texts(
        texts=[],
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
        collection_name=collection_name,
        embedding=get_dense_embedding_model(model),
        sparse_embedding=SPARSE_EMBEDDING_MODEL,
        retrieval_mode=RetrievalMode.HYBRID,
    )
```

**Adding Documents with Retry Logic:**

```python
@retry(wait=wait_fixed(60))
def _add_texts_to_vector_store(
    vector_store: QdrantVectorStore,
    texts: list[str],
    s3_folder: Path
) -> list[str]:
    """Retry on failure due to embedding API rate limits."""
    return vector_store.add_texts(
        texts,
        metadatas=[{"s3_folder": s3_folder} for _ in texts]
    )

def add_markdown_to_qdrant(
    s3_markdown_path: Path,
    max_chunk_size: int,
    chunking_strategy: ChunkingStrategy,
    model: DenseEmbeddingModel
):
    chunks = split_markdown(s3_markdown_path, max_chunk_size, strategy=chunking_strategy)
    vector_store = get_vector_store(collection_name, model=model)

    vector_ids = []
    max_chunks_one_request = 10
    for start_index in range(0, len(chunks), max_chunks_one_request):
        vector_ids.extend(
            _add_texts_to_vector_store(
                vector_store,
                chunks[start_index : start_index + max_chunks_one_request],
                s3_folder=s3_folder
            )
        )
```
