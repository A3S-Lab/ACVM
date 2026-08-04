# ACVM Interactive Curriculum

This repository is a presentation-first, interactive Chinese-language course
about ACVM as outcome-settlement infrastructure for AI and blockchains. Its
central claim is simple: requests, tokens, and compute measure resource usage;
only an accepted and finalized result should trigger business settlement. GEO
result verification and privacy-sealed social simulation show the payment gap
before ledger, consensus, deterministic replay, evidence, dispute, and finality
are introduced as the capabilities required to close it.

The repository currently provides a concept specification and teaching
experience. Its TypeScript interfaces, protocol transitions, and proof paths are
explanatory models; they should not be mistaken for a released ACVM runtime or
production SDK.

## Learning path

The 35 lessons are grouped into seven chapters and an epilogue. They follow one
commercial and technical transition: from billing because an AI call happened
to settling because its result satisfied a rule fixed in advance.

1. **The payment problem (3 lessons).** GEO result verification and social
   simulation separate metered activity from the outcome the buyer actually
   purchases. Two five-step animations freeze the acceptance rules, run work
   off-chain, collect independent evidence, reach finality, and release payment.
2. **Trusted shared state (10 lessons).** Signatures, double-spending,
   UTXO ownership, Merkle commitments, PoW block proposal, fork choice,
   and probabilistic finality establish a shared ownership history. The same
   chapter separates membership, proposal, validation, conflict handling, and
   finality across PoW, Gasper-style PoS, BFT/HotStuff, PoA, DPoS, Raft, and
   PoI. It then adds account state, deterministic EVM replay, Gas, and the
   oracle boundary.
3. **The verification break (5 lessons).** Model inference cannot be replayed
   by every validator without multiplying cost, leaking private inputs, and
   reproducing external side effects. The chapter draws the EVM/ACVM boundary,
   introduces Worker and Validator roles, compares verification strategies, and
   separates transaction correctness from task correctness.
4. **ACVM outcome protocol (5 lessons).** Content-addressed contract trees, the
   Task File ABI, lifecycle, deterministic task transitions, receipt checks,
   and disputes turn an off-chain job into a state machine that can settle.
5. **Off-chain evidence engineering (5 lessons).** Identities, capabilities,
   external-data evidence, private execution, incremental proofs, and Proof of
   Intelligence explain how claims become
   auditable without claiming that every business truth can be proven on-chain.
6. **Participant economics (3 lessons).** A six-role map separates each
   participant's contribution, reward, and risk. An interactive payment
   waterfall follows one escrow budget through accepted, honestly rejected,
   and fraud-proven outcomes. A second interactive model connects detection
   probability, slash exposure, challenge rewards, and incentive compatibility.
7. **Multi-Agent coordination and settlement (3 lessons).** Agent discovery,
   delegated task DAGs, and chain adapters show how authority, budget,
   evidence, and responsibility move across a network.

The epilogue states the boundary in one sentence: usage metering controls cost;
verified outcomes trigger settlement. ACVM does not replicate external
computation. It binds outcome definitions, receipts, independent verdicts,
disputes, finality, and one-time payment to the same task.

## Teaching stack

- Chapter diagrams and their source references live in `src/content/*.mdx`.
- The desktop shell uses a centered 16:9 stage, slide thumbnails, keyboard and
  touch navigation, a progress counter, and fullscreen presentation mode.
- Each slide keeps one claim, one short explanation, and one diagram. Supporting
  assumptions, formulas, edge cases, and implementation detail live in the
  speaker guide instead of competing with the visual.
- Each chapter opens with one bridge from the previous chapter. The sequence
  moves from the gap between usage and outcome, through trusted state and the
  AI verification break, to outcome protocol, evidence engineering,
  participant economics, and multi-Agent settlement.
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

The verification speaker guide retains the five-layer analysis from
*A Survey of Blockchain Transaction Processing and Scalability: Toward a Trust
Infrastructure for AI Agents*. The mapping to ACVM protocol objects is an
oral engineering interpretation, not a claim made directly by the paper.

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
