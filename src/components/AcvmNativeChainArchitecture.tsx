import { Icon, type IconName } from './Icons';
import { LearningPanel } from './LearningPanel';

const inferenceServiceStages = [
  {
    index: '01',
    eyebrow: 'ON-CHAIN ACVM',
    title: '发布推理任务',
    detail: '模型根 · 输入根 · 验收规则',
    output: 'InferenceTask',
    icon: 'receipt',
    tone: 'chain',
  },
  {
    index: '02',
    eyebrow: 'POI WORKER',
    title: '提供模型推理',
    detail: 'a3s-box · a3s-power',
    output: 'ExecReceipt',
    icon: 'brain',
    tone: 'compute',
  },
  {
    index: '03',
    eyebrow: 'VALIDATOR',
    title: '验收执行与结果',
    detail: '运行证明 · 业务证据',
    output: 'AcceptedResult',
    icon: 'eye',
    tone: 'verify',
  },
  {
    index: '04',
    eyebrow: 'ON-CHAIN ACVM',
    title: '恢复合约并结算',
    detail: '状态转换 · 分账 · 防重放',
    output: 'ValidPoI',
    icon: 'shield',
    tone: 'chain',
  },
] as const satisfies readonly {
  index: string;
  eyebrow: string;
  title: string;
  detail: string;
  output: string;
  icon: IconName;
  tone: 'chain' | 'compute' | 'verify';
}[];

export function AcvmNativeChainArchitecture() {
  return (
    <LearningPanel code="RUST ACVM NATIVE CHAIN" status="ASYNC INFERENCE · DETERMINISTIC FINALITY" className="native-chain-panel">
      <div className="native-chain-service-flow" aria-label="链上 ACVM 发布推理任务，PoI Worker 通过 a3s-box 和 a3s-power 提供推理服务，Validator 验收后恢复合约状态并生成 ValidPoI">
        {inferenceServiceStages.map((stage, stageIndex) => (
          <span className={`native-chain-service-fragment is-${stage.tone}`} key={stage.index}>
            <section>
              <header><b>{stage.index}</b><Icon name={stage.icon} /></header>
              <small>{stage.eyebrow}</small>
              <strong>{stage.title}</strong>
              <p>{stage.detail}</p>
              <code>{stage.output}</code>
            </section>
            {stageIndex < inferenceServiceStages.length - 1 ? <i aria-hidden="true">→</i> : null}
          </span>
        ))}
      </div>

      <footer className="native-chain-service-result">
        <span><Icon name="spark" /><strong>同一次有效推理</strong><small>服务 Agentic Contract，同时生成 ValidPoI</small></span>
        <i aria-hidden="true">→</i>
        <b>服务收益 · 有界权重 · VRF / BFT</b>
      </footer>
    </LearningPanel>
  );
}
