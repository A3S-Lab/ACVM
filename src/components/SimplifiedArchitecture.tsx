import { Icon, type IconName } from './Icons';

function Arrow() {
  return (
    <span className="flow-arrow" aria-hidden="true">
      <i />
      <Icon name="arrow" />
    </span>
  );
}

function PanelChrome({ label, status }: { label: string; status: string }) {
  return (
    <header className="panel-chrome">
      <span><i /><i /><i /></span>
      <code>{label}</code>
      <strong><i /> {status}</strong>
    </header>
  );
}

const runtimeSteps: Array<{ code: string; title: string; detail: string; icon: IconName }> = [
  { code: '01', title: '装载合约', detail: 'Manifest 与验收谓词', icon: 'terminal' },
  { code: '02', title: '推进状态', detail: '等待 · 重试 · 审批', icon: 'bolt' },
  { code: '03', title: '调用工具', detail: '渐进式 API 与短期授权', icon: 'key' },
  { code: '04', title: '执行策略', detail: '预算 · 权限 · 风险决定', icon: 'shield' },
  { code: '05', title: '生成证明', detail: 'Receipt Root 与公共输入', icon: 'receipt' },
];

export function RuntimeArchitecture() {
  return (
    <div className="diagram-panel runtime-architecture">
      <PanelChrome label="ACVM / EXECUTION TRACE" status="CONTRACT ACTIVE" />
      <div className="runtime-package">
        <span><Icon name="fingerprint" /></span>
        <p><small>SIGNED AGENTIC CONTRACT</small><strong>身份、目标、边界与完成条件同时固定</strong></p>
        <code>manifest:0x71…ac9</code>
      </div>
      <div className="runtime-flow" aria-label="ACVM 五步执行流程">
        {runtimeSteps.map((step, index) => (
          <div className="flow-fragment" key={step.code}>
            <article className={`flow-node ${index === 2 ? 'is-focus' : ''}`}>
              <span>{step.code}</span>
              <Icon name={step.icon} />
              <strong>{step.title}</strong>
              <small>{step.detail}</small>
            </article>
            {index < runtimeSteps.length - 1 ? <Arrow /> : null}
          </div>
        ))}
      </div>
      <footer className="diagram-statusline">
        <span>ENTERPRISE</span><strong>Progressive API · Zero Trust Gateway</strong>
        <i />
        <span>RUNTIME</span><strong>a3s-box · a3s-power · AnySentry</strong>
        <i />
        <span>FINALITY</span><strong>Chain Adapter · Audit Ledger</strong>
      </footer>
    </div>
  );
}

const identitySteps = [
  ['01', '责任主体', '企业 CA / DID'],
  ['02', 'Agent 实例', '设备密钥 / TEE 度量'],
  ['03', '合约实例', 'Manifest Hash'],
  ['04', '工具会话', 'Scope / Expiry'],
] as const;

export function IdentityArchitectureSimple() {
  return (
    <div className="diagram-panel identity-simple">
      <PanelChrome label="IDENTITY / RESPONSIBILITY CHAIN" status="BINDING VALID" />
      <div className="identity-line" aria-label="Agentic Contract 责任身份链">
        {identitySteps.map(([code, title, detail], index) => (
          <div className="flow-fragment" key={code}>
            <article>
              <span>{code}</span>
              <Icon name={index === 0 ? 'fingerprint' : index === 3 ? 'key' : 'chain'} />
              <strong>{title}</strong>
              <small>{detail}</small>
            </article>
            {index < identitySteps.length - 1 ? <Arrow /> : null}
          </div>
        ))}
      </div>
      <div className="zk-capability-flow">
        <section>
          <small>PRIVATE</small>
          <strong>岗位、牌照、能力评分、授权台账</strong>
          <span>原始凭据留在企业域</span>
        </section>
        <Arrow />
        <section className="is-proof">
          <Icon name="fingerprint" />
          <small>ZK CAPABILITY PROOF</small>
          <strong>πcap</strong>
          <span>签发可信 · 未撤销 · 范围匹配</span>
        </section>
        <Arrow />
        <section>
          <small>PUBLIC</small>
          <strong>主体承诺、能力类别、范围与有效期</strong>
          <span>只证明有资格，不公开资格底牌</span>
        </section>
      </div>
    </div>
  );
}

