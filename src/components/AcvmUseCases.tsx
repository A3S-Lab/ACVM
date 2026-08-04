import { Icon, type IconName } from './Icons';
import { LearningPanel } from './LearningPanel';

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
  { step: '01', title: '定义付费结果', detail: '目标、基线、门槛和预算先冻结', record: 'Intent' },
  { step: '02', title: '执行并留证', detail: 'Agent 链下工作，回执绑定产物', record: 'Worker Receipt' },
  { step: '03', title: '验收与挑战', detail: 'Validator 检查证据，异议可复核', record: 'Verdict' },
  { step: '04', title: '终局后付款', detail: '裁决不可逆后只结算一次', record: 'Final Receipt' },
] as const;

export function AcvmUseCasesArchitecture() {
  return (
    <LearningPanel code="PAYMENT MODEL / CALLS ≠ VERIFIED OUTCOMES" status="RESULT FIRST" className="acvm-use-cases-panel">
      <section className="core-case-question">
        <span><small>按调用量付费</small><strong>CALL → RESPONSE → BILL</strong></span>
        <i aria-hidden="true">≠</i>
        <span><small>ACVM 按已验证结果付费</small><strong>INTENT → VERDICT → FINALITY → PAY</strong></span>
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
        <header><small>同一条结果协议</small><strong>业务不同，付款前都要走完四步</strong></header>
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
        <span><Icon name="brain" /><b>AI 产生候选结果</b><small>请求、Token 和算力仍用于成本计量</small></span>
        <i aria-hidden="true">→</i>
        <span><Icon name="shield" /><b>ACVM 验证付费条件</b><small>冻结规则，绑定证据，接收裁决并处理挑战</small></span>
        <i aria-hidden="true">→</i>
        <span><Icon name="receipt" /><b>区块链完成结果结算</b><small>有效回执终局后，托管资金才释放且不可重复支付</small></span>
      </footer>
    </LearningPanel>
  );
}
