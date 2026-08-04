import { Icon, LogoMark } from './Icons';
import { DataChip, LearningPanel } from './LearningPanel';

export function ProductThesis() {
  return (
    <LearningPanel code="CALL → VERDICT / COMPUTE → POI" status="ONE ORDER" className="product-thesis">
      <div className="thesis-question">
        <small>一笔订单，两份价值</small>
        <strong>客户拿到已验收结果，网络拿到有效工作</strong>
      </div>
      <div className="thesis-replacement">
        <section className="is-before">
          <header><Icon name="bolt" /><span><small>PROOF OF WORK</small><strong>哈希竞争</strong></span></header>
          <p>付出计算成本，只得到区块提议机会。</p>
          <DataChip tone="red">客户结果 = 0</DataChip>
        </section>
        <i aria-hidden="true">→</i>
        <section className="is-after">
          <header><Icon name="brain" /><span><small>PROOF OF INTELLIGENCE</small><strong>已验收模型服务</strong></span></header>
          <p>先交付客户结果，再把证明计入 PoI。</p>
          <DataChip tone="green">客户结果 + 候选权重</DataChip>
        </section>
      </div>
      <div className="thesis-replacement">
        <section className="is-before">
          <header><Icon name="terminal" /><span><small>DETERMINISTIC CONTRACT</small><strong>EVM 型智能合约</strong></span></header>
          <p>全网重放确定性计算，管不了长任务与外部工具。</p>
          <DataChip tone="amber">只验证链内状态</DataChip>
        </section>
        <i aria-hidden="true">→</i>
        <section className="is-after">
          <header><LogoMark /><span><small>AGENTIC CONTRACT VM</small><strong>ACVM 智能体合约</strong></span></header>
          <p>管理身份、预算、权限、回执、验收和补偿。</p>
          <DataChip tone="violet">管理一笔 AI 订单</DataChip>
        </section>
      </div>
      <footer className="thesis-result">
        <Icon name="spark" />
        <span><small>ONE ORDER</small><strong>真实需求 → 找 Agent → 执行 → 验收 → 付款 + PoI</strong></span>
      </footer>
    </LearningPanel>
  );
}
