import { useState } from 'react';
import { Icon } from './Icons';
import { DataChip, FlowArrow, LearningPanel } from './LearningPanel';

const consensusFamilies = [
  {
    id: 'pow',
    name: 'PoW',
    membership: '任何人可投入哈希算力',
    proposer: '首个找到 H(header) < target 的矿工',
    validation: '全节点重算哈希并检查全部交易',
    forkChoice: '累计工作量最大的有效链',
    finality: '概率最终性',
    tone: 'amber',
  },
  {
    id: 'pos',
    name: 'PoS',
    membership: '质押资产后进入验证者集合',
    proposer: '按质押权重和协议随机数抽取',
    validation: '委员会对区块和检查点投票',
    forkChoice: '按最新有效投票计算链头',
    finality: '超多数检查点投票',
    tone: 'blue',
  },
  {
    id: 'bft',
    name: 'BFT',
    membership: '治理或协议确定验证者集合',
    proposer: '每轮指定 Leader；超时后换轮',
    validation: '2f+1 票形成 Quorum Certificate',
    forkChoice: '锁定规则限制冲突投票',
    finality: '确定性最终性',
    tone: 'green',
  },
  {
    id: 'poa',
    name: 'PoA / DPoS',
    membership: '授权签名者或持币人选出的代表',
    proposer: '轮值、排班或委员会内部选举',
    validation: '多数签名或底层 BFT 投票',
    forkChoice: '由具体协议另行规定',
    finality: '取决于委员会协议',
    tone: 'violet',
  },
] as const;

export function ConsensusAnatomyArchitecture() {
  const [activeId, setActiveId] = useState<(typeof consensusFamilies)[number]['id']>('pow');
  const active = consensusFamilies.find((mechanism) => mechanism.id === activeId) ?? consensusFamilies[0];
  const stages = [
    ['01', '成员资格', active.membership],
    ['02', '区块提议', active.proposer],
    ['03', '独立验证', active.validation],
    ['04', '冲突处理', active.forkChoice],
    ['05', '最终确认', active.finality],
  ] as const;

  return (
    <LearningPanel code="CONSENSUS / FIVE SEPARATE DECISIONS" status="PROPOSAL ≠ FINALITY" className="consensus-anatomy-panel">
      <div className="consensus-family-tabs" role="tablist" aria-label="共识机制类型">
        {consensusFamilies.map((mechanism) => (
          <button
            type="button"
            role="tab"
            aria-selected={mechanism.id === activeId}
            className={mechanism.id === activeId ? 'is-active' : ''}
            onClick={() => setActiveId(mechanism.id)}
            key={mechanism.id}
          >{mechanism.name}</button>
        ))}
      </div>
      <div className="consensus-five-stages">
        {stages.map(([index, title, detail], position) => (
          <div className="consensus-stage" key={index}>
            <article className={`is-${active.tone}`}>
              <span>{index}</span>
              <strong>{title}</strong>
              <small>{detail}</small>
            </article>
            {position < stages.length - 1 ? <FlowArrow /> : null}
          </div>
        ))}
      </div>
      <footer className="consensus-definition">
        <Icon name="shield" />
        <span><strong>“记账权”只覆盖区块提议</strong><small>候选区块仍须通过规则验证、冲突处理和最终性条件。</small></span>
      </footer>
    </LearningPanel>
  );
}

export function ProofOfStakeArchitecture() {
  const slots = [
    ['S₀', 'V₁₄', 'PROPOSED'],
    ['S₁', 'V₀₇', 'MISSED'],
    ['S₂', 'V₂₁', 'PROPOSED'],
    ['S₃', 'V₀₃', 'PROPOSED'],
  ] as const;

  return (
    <LearningPanel code="ETHEREUM POS / SLOT → ATTESTATION → FINALITY" status="GASPER" className="pos-consensus-panel">
      <div className="pos-selection">
        <section>
          <header><Icon name="key" /><span><small>VALIDATOR SET</small><strong>质押进入候选集合</strong></span></header>
          <code>P(proposer = i) ∝ effectiveBalanceᵢ</code>
          <p>RANDAO 产生协议随机数，每个 slot 选出一名提议者和若干委员会成员。</p>
        </section>
        <FlowArrow label="每 12 秒一个 slot" />
        <div className="pos-slots">
          {slots.map(([slot, validator, status]) => (
            <article className={status === 'MISSED' ? 'is-missed' : ''} key={slot}>
              <span>{slot}</span><strong>{validator}</strong><small>{status}</small>
            </article>
          ))}
        </div>
      </div>
      <div className="pos-voting">
        <section><small>FORK CHOICE</small><strong>LMD-GHOST</strong><p>最新有效 attestations 决定链头。</p></section>
        <section><small>CHECKPOINT VOTES</small><strong>Casper FFG</strong><p>占总质押量 2/3 的投票建立 supermajority link。</p></section>
        <section className="is-final"><small>FINALITY</small><strong>Justified → Finalized</strong><p>冲突终局需要至少 1/3 质押违反可罚没条件。</p></section>
      </div>
      <footer className="pos-penalties">
        <DataChip tone="blue">PROPOSER</DataChip><span>构造候选区块</span>
        <DataChip tone="green">ATTESTERS</DataChip><span>检查并投票</span>
        <DataChip tone="red">SLASHING</DataChip><span>惩罚双重提议和冲突投票</span>
      </footer>
    </LearningPanel>
  );
}

