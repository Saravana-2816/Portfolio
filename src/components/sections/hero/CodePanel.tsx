const snippet = `class RAGPipeline:
    def __init__(self, vs, llm):
        self.vs = vs
        self.llm = llm

    def retrieve(self, query: str):
        embedding = embed(query)
        return self.vs.search(embedding, k=5)

    def generate(self, query: str):
        context = self.retrieve(query)
        return self.llm.complete(query, context)`

export function CodePanel() {
  return (
    <div className="hidden border border-border bg-card lg:block">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <span className="size-2 rounded-full border border-muted-foreground" />
        <span className="size-2 rounded-full border border-muted-foreground" />
        <span className="size-2 rounded-full border border-muted-foreground" />
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">rag_pipeline.py</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed text-foreground">
        <code>
          {snippet}
          <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-foreground motion-safe:animate-pulse" />
        </code>
      </pre>
    </div>
  )
}
