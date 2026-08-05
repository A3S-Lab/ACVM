import type { ReactNode } from 'react';
import { DetailHint, type DetailRow, type ProofDerivation } from './DetailHint';
import { derivations } from './DerivationLibrary';
import { Icon, type IconName } from './Icons';

type ArchitectureHint = {
  title: string;
  summary: string;
  details: readonly DetailRow[];
};

const architectureHints = {
  currentState: {
    title: 'Sₙ · 当前链上状态',
    summary: '执行区块 N 前，所有验证节点已经共同确认的状态快照。',
    details: [{ label: '包含', value: '合约存储、任务阶段、权限、余额、回执根和防重放集合。' }, { label: '要求', value: '每个节点必须从相同 Sₙ 开始，否则不会得到相同的新状态根。' }],
  },
  stateArrow: {
    title: '→ · 确定性状态转换',
    summary: '节点用同一批有序交易和同一 ACVM 规则计算下一状态。',
    details: [{ label: '链上执行', value: '只包含必须达成一致的权限、Gas、存储、回执验证和状态更新。' }, { label: '链下执行', value: '模型、API 与长任务不在箭头内重算，只验证它们带回的证明。' }],
  },
  nextState: {
    title: 'Sₙ₊₁ · 下一链上状态',
    summary: '区块 N 的所有有效调用执行完成后得到的候选状态。',
    details: [{ label: '确认', value: 'BFT 节点对相同 stateRoot 达成法定人数后才正式生效。' }, { label: '失败', value: '任一确定性检查失败会回滚本次调用，不污染其他已确认状态。' }],
  },
  gas: {
    title: 'Gas · 确定性资源计量',
    summary: '限制一次链上状态转换能消耗的计算和存储资源。',
    details: [{ label: '作用', value: '防止合约无限循环或占满验证节点；所有节点按同一计价表计费。' }, { label: '边界', value: '链下 Worker 的 CPU/GPU 资源由租约计量，不直接等同于链上 Gas。' }],
  },
  storage: {
    title: 'Storage · 共识状态存储',
    summary: '所有节点需要长期保存并参与状态根计算的最小数据。',
    details: [{ label: '适合写入', value: '状态码、哈希承诺、回执根、权限和结算结果。' }, { label: '不适合', value: '原始模型、文档、完整日志和大体量回执正文。' }],
  },
  revert: {
    title: 'Revert · 原子回滚',
    summary: '调用失败时撤销本次尚未提交的状态写入。',
    details: [{ label: '触发', value: '权限失败、回执无效、证明错误、Gas 耗尽或业务谓词不成立。' }, { label: '仍可记录', value: '失败原因可以进入交易回执，但不会把任务标成成功。' }],
  },
  receiptRoot: {
    title: 'receiptRoot · 回执集合根',
    summary: '对 Worker、Validator、工具与安全回执集合的 Merkle 承诺。',
    details: [{ label: '验证', value: '用具体回执和 Merkle 路径可证明该回执包含在已确认集合中。' }, { label: '边界', value: '根证明记录未被替换，内容真实性仍需验签、证明和数据源核验。' }],
  },
  proof: {
    title: 'proof · 可验证执行证明',
    summary: '让节点确认外部计算满足规则，而不在链上重复完整计算。',
    details: [{ label: '绑定', value: '任务 ID、输入/输出承诺、代码或模型哈希、nonce 和前序状态根。' }, { label: '形式', value: '可以是零知识证明、远程证明、复算轨迹或门限签名组合。' }],
  },
  attestation: {
    title: 'attestation · 远程环境证明',
    summary: '硬件签名确认指定代码和模型运行在预期隔离环境中。',
    details: [{ label: '检查', value: '厂商证书链、代码度量、固件状态、随机 nonce 和白名单。' }, { label: '边界', value: '证明环境和版本，不自动证明业务输出一定正确。' }],
  },
  capabilityProof: {
    title: 'πcap · 零知识能力证明',
    summary: '证明调用方拥有所需资质且凭证未撤销，但不公开完整岗位、牌照和内部评分。',
    details: [{ label: '公共输入', value: '能力类别、作用范围、有效期、签发者承诺和撤销状态根。' }, { label: '私密输入', value: '完整 VC、主体密钥、企业内部属性和不需要披露的评分。' }],
  },
  identityCommitment: {
    title: 'identityCommitment · 身份承诺',
    summary: '对责任主体或授权凭证的隐藏式承诺。',
    details: [{ label: '作用', value: '链上能绑定同一责任主体并验证资格证明，而不公开完整身份材料。' }, { label: '更新', value: '密钥轮换、撤销或角色变化后必须生成新承诺并更新状态。' }],
  },
  stateRoot: {
    title: 'stateRoot · 世界状态根',
    summary: '对区块执行后全部 ACVM 状态的短承诺。',
    details: [{ label: '共识', value: '节点只对完全相同的 stateRoot 投票并形成最终确认。' }, { label: '用途', value: '后续执行基准、状态同步、轻客户端与跨链验证。' }],
  },
  initialProof: {
    title: 'π₀ · 初始证明状态',
    summary: '长期任务开始时，对初始规则、输入承诺和状态 C₀ 的证明。',
    details: [{ label: '冻结', value: '合约版本、验收规则、参与方和隐私边界。' }, { label: '作用', value: '后续每一步都必须继承 π₀，防止中途换任务。' }],
  },
  delta: {
    title: 'Δ₁ · 第一步状态增量',
    summary: '里程碑 1 相对上一状态新增的执行约束和回执。',
    details: [{ label: '包含', value: '输入/输出承诺、动作、责任方、时间和证明引用。' }, { label: '连续性', value: '必须引用上一承诺，否则不能折叠进同一长期任务。' }],
  },
  fold: {
    title: 'Fold(π₀, Δ₁) · 证明折叠',
    summary: '把已有证明状态和新一步约束合并为新的累积实例。',
    details: [{ label: '收益', value: '任务持续数月也不需要保存线性增长的链上证明。' }, { label: '终结', value: '任务结束后仍需把累积实例转成链上验证器支持的最终证明。' }],
  },
  recursiveProof: {
    title: 'πrecursive · 最终递归证明',
    summary: '覆盖全部里程碑、暂停、恢复和验收步骤的一份固定大小证明。',
    details: [{ label: '公共验证', value: '检查 C₀、Cₙ、ruleHash 和最终完成状态。' }, { label: '隐私', value: '中间文档、Prompt、日志和模型上下文无需公开。' }],
  },
  commitmentStart: {
    title: 'C₀ · 初始状态承诺',
    summary: '长期任务开始时对输入、规则和参与方状态的承诺。',
    details: [{ label: '作用', value: '给整条证明链提供不可更换的起点。' }, { label: '审计', value: '打开承诺时可核验初始材料与链上记录一致。' }],
  },
  commitmentEnd: {
    title: 'Cₙ · 最终状态承诺',
    summary: '第 n 个里程碑完成后的结果与任务状态承诺。',
    details: [{ label: '绑定', value: '最终交付物、验收回执、结算条件和前序承诺。' }, { label: '用途', value: '链上验证完成条件，并作为后续业务流程输入。' }],
  },
  ruleHash: {
    title: 'ruleHash · 规则版本哈希',
    summary: '对长期任务使用的状态转换和验收规则版本做承诺。',
    details: [{ label: '防止', value: '执行途中偷偷更换验收口径或证明电路。' }, { label: '升级', value: '规则升级必须显式创建新版本并由授权方确认迁移。' }],
  },
  signedDemand: {
    title: 'SignedDemand · 已签名需求',
    summary: '由真实用户或机构授权的任务目标与验收条件。',
    details: [{ label: '绑定', value: '需求方、预算、SLA、nonce、输入承诺和截止时间。' }, { label: '防作弊', value: '没有真实需求或重复使用同一需求都不能生成有效 PoI。' }],
  },
  acceptedResult: {
    title: 'AcceptedResult · 已验收结果',
    summary: 'Validator 按任务开始前冻结的规则确认结果合格。',
    details: [{ label: '证据', value: '质量谓词、抽样复算、多源一致性、人工签章或门限确认。' }, { label: '失败', value: '结果仍可留作失败回执，但不计入 PoI 和结算。' }],
  },
  attestedExecution: {
    title: 'AttestedExecution · 可证明执行',
    summary: '把实际执行与指定模型、代码、输入承诺和隔离环境绑定。',
    details: [{ label: '来源', value: 'TEE quote、零知识证明、工具回执或可复算轨迹。' }, { label: '验证', value: '检查度量白名单、签名、nonce、任务 ID 和输出承诺。' }],
  },
  antiReplay: {
    title: 'AntiReplay · 防重放条件',
    summary: '保证同一需求、回执或证明不能重复获得贡献和结算。',
    details: [{ label: '检查键', value: 'taskId、nonce、需求摘要、输出承诺和已消费回执集合。' }, { label: '失败', value: '重复记录立即拒绝，不改变贡献状态。' }],
  },
  poi: {
    title: 'PoI · 有效智能证明',
    summary: '一条同时带真实需求、结果验收、执行证明和防重放检查的有效计算记录。',
    details: [{ label: '生成', value: '四项条件缺一不可，任何一项失败都不会进入有效工作池。' }, { label: '用途', value: '结果结算、贡献计分、信誉、任务调度和开放网络的提议者抽签。' }],
  },
  identitySemantic: {
    title: 'Identity · 责任身份语义',
    summary: '跨链保持一致的主体、Agent、节点和合约身份表示。',
    details: [{ label: '适配', value: '映射到目标链账户、DID、证书或联盟成员体系。' }, { label: '不改变', value: '授权关系和责任链仍由 ACVM 合约语义解释。' }],
  },
  eventSemantic: {
    title: 'Event · 工作轨迹事件',
    summary: '部署、调用、执行、验收、拒绝和终局等标准事件。',
    details: [{ label: '适配', value: '可映射为 EVM Log、联盟链事件或独立账本记录。' }, { label: '用途', value: '索引完整生命周期并驱动链下观察器和审计。' }],
  },
  stateSemantic: {
    title: 'State · 合约状态语义',
    summary: '任务阶段、权限、回执根和终局结果的统一状态机。',
    details: [{ label: '适配', value: '底层存储布局可变化，但状态转换条件保持一致。' }, { label: '验证', value: '适配器必须把目标链最终性映射回 ACVM 状态确认。' }],
  },
  proofSemantic: {
    title: 'Proof · 证明验证语义',
    summary: '统一描述证明类型、公共输入、验证密钥版本和验证结果。',
    details: [{ label: '适配', value: '目标链可使用预编译、系统合约或链外验证器。' }, { label: '要求', value: '无论落在哪条链，证明必须绑定同一任务和状态承诺。' }],
  },
} as const satisfies Record<string, ArchitectureHint>;

