import { useMemo, useRef, useState } from 'react';
import { DetailHint } from './DetailHint';
import { Icon, type IconName } from './Icons';
import { TechTerm, type TechKey } from './TechTerm';

type Industry = 'business' | 'government' | 'manufacturing' | 'finance' | 'education';
type ParticipantType = 'institution' | 'enterprise' | 'individual';
type ParticipantFilter = ParticipantType | 'all';

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
    id: 'geo', industry: 'business', participant: 'enterprise', deployer: '品牌企业', contract: 'GEOOutcome.ac', title: 'GEO 按增量效果结算',
    thesis: 'GEO Agent 持续优化内容，Validator 只按独立观测到的引用增量验收。',
    delegator: '品牌方冻结问题集、观测引擎、基线、周期和每个增量点单价',
    provider: 'GEO Worker 修改内容并提交站点版本、发布回执和执行轨迹',
    evidence: '签名问题集 · 多引擎独立观测 · 站点版本 · 自然访问数据',
    predicate: '观察期 ≥ 30 天 ∧ 引用增量 ≥ 8pp ∧ 排除付费与合成查询',
    finality: '引用份额 14.2% → 25.8% · 有效增量 11.6pp · 结算 ¥116,000',
    terms: ['zkTLS / TLSNotary', 'Proof-carrying Execution', 'Receipt Root'],
  },
  {
    id: 'quant', industry: 'finance', participant: 'institution', deployer: '资产管理机构', contract: 'QuantPerformance.ac', title: '量化交易按净收益抽成',
    thesis: '量化 Agent 在限仓与止损规则内交易，Validator 只计算扣除成本后的可分成利润。',
    delegator: '资管机构冻结账户、策略哈希、风险上限、基准、高水位和抽成比例',
    provider: 'Quant Worker 生成信号并在授权账户内发送订单',
    evidence: '交易所签名成交 · 托管账户 · 市场数据 · 手续费与资金流水',
    predicate: '无外部资金流入 ∧ 最大回撤 ≤ 8% ∧ 净值高于高水位 ∧ 超额收益 > 0',
    finality: '核验净收益 ¥1,840,000 · 抽成 20% · 绩效费 ¥368,000',
    terms: ['TEE', 'zkTLS / TLSNotary', 'Receipt Root'],
  },
  {
    id: 'sales', industry: 'business', participant: 'enterprise', deployer: 'B2B 服务企业', contract: 'SalesOutcome.ac', title: '销售 Agent 按回款结算',
    thesis: '不按线索数付费，只按过退款期且真实到账的新增回款结算。',
    delegator: '企业冻结客户范围、基准收入、归因窗口、退款期和佣金阶梯',
    provider: 'Sales Worker 找客户、跟进商机并提交沟通与订单回执',
    evidence: 'CRM 轨迹 · 签名合同 · 银行到账 · 发票与退款状态',
    predicate: '新增客户 ∧ 归因有效 ∧ 已到账 ∧ 退款期结束 ∧ 无重复计佣',
    finality: '可归因回款 ¥2,760,000 · 佣金率 6% · 结算 ¥165,600',
    terms: ['DID / VC', 'zkTLS / TLSNotary', 'Receipt Root'],
  },
  {
    id: 'support', industry: 'business', participant: 'enterprise', deployer: '软件服务商', contract: 'SupportResolution.ac', title: '客服 Agent 按解决率结算',
    thesis: '机器人回复不算完成，问题按时解决、没有重开且用户确认后才计费。',
    delegator: '服务商冻结工单类型、SLA、禁用动作、重开窗口和单价',
    provider: 'Support Worker 诊断问题、调用授权工具并提交处理轨迹',
    evidence: '工单事件 · 产品遥测 · 用户确认 · 72 小时重开状态',
    predicate: 'SLA 内解决 ∧ 未越权 ∧ 用户确认 ∧ 72 小时内未重开',
    finality: '核验解决 8,412 单 · 一次解决率 87.3% · 按结果结算',
    terms: ['UCAN / ZCAP', 'Proof-carrying Execution', 'Receipt Root'],
  },
  {
    id: 'procurement', industry: 'manufacturing', participant: 'enterprise', deployer: '制造企业', contract: 'ProcurementSavings.ac', title: '采购 Agent 按节省金额抽成',
    thesis: '规格和市场基线先冻结，只有质量、交期都满足的真实节省才参与分成。',
    delegator: '采购方冻结物料规格、合格供应商、市场基线、交期和分成比例',
    provider: 'Procurement Worker 询价、议价并在授权范围内下单',
    evidence: '签名报价 · 采购订单 · 质检报告 · 入库与付款记录',
    predicate: '规格一致 ∧ 按时入库 ∧ 质检合格 ∧ 实付价低于固定基线',
    finality: '核验节省 ¥920,000 · 分成 15% · Agent 服务费 ¥138,000',
    terms: ['DID / VC', 'Proof-carrying Execution', 'Receipt Root'],
  },
  {
    id: 'energy', industry: 'manufacturing', participant: 'enterprise', deployer: '生产企业', contract: 'EnergyOutcome.ac', title: '节能改造按效果付费',
    thesis: '产量、天气和工况在隐私域内归一化，只按可复核的节能收益付款。',
    delegator: '工厂冻结基线模型、计量点、生产边界、观察期和收益分成',
    provider: 'Energy Worker 调度设备并持续提交控制动作与表计回执',
    evidence: '智能电表 · MES 工况 · 天气数据 · 固定基线模型',
    predicate: '计量连续 ∧ 基线未改 ∧ 工况已归一化 ∧ 产能与质量不下降',
    finality: '核验节能率 12.6% · 节省 ¥1,930,000 · 服务费 ¥386,000',
    terms: ['TEE', 'Remote Attestation', 'Proof-carrying Execution'],
  },
  {
    id: 'cyber', industry: 'government', participant: 'institution', deployer: '安全运营中心', contract: 'IncidentContainment.ac', title: '安全 Agent 按处置结果结算',
    thesis: '告警数量没有价值，只有越权被阻断、攻击被控制且观察期内不复发才算完成。',
    delegator: 'SOC 冻结资产范围、允许动作、处置时限、升级规则和复发窗口',
    provider: 'Security Worker 调查告警并执行已授权的隔离与修复动作',
    evidence: 'EDR 事件 · 网络流量 · 变更审批 · 72 小时复发观测',
    predicate: '动作已授权 ∧ 控制时间达标 ∧ 关键业务未中断 ∧ 72 小时无复发',
    finality: '事件 IR-2048 已控制 · MTTContain 11 分钟 · 释放处置赏金',
    terms: ['UCAN / ZCAP', 'Remote Attestation', 'Receipt Root'],
  },
  {
    id: 'clinical', industry: 'education', participant: 'institution', deployer: '临床研究机构', contract: 'TrialEnrollment.ac', title: '临床招募按合格入组结算',
    thesis: '匹配结果留在医院隐私域，知情同意和真实入组同时成立后才结算。',
    delegator: '研究机构冻结入排标准、伦理批件、站点范围和单例费用',
    provider: 'Recruitment Worker 在授权病历域内筛选并联系候选人',
    evidence: '脱敏病历承诺 · 伦理批件 · 知情同意 · 试验登记',
    predicate: '满足入排标准 ∧ 同意有效 ∧ 已真实入组 ∧ 未在其他站点重复',
    finality: '34 例通过独立核验 · 原始病历未出院 · 按合格入组结算',
    terms: ['TEE', 'Selective Disclosure', 'Receipt Root'],
  },
  {
    id: 'drug', industry: 'education', participant: 'institution', deployer: '药物研发机构', contract: 'DrugHitMilestone.ac', title: '药物筛选按复现实验结算',
    thesis: '模型评分不直接触发付款，候选分子必须由独立实验室复现活性。',
    delegator: '研发方冻结靶点、化学空间、活性阈值、毒性边界和复现实验流程',
    provider: 'Discovery Worker 生成并筛选候选分子，提交模型与计算轨迹',
    evidence: '模型版本 · 候选承诺 · 合成记录 · 独立实验室盲测',
    predicate: '结构合规 ∧ 无数据泄漏 ∧ 活性达标 ∧ 独立实验可重复',
    finality: '3 个候选达到双实验室复现门槛 · 释放里程碑款',
    terms: ['zkML', 'DID / VC', 'Receipt Root'],
  },
  {
    id: 'recovery', industry: 'finance', participant: 'institution', deployer: '保险机构', contract: 'RecoveryOutcome.ac', title: '保险追偿按实际回款抽成',
    thesis: '不按发函或立案计费，只按扣除批准成本后的真实追偿到账分成。',
    delegator: '保险机构冻结案件范围、授权动作、成本上限、到账口径和抽成比例',
    provider: 'Recovery Worker 调查责任、准备材料并推进追偿流程',
    evidence: '理赔档案 · 责任文件 · 法律文书 · 银行到账与成本票据',
    predicate: '责任成立 ∧ 动作合规 ∧ 回款已清算 ∧ 成本在批准范围 ∧ 未重复计费',
    finality: '净追偿到账 ¥4,200,000 · 抽成 12% · 服务费 ¥504,000',
    terms: ['DID / VC', 'Selective Disclosure', 'Receipt Root'],
  },
  {
    id: 'public-case', industry: 'government', participant: 'institution', deployer: '公共服务机构', contract: 'CaseResolution.ac', title: '政务 Agent 按办结质量结算',
    thesis: '流转次数不算成绩，材料完整、依法按时办结且没有退件才计入服务量。',
    delegator: '主管机构冻结事项清单、材料规则、法定时限和回退观察期',
    provider: 'Case Worker 检查材料、跨部门协同并提交办理轨迹',
    evidence: '申请签名 · 材料承诺 · 部门回执 · 申请人收件确认',
    predicate: '授权有效 ∧ 材料完整 ∧ 法定时限内办结 ∧ 观察期内未退件',
    finality: '1,286 件通过质量核验 · 退件率 0.7% · 按有效办结计费',
    terms: ['DID / VC', 'Selective Disclosure', 'FROST'],
  },
  {
    id: 'personal-buy', industry: 'business', participant: 'individual', deployer: '个人用户', contract: 'PersonalSavings.ac', title: '个人采购按节省金额奖励',
    thesis: 'Agent 只有在买对规格、按时送达且过退货期后，才分享相对固定基线的节省。',
    delegator: '用户冻结商品规格、商家白名单、市场基线、预算和奖励比例',
    provider: 'Purchase Worker 比价、领券、下单并提交订单与物流轨迹',
    evidence: '多平台报价 · 支付回执 · 物流签收 · 退货状态 · 电子发票',
    predicate: '规格一致 ∧ 未超预算 ∧ 已签收 ∧ 退货期结束 ∧ 实付低于基线',
    finality: '相对基线节省 ¥1,240 · Agent 奖励 20% · 支付 ¥248',
    terms: ['UCAN / ZCAP', 'zkTLS / TLSNotary', 'Receipt Root'],
  },
  {
    id: 'code-bounty', industry: 'business', participant: 'individual', deployer: '开源维护者', contract: 'PatchBounty.ac', title: '编码 Agent 按稳定合并结算',
    thesis: '提交代码不等于完成，CI、审查、合并和无回归观察期全部通过才释放赏金。',
    delegator: '维护者冻结 Issue、目标版本、测试集、修改范围、观察期和赏金',
    provider: 'Code Worker 定位问题、提交补丁并保留工具调用和版本轨迹',
    evidence: 'Git 提交 · CI 报告 · 代码审查 · 合并状态 · 14 天回归监控',
    predicate: '修改范围合规 ∧ 测试通过 ∧ 已合并 ∧ 14 天无同源回归',
    finality: 'PR #842 稳定合并 · Validator 通过 · 释放赏金 ¥12,000',
    terms: ['Proof-carrying Execution', 'DID / VC', 'Receipt Root'],
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

const graphNodeById = new Map(graphNodes.map((node) => [node.id, node]));

const participantFilters: Array<[ParticipantFilter, string]> = [
  ['all', '全部'],
  ['institution', '机构'],
  ['enterprise', '企业'],
  ['individual', '个人'],
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
  const [selectedId, setSelectedId] = useState('geo');
  const [filter, setFilter] = useState<ParticipantFilter>('all');
  const [yaw, setYaw] = useState(-12);
  const [pitch, setPitch] = useState(10);
  const dragRef = useRef<{ x: number; y: number; yaw: number; pitch: number; moved: boolean } | null>(null);
  const selectedIndex = scenarios.findIndex((scenario) => scenario.id === selectedId);
  const selected = scenarios[selectedIndex] ?? scenarios[0];
  const visibleScenarios = filter === 'all' ? scenarios : scenarios.filter((scenario) => scenario.participant === filter);
  const journeySteps: Array<[string, string, string, IconName, string, string]> = [
    ['01', '部署规则', selected.delegator, 'fingerprint', '谁授权、允许做什么、何时算完成都在执行前冻结，Worker 和 Validator 引用同一版本。', '链上记录：意图摘要、调用方签名、策略版本、预算与 nonce。'],
    ['02', 'Worker 执行', selected.provider, 'terminal', 'Worker 在 a3s-box 中按授权调用工具或模型，产出结果承诺和带签名的执行回执。', `验收输入：${selected.evidence}。`],
    ['03', 'Validator 核验', selected.evidence, 'eye', `Validator 独立检查业务谓词：${selected.predicate}。`, '失败时不推进合约状态，并把拒绝原因写入可追溯回执。'],
    ['04', '链上记账', selected.finality, 'chain', '回执、证明和终局条件通过后，共识节点只提交确定性状态变化。', `最终结果：${selected.finality}。`],
  ];

  const projected = useMemo(() => {
    const entries = graphNodes.map((node) => [node.id, project(node.point, yaw, pitch)] as const);
    return new Map(entries);
  }, [yaw, pitch]);

  const selectRelative = (delta: number) => {
    const next = (selectedIndex + delta + scenarios.length) % scenarios.length;
    setSelectedId(scenarios[next].id);
  };

  const selectFilter = (nextFilter: ParticipantFilter) => {
    setFilter(nextFilter);
    if (nextFilter !== 'all' && selected.participant !== nextFilter) {
      const firstMatch = scenarios.find((scenario) => scenario.participant === nextFilter);
      if (firstMatch) setSelectedId(firstMatch.id);
    }
  };

  return (
    <div className="scenario-explorer">
      <header className="scenario-toolbar">
        <div>
          <span><i /> 运行中的 ACVM 应用网络</span>
          <strong>当前显示 {visibleScenarios.length} 个合约 · 全网共 {scenarios.length} 个</strong>
        </div>
        <nav aria-label="按部署者类型筛选应用场景">
          {participantFilters.map(([value, label]) => {
            const count = value === 'all' ? scenarios.length : scenarios.filter((scenario) => scenario.participant === value).length;
            return (
              <button
                type="button"
                className={filter === value ? 'is-active' : ''}
                aria-pressed={filter === value}
                onClick={() => selectFilter(value)}
                key={value}
              >
                {label}<small>{count}</small>
              </button>
            );
          })}
        </nav>
      </header>

      <div className="scenario-workspace">
        <section className="scenario-map-column" aria-label="ACVM 合约部署网络与场景列表">
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
            <header>
              <code>3D DEPLOYMENT GRAPH</code>
              <div><span><i /> 拖动查看</span><button type="button" onClick={() => { setYaw(-12); setPitch(10); }}>视角归位</button></div>
            </header>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <ellipse cx="50" cy="50" rx="38" ry="24" />
              <ellipse cx="50" cy="50" rx="25" ry="39" transform="rotate(58 50 50)" />
              {graphLinks.map(([sourceId, targetId]) => {
                const source = projected.get(sourceId)!;
                const target = projected.get(targetId)!;
                const targetNode = graphNodeById.get(targetId);
                const active = targetId === `contract-${selected.id}`;
                const dimmed = filter !== 'all' && targetNode?.participant !== filter;
                return <line className={`${active ? 'is-active' : ''} ${dimmed ? 'is-dimmed' : ''}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} key={`${sourceId}-${targetId}`} />;
              })}
            </svg>
            {graphNodes.map((node) => {
              const point = projected.get(node.id)!;
              const active = node.scenario?.id === selected.id;
              const dimmed = filter !== 'all' && node.participant && node.participant !== filter;
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
                    className={`graph-node graph-node--contract graph-node--${node.participant} ${active ? 'is-active' : ''} ${dimmed ? 'is-dimmed' : ''}`}
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
                <div className={`graph-node graph-node--${node.kind} ${node.participant ? `graph-node--${node.participant}` : ''} ${dimmed ? 'is-dimmed' : ''}`} style={style} key={node.id}>
                  {node.kind === 'core' ? <Icon name="terminal" /> : null}
                  <strong>{node.label}</strong>
                </div>
              );
            })}
            <footer>
              <span className="is-institution">机构</span>
              <span className="is-enterprise">企业</span>
              <span className="is-individual">个人</span>
              <strong>拖动网络 · 点选合约</strong>
            </footer>
          </div>

          <nav className="scenario-picker" aria-label="选择 Agentic Contract 应用场景">
            {visibleScenarios.map((scenario) => (
              <button
                type="button"
                className={scenario.id === selected.id ? 'is-active' : ''}
                aria-pressed={scenario.id === selected.id}
                onClick={() => setSelectedId(scenario.id)}
                key={scenario.id}
              >
                <span>{String(scenarios.indexOf(scenario) + 1).padStart(2, '0')}</span>
                <strong>{scenario.title}</strong>
                <small>{scenario.contract}</small>
              </button>
            ))}
          </nav>
        </section>

        <article className={`scenario-detail scenario-detail--${selected.industry}`} key={selected.id}>
          <header>
            <div className="scenario-detail-meta">
              <span>{String(selectedIndex + 1).padStart(2, '0')} / {String(scenarios.length).padStart(2, '0')}</span>
              <b>{participantMeta[selected.participant].label}</b>
            </div>
            <div className="scenario-detail-nav">
              <button type="button" onClick={() => selectRelative(-1)} aria-label="上一个场景">←</button>
              <button type="button" onClick={() => selectRelative(1)} aria-label="下一个场景">→</button>
            </div>
            <h3>{selected.title}</h3>
            <p>{selected.thesis}</p>
            <dl className="contract-deployment">
              <div><dt>部署者</dt><dd>{selected.deployer}</dd></div>
              <div><dt>Agentic Contract</dt><dd>{selected.contract}</dd></div>
            </dl>
          </header>
          <div className="scenario-steps" aria-label={`${selected.title}端到端业务流程`}>
            {journeySteps.map(([code, label, detail, icon, explanation, boundary], index) => (
              <section style={{ '--step-index': index } as React.CSSProperties} key={code}>
                <span><Icon name={icon} /></span>
                <p>
                  <DetailHint
                    className="scenario-step-hint"
                    category="场景执行细节"
                    label={<><small>{code} · {label}</small><strong>{detail}</strong></>}
                    title={`${selected.title} · ${label}`}
                    summary={explanation}
                    details={[{ label: '链上处理', value: boundary }]}
                  />
                </p>
              </section>
            ))}
          </div>
          <footer>
            <span><i /> 已验证并写入链上</span>
            <div>{selected.terms.slice(0, 2).map((term) => <TechTerm term={term} key={term} />)}</div>
          </footer>
        </article>
      </div>
    </div>
  );
}
