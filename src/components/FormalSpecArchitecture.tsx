import { Icon, type IconName } from './Icons';
import type { ReactNode } from 'react';

function SpecChrome({ chapter, status }: { chapter: string; status: string }) {
  return (
    <header className="panel-chrome">
      <span><i /><i /><i /></span>
      <code>ACVM FORMAL MODEL / {chapter}</code>
      <strong><i /> {status}</strong>
    </header>
  );
}

function Equation({ number, children }: { number: string; children: ReactNode }) {
  return (
    <div className="formal-equation">
      <small>FORMAL DEFINITION</small>
      <strong>{children}</strong>
      <span>({number})</span>
    </div>
  );
}

const stateParts = [
  ['A', '身份', 'Actors'],
  ['C', '合约', 'Contracts'],
  ['T', '任务', 'Tasks'],
  ['R', '回执', 'Receipts'],
  ['P', '证明', 'Proofs'],
] as const;

export function StateModelArchitecture() {
  return (
    <div className="diagram-panel formal-panel state-model-panel">
      <SpecChrome chapter="01 · WORLD STATE" status="DRAFT SPEC" />
      <div className="formal-panel-body">
        <Equation number="ACVM.1">Σ ≡ (A, C, T, R, P)</Equation>
        <div className="state-part-grid" aria-label="ACVM 世界状态的五个组成部分">
          {stateParts.map(([code, title, detail]) => (
            <article key={code}>
              <b>{code}</b>
              <strong>{title}</strong>
              <small>{detail}</small>
            </article>
          ))}
        </div>
        <div className="formal-transition">
          <span><small>BEFORE</small><strong>Σₜ</strong></span>
          <i><code>Γ<sub>A</sub>(I, ρ)</code><b>有效意图 + 有效回执</b></i>
          <span><small>AFTER</small><strong>Σₜ₊₁</strong></span>
        </div>
      </div>
      <footer className="formal-note"><span>STATE ROOT</span><strong>root(Σ) = H(A ∥ C ∥ T ∥ R ∥ P)</strong></footer>
    </div>
  );
}

const contractParts = [
  ['I', '身份', '谁能发起'],
  ['P', '策略', '能做什么'],
  ['W', 'Worker', '执行工作负载'],
  ['V', 'Validator', '核验工作负载'],
  ['F', '终局', '何时完成'],
] as const;

export function ContractModelArchitecture() {
  return (
    <div className="diagram-panel formal-panel contract-model-panel">
      <SpecChrome chapter="02 · AGENTIC CONTRACT" status="2 WORKLOADS / 1 CONTRACT" />
      <div className="formal-panel-body">
        <Equation number="ACVM.2">C<sub>A</sub> ≡ (I, P, W<sub>box</sub>, V<sub>box</sub>, F)</Equation>
        <div className="contract-part-grid" aria-label="Agentic Contract 五元组">
          {contractParts.map(([code, title, detail], index) => (
            <div className="contract-part" key={code}>
              <article>
                <b>{code}</b>
                <strong>{title}</strong>
                <small>{detail}</small>
              </article>
              {index < contractParts.length - 1 ? <i aria-hidden="true">→</i> : null}
            </div>
          ))}
        </div>
        <div className="contract-call">
          <span><Icon name="fingerprint" /><small>CALLER</small><strong>主体 + 权限</strong></span>
          <i>→</i>
          <span className="is-contract"><Icon name="bolt" /><small>A3S-BOX / WORKER</small><strong>执行任务</strong></span>
          <i>→</i>
          <span className="is-contract"><Icon name="shield" /><small>A3S-BOX / VALIDATOR</small><strong>独立验收</strong></span>
          <i>→</i>
          <span><Icon name="receipt" /><small>ON-CHAIN TRACE</small><strong>回执 + 状态根</strong></span>
        </div>
      </div>
      <footer className="formal-note"><span>VALID CALL</span><strong>Authorize(I, P) ∧ Run_box(W) ∧ Verify_box(V) ∧ Trace(R) ∧ Finalize(F)</strong></footer>
    </div>
  );
}

