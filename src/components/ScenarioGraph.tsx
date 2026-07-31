import { useMemo, useRef, useState } from 'react';
import { Icon, type IconName } from './Icons';
import { TechTerm, type TechKey } from './TechTerm';

type Industry = 'business' | 'government' | 'manufacturing' | 'finance' | 'education';
type ParticipantType = 'institution' | 'enterprise' | 'individual';

type Scenario = {
  id: string;
  industry: Industry;
  participant: ParticipantType;
  deployer: string;
  contract: string;
  title: string;
  thesis: string;
  delegator: string;
  provider: string;
  evidence: string;
  predicate: string;
  finality: string;
  terms: TechKey[];
};

const industryMeta: Record<Industry, { label: string; english: string; point: [number, number, number] }> = {
  business: { label: '商业', english: 'BUSINESS', point: [1.02, -0.18, 0.44] },
  government: { label: '政务', english: 'GOVERNMENT', point: [-0.78, -0.54, 0.62] },
  manufacturing: { label: '制造', english: 'MANUFACTURING', point: [-1.02, 0.24, -0.2] },
  finance: { label: '金融', english: 'FINANCE', point: [0.02, 0.66, -0.72] },
  education: { label: '教育', english: 'EDUCATION', point: [0.92, 0.38, -0.28] },
};

