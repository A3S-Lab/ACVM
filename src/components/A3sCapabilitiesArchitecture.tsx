import { Icon } from './Icons';
import { LearningPanel } from './LearningPanel';

const boxStages = [
  ['01', '准备任务环境', '镜像 · 网络 · 存储 · 资源上限', 'terminal'],
  ['02', '按策略隔离运行', '默认 MicroVM；Sandbox 必须显式选择', 'shield'],
  ['03', '记录、恢复与清理', '启动 · 日志 · 暂停 · 恢复 · 销毁', 'receipt'],
] as const;

export function A3sBoxCapabilitiesArchitecture() {
  return (
    <LearningPanel code="a3s-box / 本地工作负载平面" status="执行边界不静默切换" className="a3s-box-capability">
      <div className="a3s-box-capability-flow" aria-label="a3s-box 从准备工作负载、解析隔离策略到生命周期和运行证据的能力流程">
        {boxStages.map(([index, title, detail, icon], stageIndex) => (
          <span className="a3s-box-capability-fragment" key={index}>
            <section>
              <header><b>{index}</b><Icon name={icon} /></header>
              <strong>{title}</strong>
              <small>{detail}</small>
            </section>
            {stageIndex < boxStages.length - 1 ? <i aria-hidden="true">→</i> : null}
          </span>
        ))}
      </div>

      <footer className="a3s-box-capability-boundary">
        <Icon name="eye" />
        <strong>运行中不切换隔离方式</strong>
        <span>恢复、重启和清理沿用原策略</span>
      </footer>
    </LearningPanel>
  );
}

const powerPrivacySteps = [
  ['受保护环境', 'SEV-SNP / TDX'],
  ['远程证明', '核验硬件和运行程序'],
  ['安全收尾', '日志脱敏 · 内存清零'],
] as const;

const powerStreamingSteps = [
  ['参数留在外部', '模型无需整体驻留'],
  ['当前层载入', '只加载正在计算的一层'],
  ['计算后释放', '峰值接近单层大小'],
] as const;

function PowerCapabilityLane({
  eyebrow,
  title,
  icon,
  steps,
  className,
}: {
  eyebrow: string;
  title: string;
  icon: 'lock' | 'brain';
  steps: readonly (readonly [string, string])[];
  className: string;
}) {
  return (
    <section className={className}>
      <header><Icon name={icon} /><span><small>{eyebrow}</small><strong>{title}</strong></span></header>
      <div>
        {steps.map(([name, detail], index) => (
          <span key={name}><b>{String(index + 1).padStart(2, '0')}</b><strong>{name}</strong><small>{detail}</small></span>
        ))}
      </div>
    </section>
  );
}

export function A3sPowerCapabilitiesArchitecture() {
  return (
    <LearningPanel code="a3s-power / 隐私计算与参数流式推理" status="模型无关 · 回执可核验" className="a3s-power-capability">
      <div className="a3s-power-capability-lanes" aria-label="a3s-power 的隐私计算与参数流式推理能力">
        <PowerCapabilityLane
          eyebrow="数据与模型不暴露"
          title="隐私计算"
          icon="lock"
          steps={powerPrivacySteps}
          className="is-privacy"
        />
        <PowerCapabilityLane
          eyebrow="模型参数按层流动"
          title="参数流式推理"
          icon="brain"
          steps={powerStreamingSteps}
          className="is-streaming"
        />
      </div>

      <footer className="a3s-power-receipt">
        <Icon name="receipt" />
        <span><small>可核验回执</small><strong>模型版本 · 执行策略 · 输入摘要 · 输出摘要</strong></span>
      </footer>
    </LearningPanel>
  );
}
