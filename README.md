# ACVM Interactive Curriculum

This repository is a presentation-first, interactive Chinese-language course
that derives the Agentic Contract VM concept from one practical question: when
an Agent completes work off-chain, what makes the result eligible for payment?
GEO result verification and privacy-sealed social simulation open the story.
UTXO ownership, consensus finality, and deterministic virtual-machine replay
then establish the trust primitives whose execution boundary leads to ACVM's
evidence-driven task state machine.

The repository currently provides a concept specification and teaching
experience. Its TypeScript interfaces, protocol transitions, and proof paths are
explanatory models; they should not be mistaken for a released ACVM runtime or
production SDK.

## Learning path

The 44 lessons are grouped into six chapters and an epilogue. They follow one
question from concrete cases to protocol design: what evidence may change
shared state, when may settlement occur, and who remains accountable when
external work fails?

1. **Case opening (3 lessons).** GEO result verification and social simulation
   show what the buyer actually purchases. Two five-step animations freeze the
   acceptance rules, run work off-chain, collect independent evidence, reach
   finality, and release payment.
2. **Blockchain trust primitives (12 lessons).** Signatures, double-spending,
   UTXO state transitions, Merkle commitments, PoW block proposal, fork choice,
   and probabilistic finality establish a shared ownership history. The same
   chapter separates membership, proposal, validation, conflict handling, and
   finality across PoW, Gasper-style PoS, BFT/HotStuff, PoA, DPoS, Raft, and
   PoI. It then adds account state, deterministic EVM replay, Gas, receipts, and
   the oracle boundary.
3. **The AI execution break (7 lessons).** Model inference cannot be replayed
   by every validator without multiplying cost, leaking private inputs, and
   reproducing external side effects. The chapter draws the EVM/ACVM boundary,
   introduces Worker and Validator roles, compares verification strategies, and
   separates transaction correctness from task correctness.
4. **ACVM task protocol (9 lessons).** Content-addressed contract trees, the
   Task File ABI, lifecycle and runtime roles, minimal on-chain checks,
   deterministic task transitions, receipt verification, disputes, and system
   limits turn an off-chain job into a state machine that can settle.
5. **Off-chain evidence engineering (8 lessons).** Identities, capabilities,
   external-data evidence, private and fog execution, runtime policy,
   incremental proofs, and Proof of Intelligence explain how claims become
   auditable without claiming that every business truth can be proven on-chain.
6. **Multi-Agent coordination and settlement (4 lessons).** Agent discovery,
   delegated task DAGs, chain adapters, and application review patterns show
   how authority, budget, evidence, and responsibility move across a network.

The epilogue states the boundary in one sentence: ACVM does not replicate
external computation; it verifies task receipts and settles responsibility.

## Teaching stack

- Chapter diagrams and their source references live in `src/content/*.mdx`.
- The desktop shell uses a centered 16:9 stage, slide thumbnails, keyboard and
  touch navigation, a progress counter, and fullscreen presentation mode.
- Every slide states how its concept changes an ACVM design decision, keeping
  the ledger, consensus, and deterministic-VM foundations attached to the main
  argument.
- Each of the six chapters carries one visible story question. The sequence
  moves from a payment dispute, through trusted state and the AI replay break,
  to task protocol, evidence engineering, and multi-Agent settlement.
- The GEO and social-simulation scenes auto-advance through five states, pause
  when off-screen, honor reduced-motion preferences, and support direct step
  selection plus play/pause control.
- `LessonChapter` presents one diagram-first view. Detailed reference material
  remains in source instead of being hidden behind view-switching buttons.
- The closable speaker guide follows the active slide and supplies one takeaway,
  an opening line, three speaking beats, an ACVM connection, a transition, and
  suggested timing. It docks beside the stage on desktop, defaults closed on
  mobile, remembers the user's choice, and can be toggled with `G`.
- Code Hike examples and Remotion scenes remain build-checked reference assets;
  the dedicated TypeScript walkthrough slide provides the visible code tour.
- `src/course.ts` is the source of truth for lesson order and chapter grouping.
- `scripts/check-course.mjs` ensures MDX lesson IDs exactly match that order and
  verifies speaker-guide coverage while guarding narrator-style filler.

The AI-agent scalability chapter adapts the five-layer analysis from
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
