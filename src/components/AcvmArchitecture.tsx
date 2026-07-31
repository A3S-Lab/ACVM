import { Icon, type IconName } from './Icons';
import { TechTerm, type TechKey } from './TechTerm';

type RuntimeNode = {
  code: string;
  name: string;
  icon: IconName;
  input: string;
  inside: string;
  output: string;
  boundary: string;
  terms: TechKey[];
};

const runtimeNodes: RuntimeNode[] = [
  {
    code: '01',
    name: 'Contract Loader / IR',
    icon: 'terminal',
    input: '签名 Package、Schema 与版本',
    inside: '校验 Manifest，解析目标、参与方、状态、事件、工具类型和验收谓词，生成可执行 IR。',
    output: '不可变 Contract Instance',
    boundary: '不执行模型推理，也不替代组织身份注册。',
    terms: ['Intent-centric', 'DID / VC'],
  },
  {
    code: '02',
    name: 'State Machine & Scheduler',
    icon: 'bolt',
    input: '事件、计时器、上一步状态根',
    inside: '推进长期状态机，管理等待、超时、重试、人工审批和检查点；每次转移都绑定输入事件。',
    output: '下一可运行步骤 + State Root',
    boundary: '不负责联盟链共识；它只计算合约状态。',
    terms: ['IVC', 'Folding'],
  },
  {
    code: '03',
    name: 'Progressive Tool Bridge',
    icon: 'key',
    input: '当前目标、能力范围、工具 Schema',
    inside: '按 list → describe → dry-run → execute 发现企业 API，用 UCAN / ZCAP 类能力令牌把短期授权绑定到合约、工具、参数和时限。',
    output: 'Capability Token + Signed Tool Receipt',
    boundary: '不持有长期万能密钥，也不允许 Agent 枚举无关 API。',
    terms: ['UCAN / ZCAP'],
  },
  {
    code: '04',
    name: 'Policy Enforcement',
    icon: 'shield',
    input: 'Manifest 策略、预算、门限授权、AnySentry 决定',
    inside: '检查身份、范围、资金、副作用与风险信号；高风险动作可要求 FROST 门限签名，再把 ALLOW、APPROVAL 或 BLOCK 落实为状态转移。',
    output: '策略决定 + Threshold Receipt',
    boundary: 'AnySentry 判断风险；ACVM 负责让决定真正生效。',
    terms: ['FROST', 'Selective Disclosure'],
  },
  {
    code: '05',
    name: 'Receipt / Proof Builder',
    icon: 'receipt',
    input: '状态承诺、工具回执、证明与控制决定',
    inside: '聚合可验证执行事实，构造结算凭证、长期完成证明和链适配器所需的公共输入。',
    output: 'Receipt Root + Proof',
    boundary: '不上链保存原始业务数据、提示词或企业内部台账。',
    terms: ['Proof-carrying Execution', 'Receipt Root', 'Recursive ZK'],
  },
];

export function AcvmRuntimeArchitecture() {
  return (
    <div className="acvm-runtime-view acvm-runtime-view--expanded">
      <div className="contract-package">
        <header><span>AGENTIC CONTRACT PACKAGE</span><strong>发布一次，责任和规则同时固定</strong></header>
        <div>
          <span><Icon name="terminal" /><strong>Manifest</strong><small>目标 · 状态 · 参与方</small></span>
          <span><Icon name="fingerprint" /><strong>Identity / Capability</strong><small>主体绑定 · πcap</small></span>
          <span><Icon name="shield" /><strong>Policy</strong><small>工具 · 数据 · 预算边界</small></span>
          <span><Icon name="check" /><strong>Acceptance Rule</strong><small>验收 · 结算 · 争议分支</small></span>
        </div>
      </div>

      <div className="architecture-downlink"><i /><span>LOAD SIGNED PACKAGE</span><i /></div>

      <div className="runtime-kernel runtime-kernel--expanded">
        <header>
          <span><i /> ACVM RUNTIME</span>
          <strong>事件驱动 · 可暂停 · 可恢复 · 可证明</strong>
        </header>
        <div className="runtime-node-grid">
          {runtimeNodes.map((node) => (
            <section className="runtime-node-card" key={node.code}>
              <header>
                <span>{node.code}</span>
                <Icon name={node.icon} />
                <strong>{node.name}</strong>
              </header>
              <p>{node.inside}</p>
              <div className="runtime-node-io">
                <span><small>INPUT</small><strong>{node.input}</strong></span>
                <span><small>OUTPUT</small><strong>{node.output}</strong></span>
              </div>
              <div className="tech-term-row">
                {node.terms.map((term) => <TechTerm term={term} key={term} />)}
              </div>
              <footer><Icon name="lock" /><span>{node.boundary}</span></footer>
            </section>
          ))}
        </div>
      </div>

      <div className="runtime-ports">
        <div>
          <small>EXTERNAL EXECUTION</small>
          <span>a3s-box</span><span>a3s-power</span><span>AnySentry</span>
        </div>
        <i><Icon name="arrow" /></i>
        <div>
          <small>ENTERPRISE CAPABILITIES</small>
          <span>Progressive API</span><span>Zero Trust Gateway</span><span>短期凭据</span>
        </div>
        <i><Icon name="arrow" /></i>
        <div>
          <small>FINALITY</small>
          <span>Chain Adapter</span><span>Consensus</span><span>Audit Ledger</span>
        </div>
      </div>
    </div>
  );
}

