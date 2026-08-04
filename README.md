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

The 43 chapters follow one continuous question: what evidence is allowed to
change shared state, and who remains accountable when external work fails?

1. **ACVM in use (1 chapter).** An autonomous procurement task anchors the
   course: a caller signs the goal and budget, Agents delegate work, Workers
   call external tools, Validators check the result, and settlement happens
   only after acceptance and finality. Private research and long-running Agent
   collaboration show how the same protocol shape applies elsewhere.
2. **Bitcoin — one valid ownership history (4 chapters).** Double-spending,
   signatures and UTXOs, Merkle commitments and proof of work, forks and
   probabilistic finality.
3. **Consensus mechanisms (4 chapters).** Membership and Sybil resistance,
   proposer selection, independent validation, fork choice, and finality across
   PoW, Ethereum PoS/Gasper, BFT/HotStuff, PoA, DPoS, and Raft, plus the
   boundary between PoI-based proposer weighting and finality.
4. **Ethereum — a programmable state machine (4 chapters).** World state,
   deterministic EVM execution, Gas and transaction receipts, and the oracle
   boundary.
5. **AI and blockchains — verifiable external work (7 chapters).** Why model
   inference should not be replicated by every validator, the exact EVM/ACVM
   execution boundary, the Worker/Validator pipeline, verification tradeoffs,
   asynchronous Agentic Contracts, the five-layer trust-infrastructure model,
   and the gap between transaction correctness and task correctness.
6. **ACVM contract and runtime (5 chapters).** Content-addressed contract trees,
   the Task File ABI, the full lifecycle, runtime roles, and the consensus
   boundary.
7. **ACVM state and finality (4 chapters).** Deterministic task transitions,
   receipt verification, disputes, and system limits.
8. **Trust and proof systems (8 chapters).** Identities and capabilities,
   external-data evidence, isolated and fog execution, runtime policy,
   incremental proofs, Proof of Intelligence, and its research boundary.
9. **Agent networks and applications (5 chapters).** Agent discovery, task DAGs,
   private social simulation, chain adapters, and application review patterns.
10. **Conclusion (1 chapter).** Bitcoin validates ownership history, Ethereum
   validates deterministic program state, and ACVM validates evidence-driven
   task transitions without replicating external computation.

## Teaching stack

- Chapter diagrams and their source references live in `src/content/*.mdx`.
- The desktop shell uses a centered 16:9 stage, slide thumbnails, keyboard and
  touch navigation, a progress counter, and fullscreen presentation mode.
- Every slide states how its concept changes an ACVM design decision, keeping
  the Bitcoin and Ethereum foundations attached to the main argument.
- `LessonChapter` now presents one diagram-first view without the former
  diagram/deep-reading switcher. Detailed reference material remains in source.
- The closable speaker guide follows the active slide and supplies one takeaway,
  an opening line, three speaking beats, an ACVM connection, a transition, and
  suggested timing. It docks beside the stage on desktop, defaults closed on
  mobile, remembers the user's choice, and can be toggled with `G`.
- Code Hike examples and Remotion scenes remain build-checked reference assets;
  the dedicated TypeScript walkthrough slide provides the visible code tour.
- `src/course.ts` is the source of truth for chapter order and navigation.
- `scripts/check-course.mjs` ensures MDX chapter IDs exactly match that order and
  verifies speaker-guide coverage while guarding narrator-style filler.

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