export function OffchainArchitectureSimple() {
  return (
    <div className="diagram-panel offchain-simple">
      <PanelChrome label="TRUSTED OFF-CHAIN COMPUTE" status="EVIDENCE FRESH" />
      <div className="domain-flow" aria-label="从企业事实到联盟链终局的链下验证流程">
        <section className="source-domain">
          <small>PRIVATE DATA DOMAINS</small>
          <span>企业渐进式 API</span>
          <span>IoT / 工业设备</span>
          <span>政务与行业数据</span>
        </section>
        <Arrow />
        <section>
          <Icon name="eye" />
          <small>ORACLE</small>
          <strong>来源与时效</strong>
          <span>签名 · zkTLS · 多源一致性</span>
        </section>
        <Arrow />
        <section className="is-acvm">
          <Icon name="terminal" />
          <small>ACVM</small>
          <strong>可信链下计算</strong>
          <span>工具执行 · 隐私推理 · 状态机</span>
        </section>
        <Arrow />
        <section>
          <Icon name="receipt" />
          <small>PROOF</small>
          <strong>可验证回执</strong>
          <span>State Root · ZK · Attestation</span>
        </section>
        <Arrow />
        <section>
          <Icon name="chain" />
          <small>CONSORTIUM CHAIN</small>
          <strong>共同确认终局</strong>
          <span>不读取业务原文与 Prompt</span>
        </section>
      </div>
      <footer className="privacy-boundary">
        <Icon name="lock" />
        <span>原始数据与模型留在企业隐私域</span>
        <code>public: identityCommitment · stateRoot · receiptRoot · proof</code>
      </footer>
    </div>
  );
}

function MiniPipeline({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="mini-pipeline">
      {items.map(([title, detail], index) => (
        <span key={title}><i>{String(index + 1).padStart(2, '0')}</i><strong>{title}</strong><small>{detail}</small></span>
      ))}
    </div>
  );
}

export function PrivacyArchitecture() {
  return (
    <div className="diagram-panel privacy-architecture">
      <PanelChrome label="PRIVATE EXECUTION / A3S" status="ATTESTED" />
      <div className="privacy-lanes">
        <article>
          <header><Icon name="lock" /><span><small>ISOLATED WORKLOAD</small><strong>a3s-box</strong></span></header>
          <p>接管工作负载生命周期，按策略选择硬件隔离等级，并生成执行租约与安全回执。</p>
          <MiniPipeline items={[
            ['隔离策略', '资源 · 网络 · 存储'],
            ['ExecutionManager', '唯一生命周期管理器'],
            ['MicroVM / Sandbox', '绝不静默降级'],
            ['Security Receipt', '可审计执行事实'],
          ]} />
        </article>
        <article>
          <header><Icon name="brain" /><span><small>PRIVATE INFERENCE</small><strong>a3s-power</strong></span></header>
          <p>接管模型加载与推理，把模型哈希、代码度量、硬件环境和一次请求绑定为可验证结果。</p>
          <MiniPipeline items={[
            ['密封输入', '加密模型 · 私密数据'],
            ['TEE 推理', '固定模型与随机种子'],
            ['结果输出', '原始上下文不外泄'],
            ['Attestation', 'Nonce · Model Hash · 度量'],
          ]} />
        </article>
      </div>
      <footer className="privacy-composition">
        <span>ACVM <i>合约与状态</i></span><b>+</b>
        <span>a3s-box <i>工作负载隔离</i></span><b>+</b>
        <span>a3s-power <i>模型与推理</i></span><b>=</b>
        <strong>可证明的隐私执行</strong>
      </footer>
    </div>
  );
}

export function SentryArchitectureSimple() {
  return (
    <div className="diagram-panel sentry-simple">
      <PanelChrome label="ANYSENTRY / SECURITY CONTROL LOOP" status="POLICY ENFORCED" />
      <div className="sentry-flow" aria-label="AnySentry 从观测到控制的安全流程">
        <section>
          <small>01 / OBSERVE</small>
          <Icon name="eye" />
          <strong>形成运行证据</strong>
          <p>进程 · 工具 · 网络<br />文件 · DNS · 模型事件</p>
        </section>
        <Arrow />
        <section>
          <small>02 / DECIDE</small>
          <Icon name="brain" />
          <strong>分级判断风险</strong>
          <p>L1 规则 · L2 快速模型<br />L3 深度安全 Agent</p>
        </section>
        <Arrow />
        <section className="is-enforce">
          <small>03 / ENFORCE</small>
          <Icon name="shield" />
          <strong>在边界内执行</strong>
          <p>ACVM · 零信任网关<br />Observer Guard</p>
        </section>
      </div>
      <div className="decision-line">
        <span className="is-allow">ALLOW</span>
        <span>WARN</span>
        <span>REQUIRE APPROVAL</span>
        <span className="is-block">BLOCK</span>
        <i />
        <strong>每个决定都进入合约回执与审计证据链</strong>
      </div>
    </div>
  );
}

const milestones = [
  ['M0', '规则生效'],
  ['M1', '资料完成'],
  ['M2', '阶段验收'],
  ['M3', '受控暂停'],
  ['M4', '恢复执行'],
  ['M5', '最终交付'],
] as const;

