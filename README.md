# ACVM Product Deck

This repository contains an interactive Chinese-language product presentation
for ACVM, the Agentic Contract Virtual Machine.

ACVM turns accepted useful inference into verifiable on-chain value. A valid
PoI can trigger settlement and multi-party revenue sharing, and can contribute
bounded proposer-candidate weight. A3S provides isolated inference and execution
evidence, while independent Validators evaluate frozen acceptance rules. The
near-term path anchors minimal state to existing domestic chains; the native
path implements Agentic Contract, PoI, settlement, and finality in a Rust ACVM
chain.

## Decision narrative

The 16-slide deck contains one cover, an 11-slide decision narrative, a
3-slide technical appendix, and a 1-slide native-chain close. PoI and the
trusted off-chain execution algorithm are introduced before the service network
and its scenarios:

1. **GEO result verification.** Freeze a query set, baseline, observation
   window, evidence sources, and improvement threshold; release the result pool
   only after independent observation accepts the outcome.
2. **Fog-node private execution.** Use a3s-box MicroVMs, network policy,
   read-only models, and ephemeral data volumes to keep raw data on site while
   exporting only results and signed receipts.
3. **ANS service discovery.** Resolve a signed service card to a verifiable
   identity, capability, endpoint, validity window, and revocation state before
   an ACVM order is created.
4. **Agent service rental.** Keep the model, prompt, tools, and private data
   under the owner's control; settle only after the rented service produces an
   accepted result, with optional splitRoot revenue sharing.
5. **Social simulation as a service.** Keep institutional and enterprise data
   local, run a frozen model and random process, aggregate only permitted
   statistics, and settle after ACVM verifies the experiment and result receipt.

The decision sequence is:

1. Traditional hash work versus inference as proof
2. ACVM's result-verdict and settlement role
3. PoI as the credential for an accepted result
4. Trusted off-chain execution using explicit ExecOK, OutcomeOK, anti-replay,
   and deterministic ACVM state-transition rules
5. GEO result verification
6. a3s-box fog-node private execution
7. ANS signed service discovery
8. Agent service rental and splitRoot revenue sharing
9. Social simulation as a service
10. ValidPoI, bounded weight, VRF selection, and BFT finality
11. One animated order flow combining acceptance, settlement, and risk controls

The appendix covers a3s-box isolation, a3s-power TEE privacy plus GGUF
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

The speaker guide cites primary sources for every slide. Execution claims are
grounded in the A3S, a3s-box, and a3s-power repositories; identity and agent
security boundaries reference W3C DID and OWASP guidance; consensus formulas
reference VRF and BFT specifications.

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