type ArchitectureHintKey = keyof typeof architectureHints;

const architectureDerivations: Record<ArchitectureHintKey, ProofDerivation> = {
  currentState: derivations.deterministicState,
  stateArrow: derivations.deterministicState,
  nextState: derivations.deterministicState,
  gas: derivations.gasBound,
  storage: derivations.worldState,
  revert: derivations.atomicRevert,
  receiptRoot: derivations.receiptMerkle,
  proof: derivations.proofSoundness,
  attestation: derivations.remoteAttestation,
  capabilityProof: derivations.zkCapability,
  identityCommitment: derivations.pedersenCommitment,
  stateRoot: derivations.worldState,
  initialProof: derivations.folding,
  delta: derivations.hashChain,
  fold: derivations.folding,
  recursiveProof: derivations.folding,
  commitmentStart: derivations.hashChain,
  commitmentEnd: derivations.hashChain,
  ruleHash: derivations.hashBinding,
  signedDemand: derivations.signedIntent,
  acceptedResult: derivations.validatorDecision,
  attestedExecution: derivations.remoteAttestation,
  antiReplay: derivations.antiReplay,
  poi: derivations.poi,
  identitySemantic: derivations.semanticAdapter,
  eventSemantic: derivations.eventLog,
  stateSemantic: derivations.semanticAdapter,
  proofSemantic: derivations.semanticAdapter,
};

