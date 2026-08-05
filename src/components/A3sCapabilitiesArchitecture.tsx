import { Icon } from './Icons';
import { LearningPanel } from './LearningPanel';

const boxStages = [
  ['01', '准备工作负载', '镜像 · 构建 · 网络 · 卷', 'terminal'],
  ['02', '解析隔离策略', 'MicroVM 或显式 Sandbox', 'shield'],
  ['03', '管理完整生命周期', '启动 · exec · 暂停 · 恢复', 'spark'],
  ['04', '形成运行证据', '日志 · 指标 · 事件 · 清理', 'receipt'],
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

      <div className="a3s-box-isolation-rule">
        <section>
          <small>默认后端</small>
          <strong>专用内核 MicroVM</strong>
          <span>适合不可信任务与更强租户边界</span>
        </section>
        <b>不静默降级</b>
        <section>
          <small>显式选择</small>
          <strong>共享内核 Sandbox</strong>
          <span>适合可信或半可信工具与自动化</span>
        </section>
      </div>

      <footer className="a3s-box-capability-boundary">
        <Icon name="eye" />
        <strong>所选后端、策略和代际持久化</strong>
        <span>恢复、重启与清理沿用同一执行边界</span>
      </footer>
    </LearningPanel>
  );
}

const powerPrivacySteps = [
  ['TEE 执行', 'AMD SEV-SNP / Intel TDX'],
  ['远程证明', '测量值 · 硬件签名 · nonce'],
  ['机密模型', '加密加载 · 完整性校验'],
  ['隐私运行', '日志脱敏 · 内存清零'],
] as const;

const powerStreamingSteps = [
  ['参数映射', 'GGUF 权重无需整体驻留'],
  ['当前层加载', '仅活跃层参数进入内存'],
  ['计算即释放', '完成后回收本层权重页'],
  ['受控内存峰值', 'O(layer_size) 而非模型总量'],
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
          eyebrow="隐私计算"
          title="隐私计算"
          icon="lock"
          steps={powerPrivacySteps}
          className="is-privacy"
        />
        <PowerCapabilityLane
          eyebrow="参数流式推理"
          title="参数流式推理"
          icon="brain"
          steps={powerStreamingSteps}
          className="is-streaming"
        />
      </div>

      <footer className="a3s-power-receipt">
        <Icon name="receipt" />
        <span><small>标准执行回执</small><strong>modelRoot · runtimePolicy · nonce · requestDigest · outputDigest</strong></span>
      </footer>
    </LearningPanel>
  );
}