const receiptWorkers: Array<[string, string, IconName]> = [
  ['API', '业务事实', 'eye'],
  ['TEE', '私密计算', 'lock'],
  ['MODEL', '模型推理', 'spark'],
];

export function ReceiptModelArchitecture() {
  return (
    <div className="diagram-panel formal-panel receipt-model-panel">
      <SpecChrome chapter="03 · RECEIPT TRANSITION" status="VERIFY BEFORE COMMIT" />
      <div className="formal-panel-body">
        <Equation number="ACVM.3">Verify(ρ) = 1 <br className="mobile-equation-break" />⇒ Σ′ = Γ<sub>A</sub>(Σ, I, ρ)</Equation>
        <div className="receipt-state-flow" aria-label="意图进入等待状态，外部执行返回回执后恢复链上状态">
          <article><span>01</span><Icon name="receipt" /><strong>提交意图</strong><small>Intent I</small></article>
          <i>→</i>
          <article className="is-pending"><span>02</span><Icon name="pause" /><strong>等待回执</strong><small>Pending</small></article>
          <i>→</i>
          <div className="receipt-worker-stack">
            {receiptWorkers.map(([title, detail, icon]) => (
              <span key={title}><Icon name={icon} /><b>{title}</b><small>{detail}</small></span>
            ))}
          </div>
          <i>→</i>
          <article className="is-receipt"><span>03</span><Icon name="shield" /><strong>核验回执</strong><small>Receipt ρ</small></article>
          <i>→</i>
          <article><span>04</span><Icon name="chain" /><strong>提交状态</strong><small>State Root</small></article>
        </div>
        <div className="receipt-fields">
          <span>taskId</span><span>prevRoot</span><span>outputCommitment</span><span>proof</span>
        </div>
      </div>
      <footer className="formal-note"><span>REJECT RULE</span><strong>Verify(ρ) = 0 ⇒ Σ′ = Σ</strong></footer>
    </div>
  );
}

const poiInputs: Array<[string, string, IconName]> = [
  ['需求签名', 'Demand', 'fingerprint'],
  ['结果验收', 'Result', 'check'],
  ['执行证明', 'Proof', 'shield'],
  ['防重放', 'Nonce', 'key'],
];

export function IntelligenceChainArchitecture() {
  return (
    <div className="diagram-panel formal-panel intelligence-chain-panel">
      <SpecChrome chapter="04 · INTELLIGENCE-PROOF CHAIN" status="USEFUL WORK ONLY" />
      <div className="formal-panel-body">
        <Equation number="ACVM.4">PoI ≡ D<sub>sig</sub> ∧ R<sub>ok</sub> <br className="mobile-equation-break" />∧ π<sub>exec</sub> ∧ ¬Replay</Equation>
        <div className="poi-proof-row" aria-label="智能证明由需求、结果、执行证明和防重放记录共同组成">
          {poiInputs.map(([title, detail, icon], index) => (
            <div className="poi-proof-part" key={title}>
              <article><Icon name={icon} /><strong>{title}</strong><small>{detail}</small></article>
              {index < poiInputs.length - 1 ? <i>∧</i> : null}
            </div>
          ))}
        </div>
        <div className="poi-chain-flow">
          <section><small>VALID POI POOL</small><strong>有效工作池</strong><span>机构 · 企业 · 个人</span></section>
          <i>→</i>
          <section><small>BFT + VRF</small><strong>提议与确认</strong><span>只从有效 PoI 中计分</span></section>
          <i>→</i>
          <section className="is-block"><small>BLOCK N+1</small><strong>智能证明区块</strong><span>stateRoot · poiRoot</span></section>
        </div>
      </div>
      <footer className="formal-note"><span>DESIGN RULE</span><strong>无需求、无验收或无执行证据，不计入 PoI</strong></footer>
    </div>
  );
}
