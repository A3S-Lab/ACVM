import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks';
import { Icon } from './Icons';

const proofStages = [
  {
    key: 'goal',
    label: '目标承诺',
    tag: 'GOAL COMMITMENT · ON-CHAIN',
    title: '先固定任务目标、验收规则和证明程序',
    detail: '制造企业发布 180 天节能任务，链上记录目标承诺 G·8D31 与验证密钥版本。',
  },
  {
    key: 'milestones',
    label: '状态承诺',
    tag: 'ORDERED STATE ROOTS',
    title: '长期执行过程形成连续的里程碑状态承诺',
    detail: '工具签名、TEE 证明和任务状态被绑定到 M₁、M₂、M₃；原始能耗与生产数据仍留在企业侧。',
  },
  {
    key: 'prove',
    label: '生成证明',
    tag: 'ZK COMPLETION PROOF',
    title: '证明全部里程碑满足同一份完成规则',
    detail: 'a3s-box 内的证明器验证承诺链、授权工具证据与最终指标，输出 Completion Proof π。',
  },
  {
    key: 'verify',
    label: '链上验证',
    tag: 'VERIFIER · TRUE',
    title: '联盟链确认“任务完成”，不读取任务隐私',
    detail: '验证合约检查 π、公开结果和承诺根，多机构共识后把完成凭证写入新区块。',
  },
] as const;

const milestones = [
  ['M₁ · DAY 30', '设备接入完成', '0x21A7'],
  ['M₂ · DAY 90', '基线稳定有效', '0x5BC2'],
  ['M₃ · DAY 180', '节能率 ≥ 12%', '0x91E4'],
] as const;

export function LongTaskProof({ active = true }: { active?: boolean }) {
  const reducedMotion = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const current = proofStages[stage];

  useEffect(() => {
    if (!active || reducedMotion || !playing) return;
    const timer = window.setInterval(() => {
      setStage((value) => (value + 1) % proofStages.length);
    }, 2450);
    return () => window.clearInterval(timer);
  }, [active, playing, reducedMotion]);

  useEffect(() => {
    if (!active) return;
    setStage(0);
    setPlaying(true);
  }, [active]);

  return (
    <div className={`long-proof long-proof--${current.key}`} data-testid="long-task-proof">
      <div className="long-proof-toolbar">
        <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
        <div>
          <small>LONG-RUNNING AGENTICCONTRACT</small>
          <strong>产线节能任务 · AC #204</strong>
        </div>
        <button
          type="button"
          onClick={() => {
            if (reducedMotion) setStage((stage + 1) % proofStages.length);
            else setPlaying((value) => !value);
          }}
          aria-label={reducedMotion ? '播放下一步' : playing ? '暂停动画' : '继续动画'}
        >
          <Icon name={reducedMotion || !playing ? 'play' : 'pause'} />
          <span>{reducedMotion ? '下一步' : playing ? '暂停' : '继续'}</span>
        </button>
      </div>

      <div className="long-proof-task">
        <span><Icon name="fingerprint" /></span>
        <div><small>企业身份与责任主体</small><strong>华东制造 · 节能服务商 · ACVM</strong></div>
        <em><i /> {stage === 3 ? 'COMPLETED · VERIFIED' : 'TASK ACTIVE'}</em>
      </div>

      <div className="long-proof-flow">
        <section className="commitment-column" aria-label="任务状态承诺">
          <header><span>链下私密状态</span><small>PRIVATE</small></header>
          <div className="goal-commitment">
            <span><Icon name="receipt" /></span>
            <div><small>GOAL · G</small><strong>归一化能耗下降 ≥ 12%</strong></div>
            <em>8D31</em>
          </div>
          <div className="milestone-list">
            {milestones.map(([time, label, hash], index) => (
              <div key={time} style={{ '--milestone-index': index } as React.CSSProperties}>
                <i><Icon name={stage >= 1 ? 'check' : 'lock'} /></i>
                <span><small>{time}</small><strong>{label}</strong></span>
                <em>{hash}</em>
              </div>
            ))}
          </div>
          <p><Icon name="lock" /> 文件、业务数据、推理轨迹不公开</p>
        </section>

        <div className="proof-bridge proof-bridge--left" aria-hidden="true"><i /><span /></div>

        <section className="zk-proof-engine" aria-label="零知识完成证明生成器">
          <span className="zk-proof-ring"><i /><i /></span>
          <div className="zk-proof-core">
            <Icon name={stage >= 2 ? 'shield' : 'lock'} />
            <small>ZK COMPLETION</small>
            <strong>π · 7A04</strong>
            <em>{stage >= 2 ? 'PROOF READY' : 'WAITING'}</em>
          </div>
          <div className="proof-inputs">
            <span>工具签名</span><span>TEE 证明</span><span>状态承诺链</span>
          </div>
        </section>

        <div className="proof-bridge proof-bridge--right" aria-hidden="true"><i /><span /></div>

        <section className="proof-ledger" aria-label="联盟链验证与完成凭证">
          <header><span>联盟链验证</span><small>{stage === 3 ? 'CONSENSUS 3/3' : 'WAITING'}</small></header>
          <div className="proof-consensus-nodes" aria-label="企业、服务商和审计节点">
            <span>企</span><span>服</span><span>审</span>
          </div>
          <div className="proof-blocks">
            <div className="is-committed"><small>#18420</small><strong>G · 8D31</strong><em>目标</em></div>
            <i><Icon name="chain" /></i>
            <div className={stage >= 1 ? 'is-committed' : ''}><small>#18421</small><strong>ROOT · C907</strong><em>状态</em></div>
            <i><Icon name="chain" /></i>
            <div className={stage === 3 ? 'is-verified' : ''}><small>#18422</small><strong>{stage === 3 ? 'TRUE · 7A04' : 'NEXT BLOCK'}</strong><em>完成</em></div>
          </div>
          <div className={`completion-receipt ${stage === 3 ? 'is-ready' : ''}`}>
            <Icon name={stage === 3 ? 'check' : 'chain'} />
            <span><small>PUBLIC RESULT</small><strong>{stage === 3 ? '任务已完成 · 可审计' : '等待完成证明'}</strong></span>
          </div>
        </section>
      </div>

      <div className="long-proof-footer" aria-live="polite">
        <span>0{stage + 1}</span>
        <div><small>{current.tag}</small><strong>{current.title}</strong><p>{current.detail}</p></div>
        <nav aria-label="长期任务证明步骤">
          {proofStages.map((item, index) => (
            <button
              type="button"
              key={item.key}
              className={index === stage ? 'is-active' : index < stage ? 'is-passed' : ''}
              onClick={() => {
                setStage(index);
                setPlaying(false);
              }}
              aria-label={item.label}
              aria-current={index === stage ? 'step' : undefined}
            ><i />{item.label}</button>
          ))}
        </nav>
      </div>
    </div>
  );
}