const scenarios: Scenario[] = [
  {
    id: 'ads', industry: 'business', participant: 'enterprise', deployer: '品牌企业', contract: 'AdSettlement.ac', title: '广告按效果结算',
    thesis: '有效转化经过多源核验后，推广预算才进入渠道账户。',
    delegator: '广告主签署预算、归因窗口与有效转化口径',
    provider: '推广渠道执行投放并申报本期转化结果',
    evidence: '广告平台 · 独立归因 · CRM 已支付订单',
    predicate: '已支付订单 ∧ 归因窗口 ≤ 7 天 ∧ 无效流量 < 5%',
    finality: '联盟链确认 2,184 个有效转化 · 渠道结算 ¥68,400',
    terms: ['zkTLS / TLSNotary', 'Receipt Root'],
  },
  {
    id: 'sla', industry: 'business', participant: 'enterprise', deployer: '企业客户', contract: 'ServiceSLA.ac', title: '软件 SLA 自动结算',
    thesis: '服务商监控、客户探针与工单共同还原故障，再计算服务费。',
    delegator: '企业客户与服务商签署可用率和扣费阶梯',
    provider: '软件服务商持续供服并提交月度账单',
    evidence: '服务监控 · 客户独立探针 · 故障工单',
    predicate: '监控连续 ∧ 故障归因一致 ∧ 排除批准维护窗口',
    finality: '可用率 99.82% · 扣减 ¥2,400 · 结算 ¥29,600',
    terms: ['Proof-carrying Execution', 'Receipt Root'],
  },
  {
    id: 'subsidy', industry: 'government', participant: 'institution', deployer: '主管部门', contract: 'SubsidyGrant.ac', title: '惠企补贴核验拨付',
    thesis: '跨部门只交换资格证明，不交换企业完整经营台账。',
    delegator: '主管部门发布专项条件、绩效指标和资金上限',
    provider: '申报企业提交身份承诺与补贴申请',
    evidence: '税务域 · 人社域 · 项目监管域',
    predicate: '主体有效 ∧ 投资达标 ∧ 就业达标 ∧ 未重复申领',
    finality: '财政与主管部门门限确认 · 拨付 ¥800,000',
    terms: ['Selective Disclosure', 'TEE', 'FROST'],
  },
  {
    id: 'gov-project', industry: 'government', participant: 'institution', deployer: '建设单位', contract: 'ProjectPayment.ac', title: '政府工程进度款',
    thesis: 'BIM、现场影像、监理签章和发票共同证明本期工程量。',
    delegator: '建设单位冻结工程清单、付款节点与本期上限',
    provider: '承建方完成施工并申报本期工程量',
    evidence: 'BIM 平台 · 现场影像 · 监理签章 · 电子发票',
    predicate: '工程量一致 ∧ 签章有效 ∧ 发票匹配 ∧ 无重复计量',
    finality: '四方门限确认本期 32.4% · 支付 ¥3,200,000',
    terms: ['DID / VC', 'FROST', 'Receipt Root'],
  },
  {
    id: 'quality', industry: 'manufacturing', participant: 'enterprise', deployer: '整机制造商', contract: 'BatchQuality.ac', title: '生产批次质量结算',
    thesis: '工艺、设备、质检和实验室证据闭合后，整批货款才放行。',
    delegator: '整机制造商冻结批次标准、工艺窗口和结算规则',
    provider: '零部件供应商生产并提交批次验收',
    evidence: 'MES · QMS · 独立实验室 · 产线传感器',
    predicate: '批次谱系完整 ∧ 良率 ≥ 99% ∧ 关键尺寸合格',
    finality: '批次 MF71-06 合格 · 供应商结算 ¥1,460,000',
    terms: ['DID / VC', 'Remote Attestation', 'Receipt Root'],
  },
  {
    id: 'supply', industry: 'manufacturing', participant: 'enterprise', deployer: '采购企业', contract: 'DeliveryEscrow.ac', title: '供应链验收付款',
    thesis: '交付数量、运输状态、仓储签收和抽检结果按同一批次闭合。',
    delegator: '采购企业发布订单、批次标准和付款条件',
    provider: '供应商生产发货并申请验收',
    evidence: '物流平台 · 温控设备 · 采购仓库 · 质检机构',
    predicate: '足量签收 ∧ 温控无越界 ∧ 抽检合格 ∧ 批次未替换',
    finality: '12,000 件通过验收 · 供应商结算 ¥252,000',
    terms: ['DID / VC', 'FROST', 'Receipt Root'],
  },
  {
    id: 'energy', industry: 'manufacturing', participant: 'enterprise', deployer: '生产企业', contract: 'EnergyOutcome.ac', title: '节能改造按效果付费',
    thesis: '在隐私域内归一化产量与工况，只按真实节能量付款。',
    delegator: '生产企业签署节能目标、基线版本和数据边界',
    provider: '节能服务商实施改造并申报节能效果',
    evidence: '智能电表 · MES 工况 · 固定基线模型',
    predicate: '计量连续 ∧ 基线固定 ∧ 工况归一化 ∧ 节能率达标',
    finality: '确认节能率 12.6% · 服务商结算 ¥386,000',
    terms: ['TEE', 'Remote Attestation', 'Proof-carrying Execution'],
  },
  {
    id: 'credit', industry: 'finance', participant: 'institution', deployer: '商业银行', contract: 'TradeCredit.ac', title: '供应链融资按履约放款',
    thesis: '真实贸易、货物交付和未重复质押同时成立，融资才分段释放。',
    delegator: '金融机构签署授信上限、风险规则和放款节点',
    provider: '供应商履行订单并提交应收账款融资请求',
    evidence: '核心企业订单 · 物流签收 · 电子票据 · 质押登记',
    predicate: '订单真实 ∧ 已交付 ∧ 发票有效 ∧ 未重复质押',
    finality: '贸易背景通过 · 分段放款 ¥5,000,000',
    terms: ['TEE', 'Selective Disclosure', 'Remote Attestation'],
  },
  {
    id: 'insurance', industry: 'finance', participant: 'institution', deployer: '保险机构', contract: 'CargoClaim.ac', title: '货运保险核验赔付',
    thesis: '轨迹、传感器、查勘和保单条件共同确定事故责任与赔付。',
    delegator: '保险机构与货主签署保障范围和赔付条件',
    provider: '被保险人申报货损事件与赔付请求',
    evidence: '物流轨迹 · 温湿度设备 · 查勘报告 · 电子保单',
    predicate: '事故在保 ∧ 证据连续 ∧ 非免责原因 ∧ 损失金额一致',
    finality: '理赔条件成立 · 赔付备案账户 ¥420,000',
    terms: ['DID / VC', 'zkTLS / TLSNotary', 'FROST'],
  },
  {
    id: 'research', industry: 'education', participant: 'institution', deployer: '科研资助机构', contract: 'ResearchMilestone.ac', title: '科研项目按里程碑拨款',
    thesis: '数月实验持续形成状态承诺，阶段成果被压缩为完成证明。',
    delegator: '资助单位签署任务书、里程碑和拨款条件',
    provider: '科研团队持续实验、分析并交付阶段成果',
    evidence: '科研仓库 · 伦理审批 · 设备记录 · 人工评审',
    predicate: '版本连续 ∧ 审批有效 ∧ 设备记录匹配任务书',
    finality: '递归完成证明有效 · 阶段拨款 ¥1,200,000',
    terms: ['IVC', 'Folding', 'Recursive ZK'],
  },
  {
    id: 'training', industry: 'education', participant: 'institution', deployer: '公共就业服务机构', contract: 'TrainingOutcome.ac', title: '职业培训按就业成效结算',
    thesis: '课程完成不等于成效，稳定就业经过隐私核验后才结算服务费。',
    delegator: '采购方签署培训人群、就业口径和观察期',
    provider: '培训机构交付课程并申报就业成效',
    evidence: '学习记录 · 企业录用 · 社保状态 · 学员授权',
    predicate: '完成课程 ∧ 真实录用 ∧ 稳定就业 ≥ 90 天',
    finality: '412 人达到就业口径 · 结算培训服务费',
    terms: ['Selective Disclosure', 'TEE', 'Receipt Root'],
  },
  {
    id: 'personal-buy', industry: 'business', participant: 'individual', deployer: '个人用户', contract: 'PersonalPurchase.ac', title: '个人 Agent 授权采购',
    thesis: '个人先写清预算、品类和退款条件，Agent 只能在授权范围内下单。',
    delegator: '个人用户签署预算上限、商品范围与有效期',
    provider: '购物 Agent 比价、下单并提交订单回执',
    evidence: '商家 API · 支付授权 · 物流状态 · 电子发票',
    predicate: '总价未超预算 ∧ 商品在白名单 ∧ 收货条件可验证',
    finality: '订单与授权一致 · 支付 ¥3,280 · 权限自动失效',
    terms: ['UCAN / ZCAP', 'zkTLS / TLSNotary', 'Receipt Root'],
  },
  {
    id: 'freelance', industry: 'business', participant: 'individual', deployer: '独立开发者', contract: 'FreelanceEscrow.ac', title: '自由职业成果托管',
    thesis: '需求、版本、验收和付款节点写在同一份合约里，减少交付扯皮。',
    delegator: '独立开发者与客户共同确认交付清单和验收口径',
    provider: '个人工作 Agent 提交版本、测试报告和里程碑回执',
    evidence: '代码仓库 · CI 结果 · 客户验收 · 签名工单',
    predicate: '版本匹配 ∧ 测试通过 ∧ 验收签名有效 ∧ 未重复结算',
    finality: '里程碑 M3 通过 · 托管款释放 ¥18,000',
    terms: ['DID / VC', 'Proof-carrying Execution', 'Receipt Root'],
  },
];

