import { Icon } from './Icons';
import { DataChip, FlowArrow, LearningPanel, StepBadge } from './LearningPanel';

export function EthereumStateArchitecture() {
  return (
    <LearningPanel code="ACCOUNT MODEL / WORLD STATE" status="STATE ROOT UPDATED" className="eth-state-panel">
      <div className="model-transition">
        <section className="model-card is-utxo">
          <header><span>UTXO MODEL</span><DataChip tone="amber">UTXO SET</DataChip></header>
          <strong>验证“哪些输出还没花”</strong>
          <div><code>91bc…:1</code><b>0.30 TOKEN</b></div>
          <div><code>c410…:0</code><b>0.25 TOKEN</b></div>
          <small>状态适合表达价值所有权</small>
        </section>
        <FlowArrow label="抽象升级" />
        <section className="model-card is-account">
          <header><span>ACCOUNT MODEL</span><DataChip tone="blue">WORLD STATE</DataChip></header>
          <strong>验证“每个账户现在是什么状态”</strong>
          <div><code>Alice</code><b>balance · nonce</b></div>
          <div><code>Contract</code><b>code · storage</b></div>
          <small>状态可以承载通用程序</small>
        </section>
      </div>
      <div className="state-diff">
        <header><span>TRANSACTION STATE DIFF</span><code>S′ = Υ(S, T)</code></header>
        <div><small>Alice.nonce</small><del>7</del><i>→</i><ins>8</ins></div>
        <div><small>Alice.balance</small><del>10.00 TOKEN</del><i>→</i><ins>9.98 TOKEN</ins></div>
        <div><small>Counter.storage[0]</small><del>41</del><i>→</i><ins>42</ins></div>
        <strong><Icon name="chain" />全部变化汇总为新的 stateRoot</strong>
      </div>
    </LearningPanel>
  );
}

export function EvmArchitecture() {
  return (
    <LearningPanel code="EVM / DETERMINISTIC EXECUTION" status="RECEIPT CREATED" className="evm-panel">
      <div className="evm-flow">
        <article className="concept-card evm-call">
          <header><Icon name="fingerprint" /><small>SIGNED TX</small></header>
          <strong>Counter.increment()</strong>
          <code>to · value · data · nonce</code>
        </article>
        <FlowArrow />
        <section className="evm-machine">
          <header><span>EVM</span><DataChip tone="blue">SAME INPUT</DataChip></header>
          <div className="evm-opcodes"><code>PUSH</code><code>SLOAD</code><code>ADD</code><code>SSTORE</code><code>LOG</code></div>
          <div className="evm-memory">
            <span><small>STACK</small><b>0x2a</b></span>
            <span><small>MEMORY</small><b>temporary</b></span>
            <span><small>STORAGE</small><b>persistent</b></span>
          </div>
          <footer>每个验证节点重放同一字节码</footer>
        </section>
        <FlowArrow />
        <article className="concept-card evm-result">
          <header><Icon name="receipt" /><small>OUTPUT</small></header>
          <strong>storage[0] = 42</strong>
          <code>status · gasUsed · logs</code>
        </article>
      </div>
      <footer className="evm-invariant">
        <StepBadge index="01">字节码固定</StepBadge>
        <StepBadge index="02">输入与前态固定</StepBadge>
        <StepBadge index="03">所有诚实节点得到同一后态</StepBadge>
      </footer>
    </LearningPanel>
  );
}

export function EthereumTransactionArchitecture() {
  const stages = [
    ['01', '钱包签名', 'nonce = 8'],
    ['02', '进入 mempool', '等待排序'],
    ['03', '区块提议者打包', '固定执行顺序'],
    ['04', 'EVM 执行', '计量每个操作'],
    ['05', '生成回执', '状态与日志可查'],
    ['06', '共识最终确认', '结果成为链上状态'],
  ] as const;

  return (
    <LearningPanel code="ACCOUNT TX / EXECUTION LIFECYCLE" status="21,000+ GAS" className="eth-transaction-panel">
      <div className="transaction-timeline">
        {stages.map(([index, title, detail], position) => (
          <article className={position === 3 ? 'is-active' : ''} key={index}>
            <span>{index}</span><i /><strong>{title}</strong><small>{detail}</small>
          </article>
        ))}
      </div>
      <div className="gas-accounting">
        <section>
          <header><Icon name="bolt" /><span><small>资源计量</small><strong>Gas</strong></span></header>
          <p>计算、存储和字节数据都有协议定义的成本，阻止无限循环占满全网。</p>
        </section>
        <div className="gas-formula">
          <code>transaction fee</code>
          <strong>gasUsed × effectiveGasPrice</strong>
          <span><b>48,231</b><i>×</i><b>18 gas-price units</b><i>=</i><b>0.000868158 TOKEN</b></span>
        </div>
        <section className="gas-failure">
          <header><Icon name="shield" /><span><small>执行失败</small><strong>REVERT</strong></span></header>
          <p>业务状态回滚，但已消耗的计算资源仍要付费，发送方 nonce 仍会推进。</p>
        </section>
      </div>
    </LearningPanel>
  );
}

export function DeterminismBoundaryArchitecture() {
  const onchain = ['签名验证', '哈希与算术', 'EVM 字节码', '已有链上状态'];
  const offchain = ['HTTP / 数据库', 'LLM 推理', '私有业务数据', '长耗时工具调用'];

  return (
    <LearningPanel code="EVM / CONSENSUS BOUNDARY" status="NO NATIVE HTTP" className="boundary-panel">
      <div className="boundary-worlds">
        <section className="boundary-zone is-onchain">
          <header><Icon name="chain" /><span><small>共识域</small><strong>确定性、有限、可重放</strong></span></header>
          <div>{onchain.map((item) => <DataChip tone="blue" key={item}>{item}</DataChip>)}</div>
          <p>节点只有拿到相同输入并执行同一规则，才能对 stateRoot 达成共识。</p>
        </section>
        <div className="boundary-gate">
          <span>ORACLE<br />BOUNDARY</span>
          <i /><Icon name="lock" />
          <small>外部事实不能被直接读取</small>
        </div>
        <section className="boundary-zone is-offchain">
          <header><Icon name="eye" /><span><small>外部世界</small><strong>变化、私密、不可重放</strong></span></header>
          <div>{offchain.map((item) => <DataChip tone="violet" key={item}>{item}</DataChip>)}</div>
          <p>预言机或执行者只能“提交声明”；合约还需要来源、证明或争议规则决定是否接受。</p>
        </section>
      </div>
      <footer className="boundary-question">
        <span>确定性虚拟机留下的问题</span>
        <strong>如果结果来自 AI，链上究竟验证什么？</strong>
        <a href="#ai-gap">进入 AI × 区块链 <Icon name="arrow" /></a>
      </footer>
    </LearningPanel>
  );
}
