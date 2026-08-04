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

The 17-slide presentation, including the cover, is organized into six sections:

1. **Product and use cases.** The payment condition is defined first, followed
   by GEO result verification and privacy-sealed social simulation.
2. **First principles.** The deck separates the security function of proof of
   work from hash computation, then separates deterministic VM replay from the
   execution needs of long-running AI agents.
3. **Order workflow.** An animated ASCII map connects signed demand, ANS agent
   discovery, Agentic Contracts, fog inference, result verification, PoI,
   VRF proposer selection, BFT finality, and settlement.
4. **Deployment and security.** Three deployment modes and five explicit
   attack paths define what can be implemented and what still needs pilot
   calibration.
5. **Economics.** One concrete escrow example shows how accepted, rejected, and
   fraudulent outcomes pay each participant and assign risk.
6. **Delivery.** One roadmap slide separates the current concept demonstration
   from the runtime, first real pilot, and an eventual PoI-weighted network.

Each visible slide carries one claim and one diagram. The closable speaker
guide contains the implementation mechanism, acceptance check, engineering
difficulty, mitigation, residual risk, blockchain-security comparisons, and
primary references for every slide. It follows the active slide, remembers its
open state, and can be toggled with `G`. The guide and thumbnail rail start
closed so the audience view keeps the largest readable canvas.

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
- The GEO, social-simulation, ASCII workflow, ANS, and fog-computing scenes can
  auto-play, pause, and jump to a specific stage.

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
`scripts/check-product-deck.mjs` verifies slide order, spoken and deep-dive
speaker-guide coverage, opening use cases, copy density, and the absence of
retired tutorial slides.