type GraphNode = {
  id: string;
  kind: 'core' | 'participant' | 'contract';
  label: string;
  point: [number, number, number];
  participant?: ParticipantType;
  scenario?: Scenario;
};

const participantMeta: Record<ParticipantType, { label: string; english: string; point: [number, number, number] }> = {
  institution: { label: '机构节点', english: 'INSTITUTION', point: [-0.82, 0.34, -0.18] },
  enterprise: { label: '企业节点', english: 'ENTERPRISE', point: [0.82, 0.2, 0.24] },
  individual: { label: '个人节点', english: 'INDIVIDUAL', point: [-0.03, -0.76, 0.36] },
};

const contractOffsets: Array<[number, number, number]> = [
  [-0.28, 0.16, 0.14],
  [0.18, 0.28, -0.12],
  [-0.3, -0.18, -0.1],
  [0.3, -0.13, 0.1],
  [0.02, 0.38, 0.18],
  [0.08, -0.34, -0.2],
];

const graphNodes: GraphNode[] = [
  { id: 'acvm', kind: 'core', label: 'ACVM CHAIN', point: [0, 0, 0] },
  ...(Object.keys(participantMeta) as ParticipantType[]).flatMap((participant) => {
    const meta = participantMeta[participant];
    const related = scenarios.filter((scenario) => scenario.participant === participant);
    return [
      { id: `participant-${participant}`, kind: 'participant' as const, label: meta.label, point: meta.point, participant },
      ...related.map((scenario, index) => {
        const offset = contractOffsets[index % contractOffsets.length];
        return {
          id: `contract-${scenario.id}`,
          kind: 'contract' as const,
          label: scenario.contract,
          point: [meta.point[0] + offset[0], meta.point[1] + offset[1], meta.point[2] + offset[2]] as [number, number, number],
          participant,
          scenario,
        };
      }),
    ];
  }),
];

