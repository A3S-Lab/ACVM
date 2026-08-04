# ACVM Product Deck

This repository contains an interactive Chinese-language product presentation
for ACVM, the Agentic Contract Virtual Machine. The deck is built around two
first-principles substitutions:

1. Replace externally useless hash work with proofs of model-inference services
   triggered by real demand and accepted against rules fixed in advance.
2. Replace EVM-style smart contracts, for AI workloads, with Agentic Contracts
   that manage asynchronous off-chain work through identities, budgets,
   receipts, validation, disputes, and settlement.

These substitutions form one product loop. A model-inference task first creates
value for a customer. When signed demand, accepted output, attested execution,
and anti-replay checks all hold, it also creates a valid Proof of Intelligence
(`PoI`). The PoI may contribute bounded proposer weight; verifiable randomness
selects a proposer, and BFT or the configured base-chain rules provide finality.
PoI is therefore a source of candidate weight, not a complete consensus
protocol by itself.

## Product story

The 20-slide presentation, including the cover, is organized into six sections:

1. **Product and use cases.** A one-page product definition is followed by GEO
   result verification as a service and privacy-sealed social simulation as a
   service.
2. **First principles.** The deck separates the security function of proof of
   work from hash computation, then separates deterministic VM replay from the
   execution needs of long-running AI agents.
3. **Core mechanism.** The dual-engine architecture connects signed demand,
   inference, validation, outcome settlement, PoI eligibility, bounded weight,
   VRF proposer selection, BFT finality, and the Agentic Contract object.
4. **Technical feasibility.** Hybrid result verification, private evidence,
   three deployment modes, and five explicit attack paths define what can be
   implemented and what still needs pilot calibration.
5. **Economics.** Participant contributions, rewards, and risks are separated
   from two value flows: customer payment for accepted outcomes and network
   rewards for completed consensus duties.
6. **Delivery.** The roadmap distinguishes the current concept specification
   and product demonstration from the runtime, PoI verifier, use-case pilots,
   and an eventual PoI-weighted network.

Each visible slide carries one claim and one diagram. Assumptions, formulas,
edge cases, technical context, and transitions live in the closable speaker
guide. The guide follows the active slide, remembers its open state, and can be
toggled with `G`.

## Current status

The repository currently provides a concept specification and product
presentation. Its TypeScript objects, proof conditions, consensus flow, and
economics are explanatory models, not a released production runtime or SDK.
The next verifiable milestone is one real inference task running from
`SignedDemand` through `ValidPoI` to a finalized task and payment receipt.

## Presentation controls

- Arrow keys, space, mouse wheel, and touch gestures move between slides.
- `O` toggles slide thumbnails.
- `G` toggles the speaker guide.
- `F` toggles fullscreen presentation mode.
- The GEO and social-simulation scenes can auto-play, pause, and jump to a
  specific stage.

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

`src/deck.ts` is the source of truth for slide order and section grouping.
`scripts/check-product-deck.mjs` verifies slide order, speaker-guide coverage,
opening use cases, copy density, and the absence of retired tutorial slides.
