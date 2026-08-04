import { Icon, LogoMark } from './Icons';
import { DataChip, LearningPanel } from './LearningPanel';

export function ProductThesis() {
  return (
    <LearningPanel code="POW → POI / EVM → ACVM" status="USEFUL COMPUTE" className="product-thesis">
      <div className="thesis-question">
        <small>两个替换，一条订单</small>
        <strong>客户拿到结果，网络拿到可验证工作</strong>
      </div>
      <div className="thesis-replacement">
        <section className="is-before">
          <header><Icon name="bolt" /><span><small>CONSENSUS WORK</small><strong>PoW 哈希竞争</strong></span></header>
          <p>投入电力与芯片，产出只用于竞争提议机会。</p>
          <DataChip tone="red">链外价值 ≈ 0</DataChip>
        </section>
        <i aria-hidden="true">→</i>
        <section className="is-after">
          <header><Icon name="brain" /><span><small>PROOF OF INTELLIGENCE</small><strong>模型推理服务证明</strong></span></header>
          <p>真实订单完成并通过验收后，才生成 PoI。</p>
          <DataChip tone="green">有效计算 → 候选权重</DataChip>
        </section>
      </div>
      <div className="thesis-replacement">
        <section className="is-before">
          <header><Icon name="terminal" /><span><small>APPLICATION VM</small><strong>EVM 智能合约</strong></span></header>
          <p>每个节点重放同一段确定性计算。</p>
          <DataChip tone="amber">AI 任务超出边界</DataChip>
        </section>
        <i aria-hidden="true">→</i>
        <section className="is-after">
          <header><LogoMark /><span><small>AGENTIC CONTRACT VM</small><strong>ACVM 智能体合约</strong></span></header>
          <p>管理身份、预算、外部工具、回执和验收。</p>
          <DataChip tone="violet">已验证结果 → 状态与结算</DataChip>
        </section>
      </div>
      <footer className="thesis-result">
        <Icon name="spark" />
        <span><small>ONE ORDER</small><strong>真实需求 → 找 Agent → 执行 → 验收 → 付款 + PoI</strong></span>
      </footer>
    </LearningPanel>
  );
}