const identityLinks = [
  {
    code: 'ORG',
    title: '企业或个人责任主体',
    detail: '企业 CA / 国密证书 / DID / VC / 法定授权',
    output: 'principal commitment',
  },
  {
    code: 'AGENT',
    title: '唯一 Agent 实例',
    detail: '主体签发的 Agent Key + 设备或 TEE 度量',
    output: 'agent instance id',
  },
  {
    code: 'AC',
    title: 'Agentic Contract 实例',
    detail: 'Manifest Hash + 发布者签名 + 版本与撤销状态',
    output: 'contract instance id',
  },
  {
    code: 'SESSION',
    title: '一次工具会话',
    detail: '绑定 tool、args hash、scope、expiry 的短期授权',
    output: 'ephemeral grant',
  },
];

export function IdentityArchitecture() {
  return (
    <div className="identity-architecture">
      <div className="identity-chain">
        <header>
          <span>RESPONSIBILITY CHAIN</span>
          <strong>唯一身份不是一个钱包地址，而是一条可撤销的责任绑定。</strong>
        </header>
        <div>
          {identityLinks.map((link, index) => (
            <section key={link.code}>
              <i>{link.code}</i>
              <strong>{link.title}</strong>
              <p>{link.detail}</p>
              <small>{link.output}</small>
              {index < identityLinks.length - 1 ? <em><Icon name="arrow" /></em> : null}
            </section>
          ))}
        </div>
        <footer>
          <Icon name="fingerprint" />
          <p><strong>ACVM 每次调用都重新验证整条绑定</strong><span>主体有效 · Agent 未撤销 · 合约版本一致 · 会话未过期 · 请求参数未被替换</span></p>
        </footer>
      </div>

      <div className="capability-proof">
        <header>
          <span>SELECTIVE DISCLOSURE · ZK CAPABILITY PROOF</span>
          <strong>证明“有资格”，不公开资格底牌。 <TechTerm term="Selective Disclosure" /></strong>
        </header>
        <div className="zk-proof-flow">
          <section className="is-private">
            <small>PRIVATE WITNESS</small>
            <strong>企业内部凭据</strong>
            <ul>
              <li>岗位、牌照与 VC / BBS+ 签发链</li>
              <li>模型评测与能力分数</li>
              <li>工具授权台账与撤销记录</li>
            </ul>
          </section>
          <i><Icon name="arrow" /></i>
          <section className="is-circuit">
            <small>ZK CIRCUIT</small>
            <strong>只验证约束</strong>
            <ul>
              <li>签发者可信且凭据未撤销</li>
              <li>能力等级达到合约阈值</li>
              <li>选择性披露且请求范围是授权子集</li>
            </ul>
          </section>
          <i><Icon name="arrow" /></i>
          <section className="is-public">
            <small>PUBLIC OUTPUT</small>
            <strong>πcap</strong>
            <ul>
              <li>主体承诺与能力类别</li>
              <li>Scope Hash 与有效窗口</li>
              <li>proof = valid / invalid</li>
            </ul>
          </section>
        </div>
        <footer>
          <span><Icon name="eye" /> 验证方能看到</span>
          <strong>主体、能力类别、范围、有效期和证明</strong>
          <span><Icon name="lock" /> 验证方看不到</span>
          <strong>内部评分、模型细节、人员台账与原始凭据</strong>
        </footer>
      </div>
    </div>
  );
}

type TopologyNode = {
  label: string;
  detail?: string;
};

function ProtocolTopology({
  code,
  title,
  subtitle,
  nodes,
  accent,
}: {
  code: string;
  title: string;
  subtitle: string;
  nodes: TopologyNode[];
  accent: string;
}) {
  const positions = [
    [130, 25],
    [198, 48],
    [225, 112],
    [203, 180],
    [130, 207],
    [57, 180],
    [35, 112],
    [62, 48],
  ];

  return (
    <figure className="protocol-topology" style={{ '--protocol-accent': accent } as React.CSSProperties}>
      <svg viewBox="0 0 260 232" aria-hidden="true">
        <circle className="protocol-ring" cx="130" cy="112" r="92" />
        <circle className="protocol-ring protocol-ring--inner" cx="130" cy="112" r="50" />
        {nodes.map((node, index) => {
          const [x, y] = positions[index];
          const textX = x < 75 ? 7 : x > 185 ? 253 : x;
          const anchor = x < 75 ? 'start' : x > 185 ? 'end' : 'middle';
          const textY = y < 45 ? y - 10 : y > 185 ? y + 18 : y + 4;
          return (
            <g key={node.label}>
              <path className="protocol-spoke" d={`M130 112L${x} ${y}`} />
              <circle className="protocol-node" cx={x} cy={y} r="4.5" />
              <text x={textX} y={textY} textAnchor={anchor}>{node.label}</text>
            </g>
          );
        })}
        <rect className="protocol-core" x="101" y="94" width="58" height="36" />
        <text className="protocol-core-code" x="130" y="108" textAnchor="middle">{code}</text>
        <text className="protocol-core-title" x="130" y="120" textAnchor="middle">{title}</text>
      </svg>
      <figcaption>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </figcaption>
    </figure>
  );
}