function ArchitectureDetail({ hint, children, className = '' }: { hint: ArchitectureHintKey; children: ReactNode; className?: string }) {
  const note = architectureHints[hint];
  return (
    <DetailHint
      className={`technical-detail-token ${className}`.trim()}
      category="技术细节"
      label={children}
      title={note.title}
      summary={note.summary}
      details={note.details}
      derivation={architectureDerivations[hint]}
    />
  );
}

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
  explanation: string;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  anchor: 'start' | 'middle' | 'end';
};

const topologyNodes: TopologyNode[] = [
  { title: '身份', detail: 'IDENTITY', explanation: '绑定企业、用户、Agent、节点和合约密钥；每次动作都能追到授权主体与凭证状态。', x: 180, y: 55, labelX: 180, labelY: 19, anchor: 'middle' },
  { title: '策略', detail: 'POLICY', explanation: '检查能力范围、预算、时限、网络、工具和数据边界；越权调用在执行前被拒绝。', x: 244, y: 75, labelX: 260, labelY: 49, anchor: 'start' },
  { title: '预言机', detail: 'ORACLE', explanation: '把外部 API、设备或行业数据转成带来源、时效、签名和证明的可验证事实。', x: 280, y: 128, labelX: 300, labelY: 110, anchor: 'start' },
  { title: '链适配', detail: 'CHAIN', explanation: '把 ACVM 身份、事件、状态、证明和最终性语义映射到目标区块链接口。', x: 280, y: 192, labelX: 300, labelY: 190, anchor: 'start' },
  { title: '证明', detail: 'PROOF', explanation: '验证链下执行、隔离环境、身份资格和长期任务连续性，不要求每个节点重复重计算。', x: 244, y: 245, labelX: 260, labelY: 272, anchor: 'start' },
  { title: '状态', detail: 'STATE', explanation: '统一保存合约、任务、回执和证明状态，并按确定性规则计算下一状态根。', x: 180, y: 265, labelX: 180, labelY: 294, anchor: 'middle' },
  { title: '隔离', detail: 'TEE', explanation: '保护模型、密钥和敏感输入，远程证明绑定代码度量、硬件环境和本次 nonce。', x: 116, y: 245, labelX: 100, labelY: 272, anchor: 'end' },
  { title: '工具', detail: 'TOOLS', explanation: '为 Agent 提供受策略限制的 API、文件、数据库和模型调用，并为每次调用生成回执。', x: 80, y: 192, labelX: 60, labelY: 190, anchor: 'end' },
  { title: '安全', detail: 'SENTRY', explanation: '观察进程、网络和工具行为，按风险执行放行、警告、审批或阻断并写入安全回执。', x: 80, y: 128, labelX: 60, labelY: 110, anchor: 'end' },
  { title: '调度', detail: 'SCHEDULER', explanation: '根据能力、位置、负载、隐私级别和 SLA 选择 Worker / Validator，并管理等待与重试。', x: 116, y: 75, labelX: 100, labelY: 49, anchor: 'end' },
];

