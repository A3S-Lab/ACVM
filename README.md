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
value for a customer. Signed demand, accepted output, execution evidence, and
anti-replay checks can then create a Proof of Intelligence (`PoI`) when an open
network actually needs contribution accounting. PoI is optional for ordinary
result settlement. If enabled, it may contribute bounded proposer weight;
verifiable randomness selects a proposer, while BFT or configured base-chain
rules provide finality.

## Product story

The 18-slide presentation, including the cover, is organized into six sections:

1. **Product and use cases.** The payment condition is defined first, followed
   by GEO result verification, privacy-sealed social simulation, and an explicit
   decision rule showing that GEO does not inherently require PoI.
2. **Engineering landscape.** Bittensor, Allora, Gensyn, EigenAI, EigenLayer,
   and ChainOpera are compared by proof target, judge, and economic effect before
   the deck explains why model execution cannot be replayed by every chain node.
3. **Order workflow.** An animated ASCII map separates AP2 authorization, A3S
   execution, ACVM verdicts, existing-chain settlement, and optional PoI before
   expanding ANS, Agentic Contracts, fog inference, and result verification.
4. **Deployment and security.** A concrete adapter plan covers BSN, Spark Chain,
   ChainMaker, FISCO BCOS, and an optional EigenLayer AVS path, followed by
   explicit attack controls and residual risks.
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
presentation. A3S is the proposed open-source execution foundation; the ACVM
adapters, verdict state machine, and settlement integration shown here remain
to be implemented and validated. The next milestone is one real task running
from `SignedDemand` through an A3S execution receipt to `VerdictFinalized` and a
payment receipt, with PoI disabled by default.

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