const graphLinks = [
  ...(Object.keys(participantMeta) as ParticipantType[]).map((participant) => ['acvm', `participant-${participant}`] as const),
  ...scenarios.map((scenario) => [`participant-${scenario.participant}`, `contract-${scenario.id}`] as const),
];

function project(point: [number, number, number], yaw: number, pitch: number) {
  const yr = yaw * Math.PI / 180;
  const pr = pitch * Math.PI / 180;
  const [x, y, z] = point;
  const x1 = x * Math.cos(yr) - z * Math.sin(yr);
  const z1 = x * Math.sin(yr) + z * Math.cos(yr);
  const y1 = y * Math.cos(pr) - z1 * Math.sin(pr);
  const z2 = y * Math.sin(pr) + z1 * Math.cos(pr);
  const depthScale = 3.2 / (3.2 + z2 * 0.72);
  return {
    x: 50 + x1 * 31 * depthScale,
    y: 50 - y1 * 34 * depthScale,
    z: z2,
    scale: Math.max(0.72, Math.min(1.18, depthScale)),
  };
}

export function ScenarioGraph() {
  const [selectedId, setSelectedId] = useState('ads');
  const [yaw, setYaw] = useState(-12);
  const [pitch, setPitch] = useState(10);
  const dragRef = useRef<{ x: number; y: number; yaw: number; pitch: number; moved: boolean } | null>(null);
  const selectedIndex = scenarios.findIndex((scenario) => scenario.id === selectedId);
  const selected = scenarios[selectedIndex] ?? scenarios[0];
  const journeySteps: Array<[string, string, string, IconName]> = [
    ['01', '委托与规则', selected.delegator, 'fingerprint'],
    ['02', '服务与申报', selected.provider, 'terminal'],
    ['03', '独立事实', selected.evidence, 'eye'],
    ['04', 'ACVM 验证', selected.predicate, 'shield'],
    ['05', '链上确认', selected.finality, 'chain'],
  ];

  const projected = useMemo(() => {
    const entries = graphNodes.map((node) => [node.id, project(node.point, yaw, pitch)] as const);
    return new Map(entries);
  }, [yaw, pitch]);

  const selectRelative = (delta: number) => {
    const next = (selectedIndex + delta + scenarios.length) % scenarios.length;
    setSelectedId(scenarios[next].id);
  };

  return (
    <div className="scenario-explorer">
      <div
        className="scenario-space"
        onPointerDown={(event) => {
          if ((event.target as HTMLElement).closest('button')) return;
          dragRef.current = { x: event.clientX, y: event.clientY, yaw, pitch, moved: false };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current;
          if (!drag) return;
          const dx = event.clientX - drag.x;
          const dy = event.clientY - drag.y;
          if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
          setYaw(drag.yaw + dx * 0.24);
          setPitch(Math.max(-22, Math.min(25, drag.pitch - dy * 0.18)));
        }}
        onPointerUp={(event) => {
          dragRef.current = null;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        aria-label="可拖拽旋转的 ACVM Agentic Contract 部署网络"
      >
        <header><code>ACVM / DEPLOYED CONTRACT NETWORK</code><span><i /> DRAG TO ROTATE</span></header>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <ellipse cx="50" cy="50" rx="38" ry="24" />
          <ellipse cx="50" cy="50" rx="25" ry="39" transform="rotate(58 50 50)" />
          {graphLinks.map(([sourceId, targetId]) => {
            const source = projected.get(sourceId)!;
            const target = projected.get(targetId)!;
            const active = targetId === `contract-${selected.id}`;
            return <line className={active ? 'is-active' : ''} x1={source.x} y1={source.y} x2={target.x} y2={target.y} key={`${sourceId}-${targetId}`} />;
          })}
        </svg>
        {graphNodes.map((node) => {
          const point = projected.get(node.id)!;
          const active = node.scenario?.id === selected.id;
          const style = {
            left: `${point.x}%`,
            top: `${point.y}%`,
            zIndex: Math.round((point.z + 3) * 10),
            opacity: 0.7 + point.scale * 0.25,
            '--node-scale': point.scale,
          } as React.CSSProperties;

          if (node.kind === 'contract' && node.scenario) {
            return (
              <button
                className={`graph-node graph-node--contract graph-node--${node.participant} ${active ? 'is-active' : ''}`}
                style={style}
                type="button"
                key={node.id}
                onClick={() => setSelectedId(node.scenario!.id)}
                aria-label={`${participantMeta[node.participant!].label}部署的 ${node.label}：${node.scenario.title}`}
              >
                <i />
                <span><small>{node.scenario.title}</small>{node.label}</span>
              </button>
            );
          }

          return (
            <div className={`graph-node graph-node--${node.kind} ${node.participant ? `graph-node--${node.participant}` : ''}`} style={style} key={node.id}>
              {node.kind === 'core' ? <Icon name="terminal" /> : null}
              <strong>{node.label}</strong>
            </div>
          );
        })}
        <footer>
          <span className="is-institution">机构</span>
          <span className="is-enterprise">企业</span>
          <span className="is-individual">个人</span>
          <strong>{scenarios.length} CONTRACTS</strong>
        </footer>
      </div>

      <article className={`scenario-detail scenario-detail--${selected.industry}`} key={selected.id}>
        <header>
          <span>{String(selectedIndex + 1).padStart(2, '0')} / {String(scenarios.length).padStart(2, '0')} · {participantMeta[selected.participant].english} NODE</span>
          <div>
            <button type="button" onClick={() => selectRelative(-1)} aria-label="上一个场景">←</button>
            <button type="button" onClick={() => selectRelative(1)} aria-label="下一个场景">→</button>
          </div>
          <h3>{selected.title}</h3>
          <p>{selected.thesis}</p>
          <dl className="contract-deployment">
            <div><dt>DEPLOYER</dt><dd>{selected.deployer}</dd></div>
            <div><dt>AGENTIC CONTRACT</dt><dd>{selected.contract}</dd></div>
          </dl>
        </header>
        <div className="scenario-steps" aria-label={`${selected.title}端到端业务流程`}>
          {journeySteps.map(([code, label, detail, icon], index) => (
            <section style={{ '--step-index': index } as React.CSSProperties} key={code}>
              <span><Icon name={icon} /></span>
              <p><small>{code} · {label}</small><strong>{detail}</strong></p>
            </section>
          ))}
        </div>
        <footer>
          <span><i /> VERIFIED FINALITY</span>
          <div>{selected.terms.map((term) => <TechTerm term={term} key={term} />)}</div>
        </footer>
      </article>
    </div>
  );
}
