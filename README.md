# ACVM Interactive Curriculum

This repository is an interactive, Chinese-language course that derives the
Agentic Contract VM concept from first principles. It starts with Bitcoin's
ownership ledger, extends the model into Ethereum's programmable state machine,
then introduces verifiable off-chain AI work before defining the ACVM protocol
model.

The repository currently provides a concept specification and teaching
experience. Its TypeScript interfaces, protocol transitions, and proof paths are
explanatory models; they should not be mistaken for a released ACVM runtime or
production SDK.

## Learning path

The 34 chapters follow one continuous question: why can a network accept a
result without trusting the party that produced it?

1. **Bitcoin — one valid ownership history (4 chapters).** Double-spending,
   signatures and UTXOs, Merkle commitments and proof of work, forks and
   probabilistic finality.
2. **Ethereum — a programmable state machine (4 chapters).** World state,
   deterministic EVM execution, Gas and transaction receipts, and the oracle
   boundary.
3. **AI and blockchains — verifiable external work (4 chapters).** Why model
   inference should not be replicated on-chain, the Worker/Validator pipeline,
   verification tradeoffs, and asynchronous Agentic Contracts.
4. **ACVM contract and runtime (5 chapters).** Content-addressed contract trees,
   the Task File ABI, the full lifecycle, runtime roles, and the consensus
   boundary.
5. **ACVM state and finality (4 chapters).** Deterministic task transitions,
   receipt verification, disputes, and system limits.
6. **Trust and proof systems (8 chapters).** Identities and capabilities,
   external-data evidence, isolated and fog execution, runtime policy,
   incremental proofs, Proof of Intelligence, and its research boundary.
7. **Agent networks and applications (5 chapters).** Agent discovery, task DAGs,
   private social simulation, chain adapters, and application review patterns.

## Teaching stack

- Chapter summaries and deep-reading material live in `src/content/*.mdx`.
- `LessonChapter` keeps every chapter's architecture diagram and MDX explanation
  in an accessible two-tab view.
- Code Hike compiles fenced examples at build time and provides highlighted,
  titled, line-numbered, copyable walkthroughs.
- Remotion Player embeds frame-driven explainers for ledger evolution,
  transaction finality, and verifiable execution.
- `src/course.ts` is the source of truth for chapter order and navigation.
- `scripts/check-course.mjs` ensures MDX chapter IDs exactly match that order and
  guards minimum code and motion coverage.

## Development

```bash
npm ci
npm run dev
```

Validate a change before submission:

```bash
npm run check
npm run build
```

The MDX build intentionally disables generated source maps. Code Hike inserts
highlighted token data without source locations, while this production build
does not emit source maps; disabling MDX maps avoids invalid generated mappings.
