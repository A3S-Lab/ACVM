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

type TopologyNode = {
  title: string;
  detail: string;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  anchor: 'start' | 'middle' | 'end';
};

const topologyNodes: TopologyNode[] = [
  { title: '身份', detail: 'IDENTITY', x: 180, y: 55, labelX: 180, labelY: 19, anchor: 'middle' },
  { title: '策略', detail: 'POLICY', x: 244, y: 75, labelX: 260, labelY: 49, anchor: 'start' },
  { title: '预言机', detail: 'ORACLE', x: 280, y: 128, labelX: 300, labelY: 110, anchor: 'start' },
  { title: '链适配', detail: 'CHAIN', x: 280, y: 192, labelX: 300, labelY: 190, anchor: 'start' },
  { title: '证明', detail: 'PROOF', x: 244, y: 245, labelX: 260, labelY: 272, anchor: 'start' },
  { title: '状态', detail: 'STATE', x: 180, y: 265, labelX: 180, labelY: 294, anchor: 'middle' },
  { title: '隔离', detail: 'TEE', x: 116, y: 245, labelX: 100, labelY: 272, anchor: 'end' },
  { title: '工具', detail: 'TOOLS', x: 80, y: 192, labelX: 60, labelY: 190, anchor: 'end' },
  { title: '安全', detail: 'SENTRY', x: 80, y: 128, labelX: 60, labelY: 110, anchor: 'end' },
  { title: '调度', detail: 'SCHEDULER', x: 116, y: 75, labelX: 100, labelY: 49, anchor: 'end' },
];

const topologyMesh = topologyNodes.flatMap((source, sourceIndex) =>
  topologyNodes.slice(sourceIndex + 1).map((target) => [source, target] as const),
);

function TopologyNodeLayer() {
  return (
    <g className="topology-node-layer">
      {topologyNodes.map((node) => (
        <g key={node.detail}>
          <circle cx={node.x} cy={node.y} r="7" />
          <text x={node.labelX} y={node.labelY} textAnchor={node.anchor}>
            {node.title}
            <tspan x={node.labelX} dy="11">{node.detail}</tspan>
          </text>
        </g>
      ))}
    </g>
  );
}

export function RuntimeArchitecture() {
  return (
    <div className="diagram-panel runtime-topology">
      <PanelChrome label="ACVM / EXECUTION TOPOLOGY" status="BOUNDARIES MAPPED" />
      <div className="topology-comparison" aria-label="点对点任务编排与 ACVM 统一执行内核对比">
        <section>
          <header><span>01 / POINT-TO-POINT</span><strong>职责互相直连</strong></header>
          <svg viewBox="0 0 360 320" role="img" aria-label="十个职责节点彼此直接连接形成复杂网状结构">
            <circle className="topology-orbit" cx="180" cy="160" r="105" />
            <g className="topology-mesh">
              {topologyMesh.map(([source, target]) => (
                <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} key={`${source.detail}-${target.detail}`} />
              ))}
            </g>
            <TopologyNodeLayer />
          </svg>
          <footer><span>10 BOUNDARIES</span><strong>45 DIRECT CONNECTIONS</strong></footer>
        </section>
        <i className="topology-divider" />
        <section>
          <header><span>02 / ACVM CORE</span><strong>共享执行内核</strong></header>
          <svg viewBox="0 0 360 320" role="img" aria-label="十个职责节点通过 ACVM Core 统一连接">
            <circle className="topology-orbit" cx="180" cy="160" r="105" />
            <g className="topology-routes">
              {topologyNodes.map((node) => <line x1={node.x} y1={node.y} x2="180" y2="160" key={node.detail} />)}
            </g>
            <rect className="topology-core" x="132" y="112" width="96" height="96" rx="14" />
            <path className="topology-core-grid" d="M132 144h96M132 176h96M164 112v96M196 112v96" />
            <circle className="topology-core-point" cx="180" cy="160" r="5" />
            <text className="topology-core-label" x="180" y="153" textAnchor="middle">ACVM</text>
            <text className="topology-core-detail" x="180" y="173" textAnchor="middle">STATE · POLICY · GAS</text>
            <TopologyNodeLayer />
          </svg>
          <footer><span>10 BOUNDARIES</span><strong>1 EXECUTION CONTRACT</strong></footer>
        </section>
      </div>
    </div>
  );
}