export function BftConsensusArchitecture() {
  const replicas = [
    ['V₀', 'LEADER', false],
    ['V₁', 'VOTE ✓', false],
    ['V₂', 'VOTE ✓', false],
    ['V₃', 'FAULT', true],
  ] as const;

  return (
    <LearningPanel code="BFT / 3f + 1 REPLICAS · f = 1" status="QC = 2f + 1" className="bft-consensus-panel">
      <div className="bft-round">
        <section className="bft-proposal">
          <span>VIEW 18</span><Icon name="receipt" /><strong>Leader 提议 Block B</strong><code>parentQC = QC₁₇</code>
        </section>
        <FlowArrow label="PROPOSE" />
        <div className="bft-replicas">
          {replicas.map(([name, status, faulty]) => (
            <article className={faulty ? 'is-faulty' : ''} key={name}>
              <i /><strong>{name}</strong><small>{status}</small>
            </article>
          ))}
        </div>
        <FlowArrow label="3 SIGNATURES" />
        <section className="bft-qc"><Icon name="shield" /><strong>QC₁₈</strong><small>3 / 4 votes</small></section>
      </div>
      <div className="bft-math">
        <section><code>n = 3f + 1</code><span>4 个节点容忍 1 个拜占庭故障</span></section>
        <section><code>q = 2f + 1</code><span>任意两个 quorum 至少共享 f+1 个节点</span></section>
        <section><code>timeout → view + 1</code><span>Leader 无响应时触发换轮</span></section>
      </div>
      <footer className="bft-finality"><strong>Leader 没有单方面记账权。</strong><span>区块获得 QC 并满足协议锁定/提交规则后才进入最终状态。</span></footer>
    </LearningPanel>
  );
}

const governedMechanisms = [
  {
    id: 'poa',
    name: 'PoA',
    membership: '治理流程维护授权签名者名单',
    schedule: 'Clique 等协议采用轮值签名和备用签名者',
    confirmation: '签名者多数与最近签名限制抑制短分叉',
    boundary: '安全依赖身份治理、密钥保护和成员撤换',
  },
  {
    id: 'dpos',
    name: 'DPoS',
    membership: '持币人投票选出有限数量的区块生产者',
    schedule: '入选代表按排班或委员会协议出块',
    confirmation: '常与 BFT 投票或不可逆区块规则组合',
    boundary: '投票集中、代理串谋和低参与率会削弱治理',
  },
  {
    id: 'raft',
    name: 'Raft',
    membership: '固定、受管理的服务器集合',
    schedule: '多数票选出任期 Leader，由 Leader 复制日志',
    confirmation: '多数副本写入后提交',
    boundary: '只容忍宕机故障，不容忍节点伪造或双重投票',
  },
  {
    id: 'poi',
    name: 'PoI',
    membership: '已验收任务可形成贡献或信誉权重',
    schedule: '权重可参与候选筛选，但仍需可验证随机选择',
    confirmation: '必须接入 BFT、PoS 或其他最终性协议',
    boundary: '贡献质量、刷单和 Validator 串谋属于机制设计问题',
  },
] as const;

export function GovernanceConsensusArchitecture() {
  const [activeId, setActiveId] = useState<(typeof governedMechanisms)[number]['id']>('poa');
  const active = governedMechanisms.find((mechanism) => mechanism.id === activeId) ?? governedMechanisms[0];

  return (
    <LearningPanel code="CONSENSUS / MEMBERSHIP & GOVERNANCE" status="NAME THE TRUST ASSUMPTION" className="governance-consensus-panel">
      <div className="governance-tabs" role="tablist" aria-label="授权与委托类共识">
        {governedMechanisms.map((mechanism) => (
          <button type="button" role="tab" aria-selected={mechanism.id === activeId} className={mechanism.id === activeId ? 'is-active' : ''} onClick={() => setActiveId(mechanism.id)} key={mechanism.id}>
            {mechanism.name}
          </button>
        ))}
      </div>
      <div className="governance-detail">
        <header><span>SELECTED MODEL</span><strong>{active.name}</strong></header>
        <dl>
          <div><dt>谁能参与</dt><dd>{active.membership}</dd></div>
          <div><dt>谁来提议</dt><dd>{active.schedule}</dd></div>
          <div><dt>怎样确认</dt><dd>{active.confirmation}</dd></div>
          <div><dt>主要边界</dt><dd>{active.boundary}</dd></div>
        </dl>
      </div>
      <footer className="governance-warning"><Icon name="eye" /><span><strong>PoA、DPoS、PoI 主要定义成员或权重来源。</strong><small>区块排序、冲突处理和最终性仍由具体协议完成。</small></span></footer>
    </LearningPanel>
  );
}
