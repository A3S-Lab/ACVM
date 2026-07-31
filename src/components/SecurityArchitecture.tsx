import { useState } from 'react';
import { Icon, type IconName } from './Icons';

type ModuleKey = 'box' | 'power' | 'sentry';

const modules: Array<{
  key: ModuleKey;
  name: string;
  subtitle: string;
  icon: IconName;
  owns: string;
  input: string;
  output: string;
  boundary: string;
}> = [
  {
    key: 'box',
    name: 'a3s-box',
    subtitle: '隔离执行边界',
    icon: 'lock',
    owns: '拥有工作负载生命周期与隔离等级',
    input: 'OCI 工作负载、资源、网络、存储与隔离策略',
    output: 'Execution Lease、Security Receipt、日志与可选 TEE Attestation',
    boundary: '它是本地运行时，不是远程 Agent 控制平面；也不理解模型和合约业务语义。',
  },
  {
    key: 'power',
    name: 'a3s-power',
    subtitle: '可证明隐私推理',
    icon: 'brain',
    owns: '拥有模型加载、推理与模型—度量绑定',
    input: '加密模型、私密 Prompt、模型策略与一次性 Nonce',
    output: '推理结果、Model Hash、硬件度量和可独立验证的 Attestation',
    boundary: '它不管理工具权限，不推进 Agentic Contract 状态，也不决定是否付款。',
  },
  {
    key: 'sentry',
    name: 'AnySentry',
    subtitle: '安全证据与风险决策平面',
    icon: 'eye',
    owns: '拥有事件规范化、分级判断与安全运营上下文',
    input: '进程、工具、网络、文件、DNS、LLM 与外部遥测事件',
    output: 'allow / warn / require_approval / block、证据包与处置建议',
    boundary: '它评估并记录动作，不执行合约或命令；ACVM、网关或内核 Guard 落实控制。',
  },
];

function BoxDiagram() {
  return (
    <div className="module-diagram module-diagram--box">
      <div className="diagram-title">
        <span>A3S BOX · LOCAL RUNTIME</span>
        <strong>所有入口汇入同一个 ExecutionManager</strong>
      </div>
      <div className="box-entrypoints">
        <span>CLI</span><span>Rust SDK</span><span>Python / TS / Go</span><span>CRI</span><span>containerd shim</span>
      </div>
      <i className="diagram-down"><Icon name="arrow" /></i>
      <div className="box-manager">
        <Icon name="lock" />
        <p><strong>ExecutionManager</strong><small>durable state · generation fencing · lifecycle owner</small></p>
        <span>策略先于分配写入</span>
      </div>
      <i className="diagram-down"><Icon name="arrow" /></i>
      <div className="box-resolver">
        <header>Capability Probe + Policy Resolver</header>
        <div>
          <section>
            <small>DEFAULT</small>
            <strong>MicroVM · libkrun</strong>
            <span>独立 Guest Kernel</span>
            <em>硬件级工作负载边界</em>
          </section>
          <b>绝不静默降级</b>
          <section>
            <small>EXPLICIT</small>
            <strong>Sandbox · a3s-oci</strong>
            <span>共享 Host Kernel</span>
            <em>调用方明确请求后使用</em>
          </section>
        </div>
      </div>
      <div className="box-services">
        <span>Images</span><span>Storage</span><span>Network</span><span>Snapshots</span><span>Logs</span><span>TEE</span>
      </div>
    </div>
  );
}

function PowerDiagram() {
  return (
    <div className="module-diagram module-diagram--power">
      <div className="power-box-boundary">
        <span className="power-box-label">a3s-box MicroVM · SEV-SNP / TDX</span>
        <div className="diagram-title">
          <span>A3S POWER · INFERENCE SERVICE</span>
          <strong>模型、代码和硬件度量绑定为一条可验证链</strong>
        </div>
        <div className="power-layers">
          <section>
            <small>API + SERVER</small>
            <strong>OpenAI-compatible API</strong>
            <p>Auth · Rate Limit · Request ID · Redacted Audit</p>
          </section>
          <i><Icon name="arrow" /></i>
          <section>
            <small>MODEL + BACKEND</small>
            <strong>Registry → Backend Router</strong>
            <p>MistralRs · LlamaCpp · Picolm Layer Streaming</p>
          </section>
          <i><Icon name="arrow" /></i>
          <section>
            <small>INFERENCE</small>
            <strong>Chat · Completion · Embedding</strong>
            <p>KV 隔离 · 解密加载 · 卸载后清零</p>
          </section>
        </div>
        <div className="power-tee-layer">
          <small>CROSS-CUTTING TEE LAYER</small>
          <span>Model Seal</span><span>AES-256-GCM</span><span>Memory Encryption</span><span>Log Redaction</span><span>RA-TLS</span>
        </div>
      </div>
      <div className="power-verify">
        <span><Icon name="receipt" /></span>
        <p><small>CLIENT-SIDE VERIFY</small><strong>Nonce + Model Hash + Platform Measurement + Hardware Signature</strong></p>
        <em>证明指定模型在未篡改的加密环境内运行</em>
      </div>
    </div>
  );
}

