# ACVM Interactive Curriculum

This repository is a presentation-first, interactive Chinese-language course
that derives the Agentic Contract VM concept from first principles. It starts with Bitcoin's
ownership ledger, separates proposer selection from validation and finality,
extends the model into Ethereum's programmable state machine, then introduces
verifiable off-chain AI work before defining the ACVM protocol model.

The repository currently provides a concept specification and teaching
experience. Its TypeScript interfaces, protocol transitions, and proof paths are
explanatory models; they should not be mistaken for a released ACVM runtime or
production SDK.

## Learning path

The 42 chapters follow one continuous question: what evidence is allowed to
change shared state, and who remains accountable when external work fails?

1. **Bitcoin — one valid ownership history (4 chapters).** Double-spending,
   signatures and UTXOs, Merkle commitments and proof of work, forks and
   probabilistic finality.
2. **Consensus mechanisms (4 chapters).** Membership and Sybil resistance,
   proposer selection, independent validation, fork choice, and finality across
   PoW, Ethereum PoS/Gasper, BFT/HotStuff, PoA, DPoS, and Raft, plus the
   boundary between PoI-based proposer weighting and finality.
3. **Ethereum — a programmable state machine (4 chapters).** World state,
   deterministic EVM execution, Gas and transaction receipts, and the oracle
   boundary.
4. **AI and blockchains — verifiable external work (7 chapters).** Why model
   inference should not be replicated by every validator, the exact EVM/ACVM
   execution boundary, the Worker/Validator pipeline, verification tradeoffs,
   asynchronous Agentic Contracts, the five-layer trust-infrastructure model,
   and the gap between transaction correctness and task correctness.
5. **ACVM contract and runtime (5 chapters).** Content-addressed contract trees,
   the Task File ABI, the full lifecycle, runtime roles, and the consensus
   boundary.
6. **ACVM state and finality (4 chapters).** Deterministic task transitions,
   receipt verification, disputes, and system limits.
7. **Trust and proof systems (8 chapters).** Identities and capabilities,
   external-data evidence, isolated and fog execution, runtime policy,
   incremental proofs, Proof of Intelligence, and its research boundary.
8. **Agent networks and applications (5 chapters).** Agent discovery, task DAGs,
   private social simulation, chain adapters, and application review patterns.
9. **Conclusion (1 chapter).** Bitcoin validates ownership history, Ethereum
   validates deterministic program state, and ACVM validates evidence-driven
   task transitions without replicating external computation.

## Teaching stack

- Chapter summaries and deep-reading material live in `src/content/*.mdx`.
- The desktop shell uses a centered 16:9 stage, slide thumbnails, keyboard and
  touch navigation, a progress counter, and fullscreen presentation mode.
- `LessonChapter` keeps every chapter's architecture diagram and MDX explanation
  in an accessible two-tab view.
- Code Hike compiles fenced examples at build time and provides highlighted,
  titled, line-numbered, copyable walkthroughs.
- Remotion Player embeds frame-driven explainers for ledger evolution,
  transaction finality, and verifiable execution.
- `src/course.ts` is the source of truth for chapter order and navigation.
- `scripts/check-course.mjs` ensures MDX chapter IDs exactly match that order and
  guards minimum code and motion coverage as well as narrator-style filler.

The AI-agent scalability section adapts the five-layer analysis from
*A Survey of Blockchain Transaction Processing and Scalability: Toward a Trust
Infrastructure for AI Agents*. The mapping to ACVM protocol objects is an
engineering interpretation, not a claim made directly by the paper.

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