export function OffchainArchitecture() {
  const oracleNodes: TopologyNode[] = [
    { label: '企业 API' },
    { label: 'IoT 设备' },
    { label: '政务数据' },
    { label: 'zkTLS' },
    { label: '时间戳' },
    { label: '多源共识' },
    { label: 'Web Proof' },
    { label: '新鲜度' },
  ];
  const computeNodes: TopologyNode[] = [
    { label: 'State' },
    { label: 'Scheduler' },
    { label: 'Tool Bridge' },
    { label: 'a3s-box' },
    { label: 'a3s-power' },
    { label: 'AnySentry' },
    { label: 'TEE' },
    { label: 'IVC / ZK' },
  ];
  const chainNodes: TopologyNode[] = [
    { label: 'Identity' },
    { label: 'Event' },
    { label: 'Proof' },
    { label: 'Finality' },
    { label: 'Light Client' },
    { label: 'FISCO BCOS' },
    { label: '长安链' },
    { label: 'Threshold Sig' },
  ];

  return (
    <div className="offchain-architecture">
      <header className="offchain-protocol-head">
        <span><i /> TRUSTED OFF-CHAIN COMPUTE PROTOCOL</span>
        <strong>链上负责触发与终局，ACVM 负责可信链下执行。</strong>
        <small>原始数据与模型留在企业隐私域</small>
      </header>

      <div className="protocol-topology-row">
        <ProtocolTopology
          code="01"
          title="AUTHENTICATED ORACLE"
          subtitle="授权事实进入 · 来源可验 · 时效可判"
          nodes={oracleNodes}
          accent="#9ddbd8"
        />
        <div className="protocol-bridge">
          <code>Signed Fact Envelope</code>
          <span><i /><Icon name="arrow" /></span>
          <small>source · schema · timestamp<br />signature · freshness · quorum</small>
        </div>
        <ProtocolTopology
          code="02"
          title="ACVM OFF-CHAIN COMPUTE"
          subtitle="长期状态 · 工具执行 · 隐私推理 · 风险控制"
          nodes={computeNodes}
          accent="#b1d5e8"
        />
        <div className="protocol-bridge">
          <code>Receipt Root / ZK Proof</code>
          <span><i /><Icon name="arrow" /></span>
          <small>stateRoot · toolReceipt<br />modelAttestation · πrecursive</small>
        </div>
        <ProtocolTopology
          code="03"
          title="ON-CHAIN VERIFIER"
          subtitle="验证公共输入 · 多机构共识 · 业务终局"
          nodes={chainNodes}
          accent="#c7c1e2"
        />
      </div>

      <div className="offchain-mechanisms">
        <section>
          <small>ENTERPRISE DATA ORACLE</small>
          <strong>企业数据预言机 · <TechTerm term="zkTLS / TLSNotary" /></strong>
          <p>用来源签名、时间戳、新鲜度窗口和多源一致性证明，把业务事实带入 ACVM；不是币价喂价。</p>
        </section>
        <section>
          <small>OFF-CHAIN COMPUTE</small>
          <strong>链下计算 · <TechTerm term="Proof-carrying Execution" /></strong>
          <p>长任务、非确定性推理和企业工具在链下运行，持续携带状态承诺、策略决定与可验证回执。</p>
        </section>
        <section>
          <small>PRIVATE INFERENCE</small>
          <strong>隐私推理 · <TechTerm term="TEE" /> <TechTerm term="MPC" /> <TechTerm term="FHE" /></strong>
          <p>a3s-box 隔离工作负载，a3s-power 绑定模型哈希与硬件度量；跨机构场景可组合多方隐私计算。</p>
        </section>
        <section>
          <small>VERIFIABLE COMPUTATION</small>
          <strong>可验证计算 · <TechTerm term="IVC" /> <TechTerm term="Recursive ZK" /></strong>
          <p>执行回执、硬件证明与递归证明把长期任务折叠成链上可验的公共输入。</p>
        </section>
      </div>

      <footer className="oracle-boundary">
        <span><Icon name="eye" /><strong>预言机 / Oracle</strong>把外部事实带入 ACVM</span>
        <i>≠</i>
        <span><Icon name="key" /><strong>工具桥接 / Tool Bridge</strong>让 Agent 在授权后执行外部动作</span>
        <i>≠</i>
        <span><Icon name="chain" /><strong>联盟链 / Ledger</strong>验证证明并确认业务终局</span>
      </footer>
    </div>
  );
}