function SentryDiagram() {
  return (
    <div className="module-diagram module-diagram--sentry">
      <div className="diagram-title">
        <span>ANYSENTRY · EVIDENCE & DECISION PLANE</span>
        <strong>观测、判断、运营和执行是四个不同环节</strong>
      </div>
      <div className="sentry-pipeline">
        <section>
          <small>01 · CAPTURE</small>
          <strong>运行时信号</strong>
          <p>a3s-observer eBPF</p>
          <p>JSON · CloudEvents · OTLP</p>
        </section>
        <i><Icon name="arrow" /></i>
        <section>
          <small>02 · NORMALIZE</small>
          <strong>规范化证据</strong>
          <p>Agent / Session / Run / Trace</p>
          <p>密钥感知脱敏</p>
        </section>
        <i><Icon name="arrow" /></i>
        <section className="is-judge">
          <small>03 · DECIDE</small>
          <strong>分级判断</strong>
          <p><b>L1</b> 规则 · µs</p>
          <p><b>L2</b> 快速模型 · ms</p>
          <p><b>L3</b> 深度 Agent · s–min</p>
        </section>
        <i><Icon name="arrow" /></i>
        <section>
          <small>04 · OPERATE</small>
          <strong>安全运营</strong>
          <p>Topology · Incident · Alert</p>
          <p>Evidence Bundle · Audit</p>
        </section>
      </div>
      <div className="sentry-output">
        <div>
          <small>DECISION</small>
          <span className="is-allow">ALLOW</span><span>WARN</span><span>REQUIRE APPROVAL</span><span className="is-block">BLOCK</span>
        </div>
        <i><Icon name="arrow" /></i>
        <div>
          <small>ENFORCEMENT OWNER</small>
          <strong>ACVM / Zero Trust Gateway / Observer Guard</strong>
          <p>调用方接受决定并阻断工具、网络、文件或资金状态转移</p>
        </div>
      </div>
    </div>
  );
}

export function SecurityArchitecture() {
  const [selected, setSelected] = useState<ModuleKey>('box');
  const current = modules.find((module) => module.key === selected)!;

  return (
    <div className={`security-architecture security-architecture--${selected}`}>
      <div className="responsibility-ledger" aria-label="A3S 各模块状态所有权">
        <span><small>ACVM</small><strong>合约状态</strong></span>
        <i>≠</i>
        <span><small>a3s-box</small><strong>工作负载状态</strong></span>
        <i>≠</i>
        <span><small>a3s-power</small><strong>模型与推理状态</strong></span>
        <i>≠</i>
        <span><small>AnySentry</small><strong>风险与事件状态</strong></span>
        <i>≠</i>
        <span><small>联盟链</small><strong>共识终局状态</strong></span>
      </div>

      <div className="security-workbench">
        <aside className="module-tabs" role="tablist" aria-label="选择 A3S 子项目架构">
          {modules.map((module) => (
            <button
              type="button"
              role="tab"
              aria-selected={selected === module.key}
              className={selected === module.key ? 'is-active' : ''}
              key={module.key}
              onClick={() => setSelected(module.key)}
            >
              <Icon name={module.icon} />
              <span><strong>{module.name}</strong><small>{module.subtitle}</small></span>
              <Icon name="arrow" />
            </button>
          ))}
        </aside>

        <section className="module-canvas">
          {selected === 'box' ? <BoxDiagram /> : selected === 'power' ? <PowerDiagram /> : <SentryDiagram />}
        </section>

        <aside className="module-contract" aria-live="polite">
          <header><Icon name={current.icon} /><span><small>{current.name}</small><strong>{current.owns}</strong></span></header>
          <div><small>INPUT</small><p>{current.input}</p></div>
          <div><small>OUTPUT</small><p>{current.output}</p></div>
          <footer><small>NOT RESPONSIBLE FOR</small><p>{current.boundary}</p></footer>
        </aside>
      </div>
    </div>
  );
}