const topologyMesh = topologyNodes.flatMap((source, sourceIndex) =>
  topologyNodes.slice(sourceIndex + 1).map((target) => [source, target] as const),
);

function TopologyNodeLayer() {
  return (
    <g className="topology-node-layer">
      {topologyNodes.map((node) => (
        <g tabIndex={0} aria-label={`${node.title}：${node.explanation}`} key={node.detail}>
          <title>{node.title} / {node.detail}：{node.explanation}</title>
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
            <foreignObject className="state-transition-code" x="165" y="148" width="100" height="24">
              <div className="state-transition-formula">
                <ArchitectureDetail hint="currentState">Sₙ</ArchitectureDetail>{' '}
                <ArchitectureDetail hint="stateArrow">→</ArchitectureDetail>{' '}
                <ArchitectureDetail hint="nextState">Sₙ₊₁</ArchitectureDetail>
              </div>
            </foreignObject>
            <foreignObject className="state-transition-note" x="160" y="171" width="110" height="16">
              <div className="state-transition-semantics">
                <ArchitectureDetail hint="gas">GAS</ArchitectureDetail> · <ArchitectureDetail hint="storage">STORAGE</ArchitectureDetail> · <ArchitectureDetail hint="revert">REVERT</ArchitectureDetail>
              </div>
            </foreignObject>
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
          <footer><Icon name="chain" /><span><small>RESUME TRANSACTION</small><strong><ArchitectureDetail hint="receiptRoot">receiptRoot</ArchitectureDetail> · <ArchitectureDetail hint="proof">proof</ArchitectureDetail> · <ArchitectureDetail hint="attestation">attestation</ArchitectureDetail></strong></span></footer>
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
          <strong><ArchitectureDetail hint="capabilityProof">πcap</ArchitectureDetail></strong>
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
        <code>public: <ArchitectureDetail hint="identityCommitment">identityCommitment</ArchitectureDetail> · <ArchitectureDetail hint="stateRoot">stateRoot</ArchitectureDetail> · <ArchitectureDetail hint="receiptRoot">receiptRoot</ArchitectureDetail> · <ArchitectureDetail hint="proof">proof</ArchitectureDetail></code>
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
        <code><ArchitectureDetail hint="initialProof">π₀</ArchitectureDetail></code><Arrow />
        <code><ArchitectureDetail hint="fold">Fold</ArchitectureDetail>(<ArchitectureDetail hint="initialProof">π₀</ArchitectureDetail>, <ArchitectureDetail hint="delta">Δ₁</ArchitectureDetail>)</code><Arrow />
        <code>…</code><Arrow /><code><ArchitectureDetail hint="recursiveProof">πrecursive</ArchitectureDetail></code>
        <i />
        <section>
          <Icon name="chain" />
          <span><small>CHAIN VERIFIER</small><strong>completed = true</strong></span>
        </section>
      </div>
      <footer className="proof-public-private">
        <span><Icon name="lock" /><strong>PRIVATE</strong> 文档、Prompt、日志与中间结果</span>
        <span><Icon name="eye" /><strong>PUBLIC</strong> <ArchitectureDetail hint="commitmentStart">C₀</ArchitectureDetail> · <ArchitectureDetail hint="commitmentEnd">Cₙ</ArchitectureDetail> · <ArchitectureDetail hint="ruleHash">ruleHash</ArchitectureDetail> · <ArchitectureDetail hint="recursiveProof">πrecursive</ArchitectureDetail></span>
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
        <code>
          <ArchitectureDetail hint="poi">PoI</ArchitectureDetail> ={' '}
          <ArchitectureDetail hint="signedDemand">SignedDemand</ArchitectureDetail> ∧{' '}
          <ArchitectureDetail hint="acceptedResult">AcceptedResult</ArchitectureDetail> ∧{' '}
          <ArchitectureDetail hint="attestedExecution">AttestedExecution</ArchitectureDetail> ∧{' '}
          <ArchitectureDetail hint="antiReplay">AntiReplay</ArchitectureDetail>
        </code>
        <span>自造任务、重复回执和未通过验收的结果不能生成 PoI，也不能领取结果费</span>
      </div>
      <div className="poi-finality">
        <section>
          <small>订单结算</small>
          <strong>ValidPoI 解锁结果费</strong>
          <span>底层链继续负责最终确认</span>
        </section>
        <i />
        <section>
          <small>开放网络</small>
          <strong>用 VRF 选出区块提议者</strong>
          <span>PoI 只提供候选权重</span>
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
          <span><ArchitectureDetail hint="identitySemantic">Identity</ArchitectureDetail> · <ArchitectureDetail hint="eventSemantic">Event</ArchitectureDetail> · <ArchitectureDetail hint="stateSemantic">State</ArchitectureDetail> · <ArchitectureDetail hint="proofSemantic">Proof</ArchitectureDetail></span>
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
