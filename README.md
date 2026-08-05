# ACVM Product Deck

This repository contains an interactive Chinese-language product presentation
for ACVM, the Agentic Contract Virtual Machine.

ACVM turns accepted useful inference into verifiable on-chain value. A valid
PoI can trigger settlement and multi-party revenue sharing, and can contribute
bounded proposer-candidate weight. ACVM does not replace the execution runtime,
a trusted data space, or model infrastructure: A3S provides inference and
execution evidence, while independent Validators evaluate frozen acceptance
rules. The near-term path anchors minimal state to existing domestic chains;
the native path implements Agentic Contract, PoI, settlement, and finality in a
Rust ACVM chain.

## Decision narrative

The 18-slide deck contains one cover, an 11-slide decision narrative, a
5-slide technical appendix, and a 1-slide native-chain close. PoI and the
trusted off-chain execution model are introduced before the three recommended
scenarios:

1. **GEO result verification.** Freeze a query set, baseline, observation
   window, evidence sources, and improvement threshold; release the result pool
   only after independent observation accepts the outcome.
2. **Trusted data space outcome settlement.** Use the trusted data space's
   digital contracts, connectors, usage control, and fulfillment proofs for
   compliant data circulation; use ACVM to add a separate business-result
   verdict and a pre-agreed revenue split. Payment by accepted outcome is an
   ACVM transaction mechanism, not the definition of a trusted data space.
3. **Social simulation as a service.** Keep institutional and enterprise data
   local, run a frozen model and random process, aggregate only permitted
   statistics, and settle after ACVM verifies the experiment and result receipt.

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

The decision sequence is:

1. Traditional hash work versus inference as proof
2. ACVM's result-verdict and settlement role
3. PoI as the credential for an accepted result
4. Trusted off-chain execution using separate execution and outcome proofs
5. GEO result verification
6. Trusted data space and multi-party outcome settlement
7. Social simulation as a service
8. ValidPoI, bounded weight, VRF selection, and BFT finality
9. One-order workflow with execution and business evidence
10. Result-pool and verification-cost separation
11. Attack controls and residual risks

The appendix follows the technical path from ANS signed service discovery to
fog-node local execution, a3s-box isolation, a3s-power TEE privacy plus GGUF
layer-streaming inference, and domestic-chain deployment adapters. The final
chapter presents a Rust-native ACVM chain where on-chain Agentic Contracts issue
asynchronous inference tasks and PoI Workers provide the model service through
a3s-box and a3s-power. An accepted inference resumes the contract, settles the
service, and creates bounded PoI candidate weight without making blocks wait for
model execution.

## Evidence and product boundaries

Visible slides distinguish current capabilities, proposed integrations, future
options, and illustrative data. GEO measurements and the ¥120,000 settlement
example are demonstrations rather than production claims. Candidate chains and
AVS integrations are not presented as completed work.

The speaker guide cites primary sources for every slide. The trusted-data-space
track is grounded in the State Council's data-system policy, the National Data
Administration's terminology, the *Trusted Data Space Development Action Plan
(2024-2028)*, and the 2025 *Trusted Data Space - Technology Architecture*.

## Presentation controls

- Arrow keys, space, mouse wheel, and touch gestures move between slides.
- `O` toggles slide thumbnails.
- `G` toggles the speaker guide.
- `F` toggles fullscreen presentation mode.

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
