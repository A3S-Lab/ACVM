import { useState } from 'react';
import { Icon } from './Icons';
import { DataChip, LearningPanel } from './LearningPanel';

const trustLayers = [
  {
    id: 'application',
    index: '05',
    label: '应用层',
    guarantee: '费用和激励在任务周期内可预测',
    failure: '身份拆分、奖励操纵、串谋和价格剧烈波动',
    acvm: '预算、报价、保证金、PoI 权重、争议与结算规则',
    artifacts: ['budget', 'feePolicy', 'stake'],
  },
  {
    id: 'execution',
    index: '04',
    label: '执行层',
    guarantee: '并发工作仍能得到可验证、可归责的结果',
    failure: '相同输入产生不同结果，或只证明运行过却没有证明任务完成',
    acvm: 'Worker 回执、Validator 验收、执行版本与冻结环境',
    artifacts: ['receipt', 'codeHash', 'verdict'],
  },
  {
    id: 'consensus',
    index: '03',
    label: '共识层',
    guarantee: '排序和终局能赶上任务 deadline',
    failure: '回执已生成，但结算链迟迟没有达到所需终局',
    acvm: '终局策略、挑战期、确认门槛与超时状态转换',
    artifacts: ['finality', 'deadline', 'quorum'],
  },
  {
    id: 'network',
    index: '02',
    label: '网络层',
    guarantee: '跨链、跨域步骤保持因果顺序并能界定失败',
    failure: '消息重放、部分成功、目标链回滚或来源链终局假设不一致',
    acvm: '链适配器、sequence、replay protection、补偿与失败边界',
    artifacts: ['chainId', 'sequence', 'finalityProfile'],
  },
  {
    id: 'data',
    index: '01',
    label: '数据层',
    guarantee: '输入、输出和行动历史可长期追溯',
    failure: '结果存在，但找不到它绑定的身份、输入版本或执行记录',
    acvm: 'taskId、Intent、contractRoot、inputRoot、outputRoot 与签名回执',
    artifacts: ['taskId', 'contractRoot', 'stateRoot'],
  },
] as const;

export function TrustInfrastructureArchitecture() {
  const [activeId, setActiveId] = useState<(typeof trustLayers)[number]['id']>('execution');
  const active = trustLayers.find((layer) => layer.id === activeId) ?? trustLayers[1];

  return (
    <LearningPanel
      code="AI AGENT SCALE / FIVE-LAYER TRUST STACK"
      status="TRUST BEFORE THROUGHPUT"
      className="trust-layers-panel"
    >
      <div className="trust-layers-body">
        <div className="trust-layer-stack" aria-label="AI Agent 区块链的五层信任框架">
          {trustLayers.map((layer) => (
            <button
              className={layer.id === activeId ? 'is-active' : ''}
              type="button"
              aria-pressed={layer.id === activeId}
              onClick={() => setActiveId(layer.id)}
              key={layer.id}
            >
              <span>{layer.index}</span>
              <strong>{layer.label}</strong>
              <small>{layer.guarantee}</small>
              <i aria-hidden="true" />
            </button>
          ))}
        </div>
        <section className="trust-layer-detail" aria-live="polite">
          <header>
            <span>{active.index}</span>
            <div><small>当前约束</small><strong>{active.label}</strong></div>
          </header>
          <div>
            <small>失效时会发生什么</small>
            <p>{active.failure}</p>
          </div>
          <div>
            <small>ACVM 对应的协议对象</small>
            <p>{active.acvm}</p>
          </div>
          <footer>{active.artifacts.map((artifact) => <DataChip tone="violet" key={artifact}>{artifact}</DataChip>)}</footer>
        </section>
      </div>
      <footer className="trust-layer-rule">
        <Icon name="shield" />
        <span><small>扩容目标</small><strong>自主负载上升时，审计、终局、重放和结算保证不能一起退化。</strong></span>
        <code>TPS ≠ TRUST</code>
      </footer>
    </LearningPanel>
  );
}

