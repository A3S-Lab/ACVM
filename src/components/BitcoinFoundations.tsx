import { Icon } from './Icons';
import { DataChip, FlowArrow, LearningPanel, StepBadge } from './LearningPanel';

export function BitcoinLedgerArchitecture() {
  return (
    <LearningPanel code="BITCOIN / DOUBLE-SPEND PROBLEM" status="ONE VALID HISTORY" className="bitcoin-ledger-panel">
      <div className="ledger-problem">
        <article className="concept-card ledger-source">
          <header><Icon name="key" /><small>ALICE CONTROLS</small></header>
          <strong>UTXO · 1.00 BTC</strong>
          <code>outpoint 7f2a…:0</code>
        </article>
        <div className="ledger-fork">
          <i />
          <article><span>TX A</span><strong>→ Bob</strong><small>同一个输入</small></article>
          <article className="is-conflict"><span>TX B</span><strong>→ Carol</strong><small>同一个输入</small></article>
        </div>
        <FlowArrow label="广播" />
        <div className="node-quorum" aria-label="全节点独立验证">
          {['N₁', 'N₂', 'N₃', 'N₄', 'N₅'].map((node) => <span key={node}><i />{node}</span>)}
          <small>每个节点独立验证规则</small>
        </div>
        <FlowArrow label="排序" />
        <article className="concept-card canonical-history">
          <header><Icon name="chain" /><small>CANONICAL</small></header>
          <strong>只接受一份历史</strong>
          <p><b>TX A</b> 被确认</p>
          <p className="is-rejected"><b>TX B</b> 双花失效</p>
        </article>
      </div>
      <footer className="lesson-principles">
        <StepBadge index="01">签名证明花费权</StepBadge>
        <StepBadge index="02">节点验证同一规则</StepBadge>
        <StepBadge index="03">共识决定唯一顺序</StepBadge>
      </footer>
    </LearningPanel>
  );
}

export function UtxoTransactionArchitecture() {
  return (
    <LearningPanel code="BITCOIN / TRANSACTION 7F2A…" status="BALANCED" className="utxo-panel">
      <div className="utxo-signature">
        <Icon name="fingerprint" />
        <span><small>私钥签名</small><strong>授权消费旧输出，不移动“账户余额”</strong></span>
        <DataChip tone="green">SIGNATURE OK</DataChip>
      </div>
      <div className="utxo-equation">
        <section className="utxo-column">
          <header><span>INPUTS</span><strong>0.55 BTC</strong></header>
          <article><small>UTXO A · 91bc…:1</small><strong>0.30 BTC</strong><code>锁定给 Alice</code></article>
          <article><small>UTXO B · c410…:0</small><strong>0.25 BTC</strong><code>锁定给 Alice</code></article>
        </section>
        <div className="utxo-operator"><span>=</span><small>价值守恒</small></div>
        <section className="utxo-column is-output">
          <header><span>OUTPUTS + FEE</span><strong>0.55 BTC</strong></header>
          <article><small>支付 Bob</small><strong>0.400 BTC</strong><code>新 UTXO</code></article>
          <article><small>找零 Alice</small><strong>0.149 BTC</strong><code>新 UTXO</code></article>
          <article className="is-fee"><small>矿工手续费</small><strong>0.001 BTC</strong><code>输入 − 输出</code></article>
        </section>
      </div>
      <footer className="utxo-state-change">
        <span><i className="is-spent" />旧 UTXO 从集合删除</span>
        <span><i className="is-created" />两个新 UTXO 加入集合</span>
        <code>Σ inputs = Σ outputs + fee</code>
      </footer>
    </LearningPanel>
  );
}

export function ProofOfWorkArchitecture() {
  const attempts = [
    ['88201', '9b3f…91', false],
    ['88202', '74ac…0e', false],
    ['88203', '0000…a7', true],
  ] as const;

  return (
    <LearningPanel code="BITCOIN / CANDIDATE BLOCK #842,904" status="TARGET MET" className="pow-panel">
      <div className="pow-layout">
        <section className="block-blueprint">
          <header><span>BLOCK HEADER</span><DataChip tone="amber">80 BYTES</DataChip></header>
          <dl>
            <div><dt>previousBlockHash</dt><dd>0000…19c2</dd></div>
            <div><dt>merkleRoot</dt><dd>71a8…e04f</dd></div>
            <div><dt>time · bits</dt><dd>… · target</dd></div>
            <div className="is-active"><dt>nonce</dt><dd>88,203</dd></div>
          </dl>
          <div className="merkle-mini">
            <span>TX₁</span><span>TX₂</span><span>TX₃</span><i /><strong>MERKLE ROOT</strong>
          </div>
        </section>
        <FlowArrow label="double SHA-256" />
        <section className="hash-attempts">
          <header><span>HASH ATTEMPTS</span><small>结果不可预测</small></header>
          {attempts.map(([nonce, hash, valid]) => (
            <article className={valid ? 'is-valid' : ''} key={nonce}>
              <span>nonce {nonce}</span><code>{hash}</code><b>{valid ? '< target ✓' : '> target'}</b>
            </article>
          ))}
          <p><Icon name="bolt" />找到有效哈希的是提议权，不是修改规则的权力。</p>
        </section>
      </div>
      <footer className="pow-chain">
        {['#842,902', '#842,903', '#842,904'].map((height, index) => (
          <span className={index === 2 ? 'is-current' : ''} key={height}><small>BLOCK</small><strong>{height}</strong><i /></span>
        ))}
        <code>历史越深，重写所需累计工作越多</code>
      </footer>
    </LearningPanel>
  );
}

export function BitcoinConsensusArchitecture() {
  return (
    <LearningPanel code="BITCOIN / FORK CHOICE" status="MOST WORK WINS" className="consensus-panel">
      <div className="consensus-layout">
        <section className="fork-tree">
          <header><span>临时分叉</span><small>两个矿工几乎同时出块</small></header>
          <div className="fork-origin"><span>#104</span><i /></div>
          <div className="fork-branch is-winner">
            <small>分支 A · 累计工作 107</small>
            <span>#105A</span><i /><span>#106A</span><i /><span>#107A</span>
            <b>规范链 ✓</b>
          </div>
          <div className="fork-branch is-stale">
            <small>分支 B · 累计工作 106</small>
            <span>#105B</span><i /><span>#106B</span>
            <b>stale</b>
          </div>
        </section>
        <section className="confirmation-meter">
          <header><Icon name="shield" /><span><small>交易 TX A</small><strong>3 次确认</strong></span></header>
          <div>{[1, 2, 3, 4, 5, 6].map((value) => <i className={value <= 3 ? 'is-filled' : ''} key={value}>{value}</i>)}</div>
          <p>比特币提供概率最终性：后续区块越多，重组这笔交易通常越昂贵。</p>
          <ul>
            <li><DataChip tone="green">VALID</DataChip> 先验证区块规则</li>
            <li><DataChip tone="blue">WORK</DataChip> 再比较累计工作</li>
            <li><DataChip tone="amber">REORG</DataChip> 落败分支可被回滚</li>
          </ul>
        </section>
      </div>
      <footer className="consensus-takeaway"><strong>比特币的成果</strong><span>陌生节点无需中心协调，也能收敛到同一套所有权与交易历史。</span></footer>
    </LearningPanel>
  );
}