export function LongTaskArchitectureSimple() {
  return (
    <div className="diagram-panel long-task-simple">
      <PanelChrome label="LONG-RUNNING TASK / 180 DAYS" status="PROOF FOLDING" />
      <div className="milestone-line" aria-label="长期任务连续里程碑">
        {milestones.map(([code, label], index) => (
          <div className="milestone" key={code}>
            <span><Icon name={index === 3 ? 'pause' : 'check'} /></span>
            <strong>{label}</strong>
            <small>{code} · C{index}</small>
          </div>
        ))}
      </div>
      <div className="folding-line">
        <code>π₀</code><Arrow /><code>Fold(π₀, Δ₁)</code><Arrow /><code>…</code><Arrow /><code>πrecursive</code>
        <i />
        <section>
          <Icon name="chain" />
          <span><small>CHAIN VERIFIER</small><strong>completed = true</strong></span>
        </section>
      </div>
      <footer className="proof-public-private">
        <span><Icon name="lock" /><strong>PRIVATE</strong> 文档、Prompt、日志与中间结果</span>
        <span><Icon name="eye" /><strong>PUBLIC</strong> C₀ · Cₙ · ruleHash · πrecursive</span>
      </footer>
    </div>
  );
}

export function IntelligenceProofArchitecture() {
  const steps: Array<{ code: string; title: string; detail: string; icon: IconName }> = [
    { code: '01', title: '真实需求', detail: '用户签名任务 · SLA · 验收集', icon: 'fingerprint' },
    { code: '02', title: '智能服务', detail: 'a3s-power 执行固定模型', icon: 'brain' },
    { code: '03', title: '质量验证', detail: '结果验收 · 抽样复算 · 挑战', icon: 'check' },
    { code: '04', title: '智能证明', detail: '质量 + 执行 + 防重放回执', icon: 'spark' },
  ];

  return (
    <div className="diagram-panel intelligence-proof">
      <PanelChrome label="PROOF OF INTELLIGENCE / POI" status="USEFUL SERVICE VERIFIED" />
      <div className="poi-flow" aria-label="智能证明生成流程">
        {steps.map((step, index) => (
          <div className="flow-fragment" key={step.code}>
            <article className={index === steps.length - 1 ? 'is-proof' : ''}>
              <span>{step.code}</span>
              <Icon name={step.icon} />
              <strong>{step.title}</strong>
              <small>{step.detail}</small>
            </article>
            {index < steps.length - 1 ? <Arrow /> : null}
          </div>
        ))}
      </div>
      <div className="poi-equation">
        <code>PoI = SignedDemand ∧ AcceptedResult ∧ AttestedExecution ∧ AntiReplay</code>
        <span>自造任务、重复回执和未通过质量验收的推理不计入智能贡献</span>
      </div>
      <div className="poi-finality">
        <section>
          <small>联盟链</small>
          <strong>服务贡献与调度证明</strong>
          <span>BFT / HotStuff 继续负责共识终局</span>
        </section>
        <i />
        <section>
          <small>开放网络</small>
          <strong>生成可验证的出块资格</strong>
          <span>VRF 从有效智能证明中选择提议者</span>
        </section>
      </div>
    </div>
  );
}

export function ChainArchitectureSimple() {
  const modes = [
    ['01', '链外协处理器', '保留现有联盟链内核'],
    ['02', '原生执行器', '路由 Agentic Contract'],
    ['03', 'ACVM 应用链', '承载大规模验证任务'],
  ] as const;
  const chains = ['BSN', 'FISCO BCOS', '长安链', 'Fabric', '企业 EVM'];

  return (
    <div className="diagram-panel chain-simple">
      <PanelChrome label="CHAIN-AGNOSTIC DEPLOYMENT" status="ADAPTER READY" />
      <div className="chain-deploy-flow">
        <div className="deploy-modes">
          {modes.map(([code, name, detail]) => (
            <span key={code}><i>{code}</i><strong>{name}</strong><small>{detail}</small></span>
          ))}
        </div>
        <Arrow />
        <section className="acvm-core">
          <Icon name="terminal" />
          <small>EXECUTION SEMANTICS</small>
          <strong>ACVM Core</strong>
          <span>Identity · Event · State · Proof</span>
        </section>
        <Arrow />
        <section className="adapter-core">
          <Icon name="chain" />
          <small>CHAIN ADAPTER ABI</small>
          <strong>身份 · 事件 · 证明 · 终局</strong>
        </section>
        <Arrow />
        <div className="chain-target-list">
          {chains.map((chain) => <span key={chain}>{chain}</span>)}
        </div>
      </div>
      <footer className="chain-keeps">
        <span>原链继续负责</span>
        <strong>共识 · P2P · 成员治理 · 国密体系 · 账本存储</strong>
        <i />
        <span>ACVM 专门负责</span>
        <strong>Agentic Contract 的长期、链下与可证明执行</strong>
      </footer>
    </div>
  );
}
