# ACVM Product Deck

This repository contains an interactive Chinese-language product presentation
for ACVM, the Agentic Contract Virtual Machine.

ACVM is positioned as a result-verdict and settlement-control layer. It does
not replace the execution runtime, a trusted data space, or the underlying
ledger. A task is specified before execution; a Worker or A3S produces the
result and receipts; an independent Validator evaluates the frozen acceptance
rules; an existing chain or payment system provides settlement finality.

## Decision narrative

The 20-slide deck contains one cover, a 10-slide decision narrative, and a
9-slide technical appendix. The main narrative presents two priority scenarios:

1. **GEO result verification.** Freeze a query set, baseline, observation
   window, evidence sources, and improvement threshold; release the result pool
   only after independent observation accepts the outcome.
2. **Trusted data space outcome settlement.** Use the trusted data space's
   digital contracts, connectors, usage control, and fulfillment proofs for
   compliant data circulation; use ACVM to add a separate business-result
   verdict and a pre-agreed revenue split. Payment by accepted outcome is an
   ACVM transaction mechanism, not the definition of a trusted data space.

The trusted-data-space example combines equipment parameters from a
manufacturer, operating data from a factory, and fault work orders from a
maintenance provider into one predictive-maintenance data product. The data
space records authorization, actual usage, and lineage. After the agreed
downtime-improvement result is accepted, ACVM releases the result pool under
the revenue split frozen before execution; it does not infer each party's
causal value after the fact.

The second track follows the National Data Administration's definition of a
data element as a data resource invested in production or operations and
participating in value creation. It also preserves the official trusted-data-
space boundary: trusted control, resource interaction, and value co-creation
belong to the data space; outcome adjudication and conditional settlement are
the proposed ACVM addition.

The mainline sequence is:

1. Result acceptance as the payment condition
2. ACVM's result-verdict role
3. Recommended ACVM collaboration patterns
4. GEO result verification
5. Trusted data space and outcome-based data-element settlement
6. One-order workflow
7. Result-verification model
8. Illustrative settlement waterfall
9. Attack controls and residual risks
10. Current delivery status

The appendix covers privacy-sealed social simulation, comparison predicates for
other AI networks, the off-chain execution boundary, optional ANS discovery,
Agentic Contracts, fog inference, ValidPoI requirements, future PoI-weighted
proposer selection, and candidate deployment adapters.

## Evidence and product boundaries

Visible slides distinguish current capabilities, proposed integrations, future
options, and illustrative data. GEO measurements, ANS records, and the ¥120,000
settlement example are demonstrations rather than production claims. Candidate
chains and AVS integrations are not presented as completed work. PoI proposer
weight remains zero during a first pilot.

The speaker guide cites primary sources for every slide. The trusted-data-space
track is grounded in the State Council's data-system policy, the National Data
Administration's terminology, the *Trusted Data Space Development Action Plan
(2024-2028)*, and the 2025 *Trusted Data Space - Technology Architecture*.

## Current status

A3S provides the existing open-source execution foundation. ACVM's adapters,
verdict state machine, Shadow PoI derivation, settlement integration, and
trusted-data-space connector integration remain to be implemented and tested.

The next milestone is one real order in a priority scenario. It should run from
`SignedDemand` through execution and evidence, an accepted or rejected verdict,
Shadow PoI, and a small settlement. A trusted-data-space pilot additionally
binds the data-space digital contract and usage proof to the same `taskId`.

## Presentation controls

- Arrow keys, space, mouse wheel, and touch gestures move between slides.
- `O` toggles slide thumbnails.
- `G` toggles the speaker guide.
- `F` toggles fullscreen presentation mode.
- The social-simulation appendix scene can play, pause, and jump to a specific
  stage; the main decision narrative uses static visuals for faster delivery.

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
`scripts/check-product-deck.mjs` verifies narrative order, spoken and deep-dive
speaker-guide coverage, copy density, audience-facing language, and the absence
of retired tutorial slides.