export function OnchainExecutionArchitecture() {
  const workers: Array<[string, string, IconName]> = [
    ['Oracle / API', '外部事实与业务系统', 'eye'],
    ['TEE / Model', '私密计算与模型推理', 'lock'],
    ['Long Task', '等待、审批与跨区块任务', 'receipt'],
  ];

  return (
    <div className="diagram-panel onchain-architecture">
      <PanelChrome label="ACVM / CHAIN-NATIVE EXECUTION" status="DETERMINISTIC CORE" />
      <div className="onchain-layout">
        <section className="validator-domain">
          <header><span>CONSENSUS DOMAIN</span><strong>每个验证节点运行同一 ACVM Core</strong></header>
          <svg viewBox="0 0 430 320" role="img" aria-label="四个验证节点共同执行 ACVM 确定性状态转换">
            <path className="validator-ring" d="M95 76H335V224H95Z" />
            <path className="validator-spokes" d="M95 76 215 150 335 76M335 224 215 150 95 224M215 46V112M215 188V284" />
            <g className="validator-nodes">
              <circle cx="95" cy="76" r="22" /><circle cx="335" cy="76" r="22" />
              <circle cx="335" cy="224" r="22" /><circle cx="95" cy="224" r="22" />
              <text x="95" y="80" textAnchor="middle">V1</text><text x="335" y="80" textAnchor="middle">V2</text>
              <text x="335" y="228" textAnchor="middle">V3</text><text x="95" y="228" textAnchor="middle">V4</text>
            </g>
            <g className="validator-labels">
              <text x="95" y="42" textAnchor="middle">VALIDATOR / ACVM</text>
              <text x="335" y="42" textAnchor="middle">VALIDATOR / ACVM</text>
              <text x="335" y="263" textAnchor="middle">VALIDATOR / ACVM</text>
              <text x="95" y="263" textAnchor="middle">VALIDATOR / ACVM</text>
            </g>
            <rect className="state-transition-core" x="158" y="112" width="114" height="76" rx="12" />
            <text className="state-transition-title" x="215" y="141" textAnchor="middle">ACVM CORE</text>
            <text className="state-transition-code" x="215" y="162" textAnchor="middle">Sₙ → Sₙ₊₁</text>
            <text className="state-transition-note" x="215" y="179" textAnchor="middle">GAS · STORAGE · REVERT</text>
            <rect className="block-input" x="173" y="18" width="84" height="28" rx="6" />
            <text className="block-input-label" x="215" y="36" textAnchor="middle">BLOCK N</text>
            <rect className="state-output" x="161" y="284" width="108" height="24" rx="6" />
            <text className="state-output-label" x="215" y="300" textAnchor="middle">STATE ROOT</text>
          </svg>
        </section>

        <i className="proof-boundary"><span>ASYNC PROOF BOUNDARY</span></i>

        <section className="external-domain">
          <header><span>EXTERNAL DOMAIN</span><strong>不确定或重计算任务返回证明</strong></header>
          <div>
            {workers.map(([title, detail, icon], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <Icon name={icon} />
                <p><strong>{title}</strong><small>{detail}</small></p>
              </article>
            ))}
          </div>
          <footer><Icon name="chain" /><span><small>RESUME TRANSACTION</small><strong>receiptRoot · proof · attestation</strong></span></footer>
        </section>
      </div>
      <footer className="onchain-legend">
        <span><i /> ON-CHAIN：确定性状态、Gas、存储与回执</span>
        <span><i /> OFF-CHAIN：API、TEE、模型与长期任务</span>
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
          <span>签发有效 · 未撤销 · 范围匹配</span>
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
      <div className="domain-flow" aria-label="从企业数据到联盟链确认的链下核验流程">
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
          <strong>核对业务结果</strong>
          <span>工具执行 · 私密计算 · 状态机</span>
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
          <strong>多方链上确认</strong>
          <span>只接收状态根与证明</span>
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
          <p>管理工作负载的启动、运行和销毁，按规则选择隔离等级，并留下执行租约与安全回执。</p>
          <MiniPipeline items={[
            ['隔离策略', '资源 · 网络 · 存储'],
            ['ExecutionManager', '唯一生命周期管理器'],
            ['MicroVM / Sandbox', '绝不静默降级'],
            ['Security Receipt', '可审计执行事实'],
          ]} />
        </article>
        <article>
          <header><Icon name="brain" /><span><small>PRIVATE INFERENCE</small><strong>a3s-power</strong></span></header>
          <p>负责模型加载与推理，把模型哈希、代码度量、硬件环境和本次请求写进同一份回执。</p>
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
          <p>L1 规则 · L2 快速模型<br />L3 人工或深度复核</p>
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
    { code: '01', title: '实际任务', detail: '用户签名 · SLA · 验收条件', icon: 'fingerprint' },
    { code: '02', title: '执行计算', detail: 'a3s-power 运行固定模型', icon: 'brain' },
    { code: '03', title: '结果验收', detail: '抽样复算 · 质量检查 · 挑战', icon: 'check' },
    { code: '04', title: '生成 PoI', detail: '验收 + 执行 + 防重放', icon: 'spark' },
  ];

  return (
    <div className="diagram-panel intelligence-proof">
      <PanelChrome label="PROOF OF INTELLIGENCE / POI" status="WORK VERIFIED" />
      <div className="poi-flow" aria-label="PoI 生成流程">
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
        <span>自造任务、重复回执和未通过验收的结果不计入贡献</span>
      </div>
      <div className="poi-finality">
        <section>
          <small>联盟链</small>
          <strong>有效计算回执与调度记录</strong>
          <span>原链继续负责共识与最终确认</span>
        </section>
        <i />
        <section>
          <small>开放网络</small>
          <strong>用 VRF 选出区块提议者</strong>
          <span>只从有效 PoI 中抽签</span>
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
          <strong>身份 · 事件 · 证明 · 确认</strong>
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
        <strong>长任务、链下任务与执行证明</strong>
      </footer>
    </div>
  );
}
