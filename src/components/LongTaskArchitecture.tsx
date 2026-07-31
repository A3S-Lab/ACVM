import { useState } from 'react';
import { Icon, type IconName } from './Icons';

const stages: Array<{
  code: string;
  label: string;
  icon: IconName;
  title: string;
  body: string;
  privateData: string;
  publicData: string;
}> = [
  {
    code: '01',
    label: '固定完成条件',
    icon: 'terminal',
    title: '任务开始前，把“完成”写成可验证谓词',
    body: 'Manifest 固定目标、责任主体、允许工具、里程碑、截止时间、验收电路版本和结算分支。执行者不能在任务中途降低门槛。',
    privateData: '企业任务书、内部评审细则',
    publicData: 'manifestHash · ruleHash · deadline',
  },
  {
    code: '02',
    label: '连续状态承诺',
    icon: 'chain',
    title: '每个里程碑承接上一个状态根',
    body: 'ACVM 状态机消费签名事件和工具回执，产生新的状态根。等待、暂停、重试和人工审批也属于明确状态，不靠一份期末报告补写过程。',
    privateData: '原始文档、日志、实验数据、工具返回值',
    publicData: 'C₀ → C₁ → C₂ … → Cₙ',
  },
  {
    code: '03',
    label: '生成完成证明',
    icon: 'fingerprint',
    title: '零知识电路证明过程连续且验收条件成立',
    body: '证明系统在私下检查全部状态转移、授权范围、回执签名和最终验收谓词，只输出完成证明与公共状态，不公开长期任务轨迹。',
    privateData: 'eventᵢ · receiptᵢ · witnessᵢ · acceptance inputs',
    publicData: 'πcomplete · C₀ · Cₙ · ruleHash',
  },
  {
    code: '04',
    label: '联盟链验证',
    icon: 'check',
    title: '节点验证证明后确认终局，而不是重跑数月任务',
    body: '联盟节点核对发布者身份、规则版本、最终状态根和零知识证明。验证通过后记录完成事实，ACVM 才进入结算、拨付或下一阶段。',
    privateData: '不读取中间文件、提示词或企业数据',
    publicData: 'Verify(πcomplete, public inputs) = true',
  },
];

const checkpoints = [
  ['M0', '任务生效', 'C₀'],
  ['M1', '资料完成', 'C₁'],
  ['M2', '阶段验收', 'C₂'],
  ['M3', '受控暂停', 'C₃'],
  ['M4', '恢复执行', 'C₄'],
  ['M5', '最终交付', 'C₅'],
  ['M6', '证明完成', 'C₆'],
] as const;

export function LongTaskArchitecture() {
  const [stage, setStage] = useState(0);
  const current = stages[stage];

  return (
    <div className="long-task-architecture">
      <div className="long-task-timeline" style={{ '--proof-progress': `${stage * 33.333}%` } as React.CSSProperties}>
        <header>
          <span>PROJECT ED-37 · 180 DAYS</span>
          <strong>科研项目第二阶段里程碑</strong>
          <small>任务运行时间不受单个区块限制</small>
        </header>
        <div>
          {checkpoints.map(([month, label, root], index) => {
            const checkpointStage = Math.min(3, Math.floor(index / 2));
            return (
              <button
                type="button"
                key={month}
                className={checkpointStage < stage ? 'is-done' : checkpointStage === stage ? 'is-active' : ''}
                onClick={() => setStage(checkpointStage)}
              >
                <span>{checkpointStage < stage ? <Icon name="check" /> : month}</span>
                <strong>{label}</strong>
                <small>{root}</small>
              </button>
            );
          })}
        </div>
        <footer>
          <code>Cᵢ = H(Cᵢ₋₁, eventᵢ, receiptᵢ)</code>
          <span>每个承诺都引用前序状态，缺一段就无法生成最终证明。</span>
        </footer>
      </div>

      <div className="proof-stage-layout">
        <nav aria-label="长期任务证明步骤">
          {stages.map((item, index) => (
            <button
              type="button"
              key={item.code}
              className={stage === index ? 'is-active' : ''}
              onClick={() => setStage(index)}
              aria-current={stage === index ? 'step' : undefined}
            >
              <span>{item.code}</span>
              <Icon name={item.icon} />
              <strong>{item.label}</strong>
            </button>
          ))}
        </nav>

        <section className="proof-stage-detail" aria-live="polite">
          <div><span>{current.code}</span><Icon name={current.icon} /></div>
          <article>
            <small>{current.label}</small>
            <h3>{current.title}</h3>
            <p>{current.body}</p>
          </article>
          <aside>
            <div><Icon name="lock" /><span><small>PRIVATE WITNESS</small><strong>{current.privateData}</strong></span></div>
            <div><Icon name="eye" /><span><small>PUBLIC INPUT / OUTPUT</small><strong>{current.publicData}</strong></span></div>
          </aside>
        </section>
      </div>

      <div className="proof-equation">
        <span><small>CHAIN VERIFIER</small><code>Verify(πcomplete, C₀, Cₙ, ruleHash, identityCommitment)</code></span>
        <Icon name="arrow" />
        <strong><Icon name="check" /> completed = true</strong>
        <p>证明任务按既定规则完成；不证明模型永远正确，也不公开任务过程。</p>
      </div>
    </div>
  );
}
