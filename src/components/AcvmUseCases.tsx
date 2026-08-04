import { Icon, type IconName } from './Icons';
import { DataChip, LearningPanel } from './LearningPanel';

const coreCases = [
  {
    index: '01',
    icon: 'eye',
    name: 'GEO 结果验证即服务',
    buyerWants: '生成式搜索中的真实引用增量',
    hardPart: '查询会波动，执行者不能自己给自己打分',
    acvmChecks: '冻结基线 + 独立观测 + 增量裁决',
    tone: 'green',
  },
  {
    index: '02',
    icon: 'lock',
    name: '社会模拟即服务',
    buyerWants: '不泄露个体数据的群体决策证据',
    hardPart: '输入敏感，模型假设和随机过程必须可复核',
    acvmChecks: '假设承诺 + 安全聚合 + 独立复现实验',
    tone: 'violet',
  },
] as const satisfies readonly {
  index: string;
  icon: IconName;
  name: string;
  buyerWants: string;
  hardPart: string;
  acvmChecks: string;
  tone: 'green' | 'violet';
}[];

const sharedFlow = [
  { step: '01', title: '冻结规则', detail: '目标、输入版本、基线和验收谓词', record: 'Intent' },
  { step: '02', title: '链下执行', detail: 'Agent 调模型、数据和外部工具', record: 'Artifact' },
  { step: '03', title: '独立验收', detail: 'Validator 检查约定命题与证据', record: 'Verdict' },
  { step: '04', title: '终局结算', detail: '挑战结束后更新状态并付款', record: 'Receipt' },
] as const;

export function AcvmUseCasesArchitecture() {
  return (
    <LearningPanel code="CASE FILE / TWO JOBS, ONE PROTOCOL" status="START WITH THE OUTCOME" className="acvm-use-cases-panel">
      <section className="core-case-question">
        <span><small>贯穿全场的问题</small><strong>Agent 说“做完了”，谁来证明结果值得付款？</strong></span>
        <DataChip tone="amber">不是按调用次数付费</DataChip>
      </section>

      <div className="use-case-catalog" aria-label="ACVM 两个核心使用场景">
        {coreCases.map((scenario) => (
          <article className={`is-${scenario.tone}`} key={scenario.name}>
            <header><span><Icon name={scenario.icon} /></span><div><small>CORE CASE {scenario.index}</small><strong>{scenario.name}</strong></div></header>
            <dl>
              <div><dt>真正购买</dt><dd>{scenario.buyerWants}</dd></div>
              <div><dt>验证难点</dt><dd>{scenario.hardPart}</dd></div>
              <div><dt>ACVM 检查</dt><dd>{scenario.acvmChecks}</dd></div>
            </dl>
          </article>
        ))}
      </div>

      <section className="core-case-shared-flow" aria-label="两个场景共享的 ACVM 工作流">
        <header><small>同一条协议骨架</small><strong>业务不同，状态推进规则不变</strong></header>
        <div>
          {sharedFlow.map((node, index) => (
            <span className="shared-flow-segment" key={node.step}>
              <article><b>{node.step}</b><strong>{node.title}</strong><p>{node.detail}</p><code>{node.record}</code></article>
              {index < sharedFlow.length - 1 ? <i aria-hidden="true">→</i> : null}
            </span>
          ))}
        </div>
      </section>

      <footer className="use-case-invariant">
        <span><Icon name="brain" /><b>Agent 负责做事</b><small>执行仍在模型、API 与私有数据所在的链下环境</small></span>
        <i aria-hidden="true">→</i>
        <span><Icon name="shield" /><b>ACVM 负责验收</b><small>固定证据规则，接收裁决并处理挑战</small></span>
        <i aria-hidden="true">→</i>
        <span><Icon name="receipt" /><b>区块链负责终局</b><small>只有有效回执才能改变任务状态和资金归属</small></span>
      </footer>
    </LearningPanel>
  );
}
