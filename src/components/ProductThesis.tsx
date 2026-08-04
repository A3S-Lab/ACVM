import { Icon, LogoMark } from './Icons';
import { DataChip, LearningPanel } from './LearningPanel';

export function ProductThesis() {
  return (
    <LearningPanel code="POW → POI / EVM → ACVM" status="USEFUL COMPUTE" className="product-thesis">
      <div className="thesis-question">
        <small>ACVM 的两个替换</small>
        <strong>让同一份模型推理，既交付 AI 服务，也形成可验证的网络贡献</strong>
      </div>
      <div className="thesis-replacement">
        <section className="is-before">
          <header><Icon name="bolt" /><span><small>CONSENSUS WORK</small><strong>PoW 哈希竞争</strong></span></header>
          <p>投入电力与芯片，只为获得区块提议概率。</p>
          <DataChip tone="red">链外价值 ≈ 0</DataChip>
        </section>
        <i aria-hidden="true">→</i>
        <section className="is-after">
          <header><Icon name="brain" /><span><small>PROOF OF INTELLIGENCE</small><strong>模型推理服务证明</strong></span></header>
          <p>真实需求、执行证据和验收结果共同形成 PoI。</p>
          <DataChip tone="green">有效计算 → 候选权重</DataChip>
        </section>
      </div>
      <div className="thesis-replacement">
        <section className="is-before">
          <header><Icon name="terminal" /><span><small>APPLICATION VM</small><strong>EVM 智能合约</strong></span></header>
          <p>适合短、确定、同步、全网可重放的状态转换。</p>
          <DataChip tone="amber">AI 任务超出边界</DataChip>
        </section>
        <i aria-hidden="true">→</i>
        <section className="is-after">
          <header><LogoMark /><span><small>AGENTIC CONTRACT VM</small><strong>ACVM 智能体合约</strong></span></header>
          <p>用身份、预算、回执与验收管理异步 Agent 任务。</p>
          <DataChip tone="violet">已验证结果 → 状态与结算</DataChip>
        </section>
      </div>
      <footer className="thesis-result">
        <Icon name="spark" />
        <span><small>ONE PRODUCT LOOP</small><strong>真实需求 → 模型推理 → 结果验收 → PoI → 提议与终局 → 结算</strong></span>
      </footer>
    </LearningPanel>
  );
}