const correctnessClaims = [
  ['01', '计算正确', '指定代码确实对承诺输入产生了该输出', 'zkML · TEE · 重复执行'],
  ['02', '来源可信', '输入来自约定来源，并满足版本和时效要求', '签名 · 证明 · 数据根'],
  ['03', '结果合用', '输出满足 Intent、测试集、评分规则或人工验收', 'Validator · 挑战 · 申诉'],
] as const;

export function SemanticCorrectnessArchitecture() {
  return (
    <LearningPanel
      code="CORRECT EXECUTION / CORRECT OUTCOME"
      status="VERIFY THE CLAIM"
      className="semantic-correctness-panel"
    >
      <div className="semantic-correctness-equation">
        <section className="is-transaction">
          <header><Icon name="chain" /><span><small>TRANSACTION CORRECTNESS</small><strong>交易可以被链接受</strong></span></header>
          <ul><li>签名和 nonce 有效</li><li>状态转换符合协议</li><li>回执没有重复使用</li></ul>
        </section>
        <b aria-label="不等于">≠</b>
        <section className="is-task">
          <header><Icon name="brain" /><span><small>TASK CORRECTNESS</small><strong>任务结果满足真实目标</strong></span></header>
          <ul><li>输入来源和版本正确</li><li>输出满足验收规则</li><li>外部副作用确实发生</li></ul>
        </section>
      </div>
      <div className="correctness-claims">
        {correctnessClaims.map(([index, title, detail, evidence]) => (
          <article key={index}>
            <span>{index}</span>
            <strong>{title}</strong>
            <p>{detail}</p>
            <small>{evidence}</small>
          </article>
        ))}
      </div>
      <footer className="correctness-binding">
        <span><b>Intent</b><small>定义目标</small></span><i>→</i>
        <span><b>Worker Receipt</b><small>声明执行</small></span><i>→</i>
        <span><b>Validator Verdict</b><small>接受语义</small></span><i>→</i>
        <span><b>Settlement</b><small>写入责任</small></span>
      </footer>
    </LearningPanel>
  );
}

export function AcvmConclusionArchitecture() {
  const stages = [
    {
      index: '01',
      name: 'UTXO + PoW',
      object: '所有权历史',
      rule: '签名 + UTXO + PoW 排序',
      result: '谁能花哪一笔钱',
    },
    {
      index: '02',
      name: 'EVM',
      object: '程序状态',
      rule: '交易 + EVM 重放 + stateRoot',
      result: '哪次状态转换有效',
    },
    {
      index: '03',
      name: 'ACVM',
      object: '链下任务状态',
      rule: 'Intent + 回执 + Validator + 争议',
      result: '哪个外部结果可以结算',
    },
  ] as const;

  return (
    <LearningPanel
      code="UTXO → EVM → ACVM"
      status="ONE CONSISTENT ARGUMENT"
      className="acvm-conclusion-panel"
    >
      <div className="conclusion-stages">
        {stages.map((stage, index) => (
          <div className="conclusion-stage-wrap" key={stage.name}>
            <article className={stage.name === 'ACVM' ? 'is-acvm' : ''}>
              <header><span>{stage.index}</span><strong>{stage.name}</strong></header>
              <small>共识对象</small>
              <h3>{stage.object}</h3>
              <p>{stage.rule}</p>
              <footer>{stage.result}</footer>
            </article>
            {index < stages.length - 1 ? <i aria-hidden="true">→</i> : null}
          </div>
        ))}
      </div>
      <blockquote className="conclusion-thesis">
        <Icon name="shield" />
        <p><strong>共识不必运行所有计算。</strong><span>它必须确定：什么证据有资格改变共享状态，失败后由谁负责。</span></p>
      </blockquote>
      <footer className="conclusion-checks">
        <DataChip tone="violet">授权可验证</DataChip>
        <DataChip tone="violet">执行可归责</DataChip>
        <DataChip tone="violet">结果可验收</DataChip>
        <DataChip tone="violet">争议可终局</DataChip>
        <DataChip tone="violet">结算可重放</DataChip>
      </footer>
    </LearningPanel>
  );
}
