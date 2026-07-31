import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from './Icons';
import { TechTerm, type TechKey } from './TechTerm';

type Industry = 'business' | 'government' | 'manufacturing' | 'finance' | 'education';
type PatternKind = 'outcome' | 'threshold' | 'privacy' | 'longrun';
type EntityKind = 'actor' | 'fact' | 'compute' | 'control' | 'proof';
type RelationKind = 'delegates' | 'observes' | 'controls' | 'proves' | 'settles';

type ScenarioEntity = {
  id: string;
  label: string;
  kind: EntityKind;
  detail: string;
  core?: boolean;
};

type ScenarioRelation = {
  source: string;
  target: string;
  kind: RelationKind;
};

type Scenario = {
  id: string;
  index: string;
  industry: Industry;
  pattern: PatternKind;
  title: string;
  thesis: string;
  predicate: string;
  finality: string;
  terms: TechKey[];
  entities: ScenarioEntity[];
  relations: ScenarioRelation[];
};

const entity = (
  id: string,
  label: string,
  kind: EntityKind,
  detail: string,
  core = false,
): ScenarioEntity => ({ id, label, kind, detail, core });

const relation = (source: string, target: string, kind: RelationKind): ScenarioRelation => ({
  source,
  target,
  kind,
});

const scenarios: Scenario[] = [
  {
    id: 'ads',
    index: '01',
    industry: 'business',
    pattern: 'outcome',
    title: '广告按效果结算',
    thesis: '有效转化完成交叉核验后，推广预算才进入渠道账户。',
    predicate: '已支付订单 ∧ 归因窗口 ≤ 7 天 ∧ 无效流量 < 5%',
    finality: '2,184 个有效转化 · 渠道结算 ¥68,400',
    terms: ['zkTLS / TLSNotary', 'Receipt Root'],
    entities: [
      entity('acvm', 'ACVM', 'compute', '执行转化验收谓词，聚合回执并生成结算状态。', true),
      entity('advertiser', '广告主', 'actor', '签名发布预算、归因窗口和有效转化口径。'),
      entity('channel', '推广渠道', 'actor', '执行投放并提交本期结算请求。'),
      entity('adlog', '广告平台', 'fact', '出具曝光、点击与渠道签名日志。'),
      entity('attribution', '独立归因', 'fact', '使用独立设备图谱计算转化归属。'),
      entity('crm', 'CRM 订单', 'fact', '证明订单已支付、未退款且属于本期活动。'),
      entity('oracle', '企业预言机', 'control', '校验三方数据来源、签名和时间窗口。'),
      entity('sentry', 'AnySentry', 'control', '阻断指标回写、越权导出和账户替换。'),
      entity('ledger', '联盟链结算', 'proof', '验证回执根并确认广告主、渠道与审计终局。'),
    ],
    relations: [
      relation('advertiser', 'acvm', 'delegates'),
      relation('channel', 'acvm', 'delegates'),
      relation('channel', 'adlog', 'observes'),
      relation('adlog', 'oracle', 'proves'),
      relation('attribution', 'oracle', 'proves'),
      relation('crm', 'oracle', 'proves'),
      relation('oracle', 'acvm', 'proves'),
      relation('sentry', 'acvm', 'controls'),
      relation('adlog', 'attribution', 'observes'),
      relation('crm', 'attribution', 'observes'),
      relation('acvm', 'ledger', 'proves'),
      relation('ledger', 'channel', 'settles'),
    ],
  },
  {
    id: 'gov-subsidy',
    index: '02',
    industry: 'government',
    pattern: 'privacy',
    title: '惠企补贴核验拨付',
    thesis: '跨部门只交换资格证明，不交换企业完整经营台账。',
    predicate: '主体有效 ∧ 投资达标 ∧ 新增就业达标 ∧ 未重复申领',
    finality: '财政与主管部门共同确认 · 拨付 ¥800,000',
    terms: ['Selective Disclosure', 'TEE', 'FROST'],
    entities: [
      entity('acvm', 'ACVM', 'compute', '组合补贴资格谓词、授权范围和财政拨付状态。', true),
      entity('agency', '主管部门', 'actor', '发布专项条件、绩效指标和资金上限。'),
      entity('company', '申报企业', 'actor', '提交身份承诺和本次补贴申请。'),
      entity('tax', '税务域', 'fact', '在本部门保留纳税和经营明细。'),
      entity('employment', '人社域', 'fact', '在本部门保留用工和就业记录。'),
      entity('project', '项目监管', 'fact', '证明投资发票、设备验收与项目进度。'),
      entity('privacy', 'a3s-box / power', 'compute', '在隔离环境中关联数据并输出资格结论。'),
      entity('gateway', '政务零信任网关', 'control', '限制查询目的、字段范围、有效期和调用主体。'),
      entity('zk', '资格证明', 'proof', '证明企业满足条件且没有泄露原始台账。'),
      entity('treasury', '财政节点', 'actor', '门限确认后向备案企业账户拨付专项资金。'),
    ],
    relations: [
      relation('agency', 'acvm', 'delegates'),
      relation('company', 'acvm', 'delegates'),
      relation('tax', 'gateway', 'observes'),
      relation('employment', 'gateway', 'observes'),
      relation('project', 'gateway', 'observes'),
      relation('gateway', 'privacy', 'controls'),
      relation('privacy', 'zk', 'proves'),
      relation('zk', 'acvm', 'proves'),
      relation('acvm', 'treasury', 'controls'),
      relation('treasury', 'company', 'settles'),
      relation('agency', 'treasury', 'controls'),
    ],
  },
  {
    id: 'factory-quality',
    index: '03',
    industry: 'manufacturing',
    pattern: 'threshold',
    title: '生产批次质量结算',
    thesis: '工艺、设备、质检和实验室证据闭合后，整批货款才放行。',
    predicate: '批次谱系完整 ∧ 良率 ≥ 99% ∧ 关键尺寸合格',
    finality: '批次 MF71-06 合格 · 供应商结算 ¥1,460,000',
    terms: ['DID / VC', 'Remote Attestation', 'Receipt Root'],
    entities: [
      entity('acvm', 'ACVM', 'compute', '校验批次谱系、质量阈值和多方验收签名。', true),
      entity('oem', '整机制造商', 'actor', '冻结批次标准、工艺窗口和结算规则。'),
      entity('supplier', '零部件供应商', 'actor', '按冻结工艺生产并提交批次验收。'),
      entity('mes', 'MES', 'fact', '记录设备、配方、工序和在制品谱系。'),
      entity('qms', 'QMS', 'fact', '出具全检、抽检和不合格处置记录。'),
      entity('lab', '独立实验室', 'fact', '签署材料与关键尺寸检测报告。'),
      entity('sensor', '产线传感器', 'fact', '以设备身份连续签名工艺参数。'),
      entity('oracle', '工业预言机', 'control', '验证设备证书、批次号和记录时间。'),
      entity('sentry', 'AnySentry', 'control', '识别检测补录、批次替换和异常放行。'),
      entity('ledger', '质量联盟链', 'proof', '制造商、供应商与质量节点共同确认批次终局。'),
    ],
    relations: [
      relation('oem', 'acvm', 'delegates'),
      relation('supplier', 'mes', 'observes'),
      relation('mes', 'oracle', 'proves'),
      relation('qms', 'oracle', 'proves'),
      relation('lab', 'oracle', 'proves'),
      relation('sensor', 'mes', 'observes'),
      relation('sensor', 'oracle', 'proves'),
      relation('oracle', 'acvm', 'proves'),
      relation('sentry', 'acvm', 'controls'),
      relation('acvm', 'ledger', 'proves'),
      relation('ledger', 'supplier', 'settles'),
    ],
  },
  {
    id: 'finance-credit',
    index: '04',
    industry: 'finance',
    pattern: 'privacy',
    title: '供应链融资按履约放款',
    thesis: '真实贸易、货物交付和未重复质押同时成立，融资才分段释放。',
    predicate: '订单真实 ∧ 已交付 ∧ 发票有效 ∧ 应收账款未质押',
    finality: '贸易背景通过 · 向供应商分段放款 ¥5,000,000',
    terms: ['TEE', 'Selective Disclosure', 'Remote Attestation'],
    entities: [
      entity('acvm', 'ACVM', 'compute', '管理授信状态、履约检查点和分段放款条件。', true),
      entity('bank', '金融机构', 'actor', '签名发布授信上限、风险规则和放款节点。'),
      entity('supplier', '融资供应商', 'actor', '履行订单并提交应收账款融资请求。'),
      entity('anchor', '核心企业', 'fact', '证明采购订单、收货和应付账款。'),
      entity('logistics', '物流平台', 'fact', '证明货物轨迹与真实签收。'),
      entity('invoice', '电子票据', 'fact', '证明发票主体、金额和状态。'),
      entity('registry', '质押登记', 'fact', '证明应收账款未被重复融资。'),
      entity('risk', 'a3s-power', 'compute', '在隔离环境中执行私密风险模型。'),
      entity('sentry', 'AnySentry', 'control', '阻断重复质押、关联账户替换和批量越权查询。'),
      entity('ledger', '金融联盟链', 'proof', '金融机构、核心企业与审计节点确认放款终局。'),
    ],
    relations: [
      relation('bank', 'acvm', 'delegates'),
      relation('supplier', 'acvm', 'delegates'),
      relation('anchor', 'risk', 'observes'),
      relation('logistics', 'risk', 'observes'),
      relation('invoice', 'risk', 'observes'),
      relation('registry', 'risk', 'observes'),
      relation('risk', 'acvm', 'proves'),
      relation('sentry', 'risk', 'controls'),
      relation('sentry', 'acvm', 'controls'),
      relation('acvm', 'ledger', 'proves'),
      relation('ledger', 'supplier', 'settles'),
    ],
  },
  {
    id: 'education-research',
    index: '05',
    industry: 'education',
    pattern: 'longrun',
    title: '科研项目按里程碑拨款',
    thesis: '数月实验过程持续形成状态承诺，阶段成果可被压缩验证。',
    predicate: '成果版本连续 ∧ 伦理审批有效 ∧ 设备记录匹配任务书',
    finality: '第二阶段完成证明有效 · 拨付科研经费 ¥1,200,000',
    terms: ['IVC', 'Folding', 'Recursive ZK'],
    entities: [
      entity('acvm', 'ACVM', 'compute', '调度长期科研任务、恢复检查点并推进里程碑状态。', true),
      entity('funder', '资助单位', 'actor', '签名发布任务书、里程碑和拨款条件。'),
      entity('team', '科研团队 Agent', 'actor', '持续执行实验、分析和成果交付。'),
      entity('repo', '科研仓库', 'fact', '保存实验记录、代码和成果版本承诺。'),
      entity('ethics', '伦理审查', 'control', '签署研究范围、样本与审批有效期。'),
      entity('equipment', '设备平台', 'fact', '记录仪器身份、运行时段和实验参数。'),
      entity('approval', '人工审批', 'control', '在高风险节点暂停并签署继续执行。'),
      entity('state', '里程碑状态根', 'proof', '将成果、审批和工具回执绑定为连续状态。'),
      entity('folding', 'IVC / Folding', 'proof', '把每个阶段的正确性折叠进持续更新的证明。'),
      entity('ledger', '科研资金链', 'proof', '验证递归完成证明并确认阶段拨款终局。'),
    ],
    relations: [
      relation('funder', 'acvm', 'delegates'),
      relation('acvm', 'team', 'delegates'),
      relation('team', 'repo', 'observes'),
      relation('team', 'equipment', 'observes'),
      relation('ethics', 'team', 'controls'),
      relation('approval', 'acvm', 'controls'),
      relation('repo', 'state', 'proves'),
      relation('equipment', 'state', 'proves'),
      relation('state', 'folding', 'proves'),
      relation('folding', 'acvm', 'proves'),
      relation('acvm', 'ledger', 'proves'),
      relation('ledger', 'team', 'settles'),
    ],
  },
  {
    id: 'sla',
    index: '06',
    industry: 'business',
    pattern: 'outcome',
    title: '软件 SLA 自动结算',
    thesis: '服务商监控、客户探针与工单共同还原故障，再计算服务费。',
    predicate: '监控连续 ∧ 故障归因一致 ∧ 排除已批准维护窗口',
    finality: '可用率 99.82% · 扣减 ¥2,400 · 结算 ¥29,600',
    terms: ['zkTLS / TLSNotary', 'Proof-carrying Execution'],
    entities: [
      entity('acvm', 'ACVM', 'compute', '对齐事件时间线，执行 SLA 公式并生成账单状态。', true),
      entity('customer', '企业客户', 'actor', '约定可用率、维护窗口和扣费阶梯。'),
      entity('provider', '软件服务商', 'actor', '持续供服并提交月度结算。'),
      entity('metrics', '服务监控', 'fact', '记录指标、告警和服务端故障。'),
      entity('probe', '客户独立探针', 'fact', '从客户侧记录不可用时段。'),
      entity('ticket', '故障工单', 'fact', '记录责任归属、修复和维护审批。'),
      entity('oracle', 'SLA 预言机', 'control', '验证覆盖率、时间戳和指标源稳定性。'),
      entity('sentry', 'AnySentry', 'control', '识别监控缺口、时间回写和账单改写。'),
      entity('ledger', '服务结算链', 'proof', '客户、服务商与审计节点共同确认月度终局。'),
    ],
    relations: [
      relation('customer', 'acvm', 'delegates'),
      relation('provider', 'metrics', 'observes'),
      relation('metrics', 'oracle', 'proves'),
      relation('probe', 'oracle', 'proves'),
      relation('ticket', 'oracle', 'proves'),
      relation('metrics', 'ticket', 'observes'),
      relation('probe', 'ticket', 'observes'),
      relation('oracle', 'acvm', 'proves'),
      relation('sentry', 'acvm', 'controls'),
      relation('acvm', 'ledger', 'proves'),
      relation('ledger', 'provider', 'settles'),
    ],
  },
  {
    id: 'gov-project',
    index: '07',
    industry: 'government',
    pattern: 'threshold',
    title: '政府工程进度款',
    thesis: 'BIM、现场影像、监理签章和发票共同证明本期工程量。',
    predicate: 'BIM 工程量 = 现场完成度 ∧ 监理签章有效 ∧ 发票一致',
    finality: '本期完成 32.4% · 四方门限确认 · 支付 ¥3,200,000',
    terms: ['DID / VC', 'FROST', 'Receipt Root'],
    entities: [
      entity('acvm', 'ACVM', 'compute', '校验工程批次、计量规则和多方付款授权。', true),
      entity('owner', '建设单位', 'actor', '冻结工程清单、付款节点和本期上限。'),
      entity('contractor', '承建方', 'actor', '完成施工并申报本期工程量。'),
      entity('bim', 'BIM 平台', 'fact', '提供冻结版本、构件状态和工程量。'),
      entity('supervisor', '监理单位', 'control', '以机构身份签署测量和验收意见。'),
      entity('imagery', '现场影像', 'fact', '提供带定位、时间和设备签名的进度事实。'),
      entity('invoice', '电子发票', 'fact', '证明票据主体、金额与工程批次。'),
      entity('sentry', 'AnySentry', 'control', '阻断重复计量、影像复用和账户替换。'),
      entity('threshold', '门限确认', 'proof', '建设、监理、财政与审计达到约定签名门限。'),
      entity('treasury', '财政支付', 'actor', '按有效工程证明向承建方备案账户付款。'),
    ],
    relations: [
      relation('owner', 'acvm', 'delegates'),
      relation('contractor', 'bim', 'observes'),
      relation('bim', 'acvm', 'proves'),
      relation('imagery', 'supervisor', 'proves'),
      relation('supervisor', 'acvm', 'proves'),
      relation('invoice', 'acvm', 'proves'),
      relation('sentry', 'acvm', 'controls'),
      relation('owner', 'threshold', 'delegates'),
      relation('supervisor', 'threshold', 'delegates'),
      relation('acvm', 'threshold', 'proves'),
      relation('threshold', 'treasury', 'controls'),
      relation('treasury', 'contractor', 'settles'),
    ],
  },
  {
    id: 'supply',
    index: '08',
    industry: 'manufacturing',
    pattern: 'threshold',
    title: '供应链验收付款',
    thesis: '交付数量、运输状态、仓储签收和抽检结果按同一批次闭合。',
    predicate: '足量签收 ∧ 温控无越界 ∧ 抽检合格 ∧ 批次未替换',
    finality: '12,000 件通过验收 · 供应商结算 ¥252,000',
    terms: ['DID / VC', 'FROST', 'Receipt Root'],
    entities: [
      entity('acvm', 'ACVM', 'compute', '执行采购验收规则并管理拒收、折价与全额付款分支。', true),
      entity('buyer', '采购企业', 'actor', '发布订单、批次标准和付款条件。'),
      entity('supplier', '供应商', 'actor', '生产发货并申请验收。'),
      entity('logistics', '物流平台', 'fact', '签署运单、轨迹和交接事件。'),
      entity('sensor', '温控设备', 'fact', '以设备证书连续签名运输温度。'),
      entity('warehouse', '采购仓库', 'fact', '签署到货数量、批次和收货时间。'),
      entity('quality', '质检机构', 'fact', '签署抽检样本和质量结果。'),
      entity('oracle', '工业预言机', 'control', '对齐运单、设备、签收和质检批次。'),
      entity('sentry', 'AnySentry', 'control', '识别数据补录、设备失效和批次号替换。'),
      entity('ledger', '供应链节点', 'proof', '采购、供应、物流与审计共同确认验收终局。'),
    ],
    relations: [
      relation('buyer', 'acvm', 'delegates'),
      relation('supplier', 'logistics', 'observes'),
      relation('logistics', 'oracle', 'proves'),
      relation('sensor', 'oracle', 'proves'),
      relation('warehouse', 'oracle', 'proves'),
      relation('quality', 'oracle', 'proves'),
      relation('oracle', 'acvm', 'proves'),
      relation('sentry', 'acvm', 'controls'),
      relation('warehouse', 'quality', 'observes'),
      relation('acvm', 'ledger', 'proves'),
      relation('ledger', 'supplier', 'settles'),
    ],
  },
  {
    id: 'factory-energy',
    index: '09',
    industry: 'manufacturing',
    pattern: 'outcome',
    title: '节能改造按效果付费',
    thesis: '在隐私域内归一化产量与工况，只按可复验的真实节能量付款。',
    predicate: '计量连续 ∧ 基线版本固定 ∧ 工况归一化 ∧ 节能率达标',
    finality: '确认节能率 12.6% · 服务商结算 ¥386,000',
    terms: ['TEE', 'Remote Attestation', 'Proof-carrying Execution'],
    entities: [
      entity('acvm', 'ACVM', 'compute', '锁定基线版本、验收周期和效果付款规则。', true),
      entity('factory', '生产企业', 'actor', '发布节能目标并授权最小化数据访问。'),
      entity('esco', '节能服务商', 'actor', '实施改造并持续运营节能设备。'),
      entity('meter', '智能电表', 'fact', '以设备身份签名能耗曲线。'),
      entity('mes', 'MES 工况', 'fact', '提供产量、班次与设备运行状态。'),
      entity('baseline', 'a3s-power', 'compute', '在隔离环境中归一化工况并计算节能基线。'),
      entity('attestation', '硬件度量', 'proof', '证明固定模型在可信硬件中处理本期数据。'),
      entity('sentry', 'AnySentry', 'control', '识别电表离线、历史回写和基线漂移。'),
      entity('ledger', '能源结算链', 'proof', '企业、服务商和审计节点确认节能效果终局。'),
    ],
    relations: [
      relation('factory', 'acvm', 'delegates'),
      relation('esco', 'meter', 'observes'),
      relation('meter', 'baseline', 'observes'),
      relation('mes', 'baseline', 'observes'),
      relation('sentry', 'baseline', 'controls'),
      relation('baseline', 'attestation', 'proves'),
      relation('attestation', 'acvm', 'proves'),
      relation('sentry', 'acvm', 'controls'),
      relation('acvm', 'ledger', 'proves'),
      relation('ledger', 'esco', 'settles'),
    ],
  },
  {
    id: 'finance-insurance',
    index: '10',
    industry: 'finance',
    pattern: 'privacy',
    title: '货运保险核验赔付',
    thesis: '保单、运输轨迹、事故影像与定损模型共同证明责任和损失区间。',
    predicate: '事故在承保期 ∧ 轨迹连续 ∧ 影像未复用 ∧ 定损符合条款',
    finality: '事故责任成立 · 向被保险企业赔付 ¥128,000',
    terms: ['TEE', 'Selective Disclosure', 'Remote Attestation'],
    entities: [
      entity('acvm', 'ACVM', 'compute', '执行保单条款、反欺诈规则和赔付状态机。', true),
      entity('insurer', '保险机构', 'actor', '签名发布承保范围与理赔规则。'),
      entity('insured', '被保险企业', 'actor', '发起报案并提供最小必要凭证。'),
      entity('policy', '保单系统', 'fact', '证明承保主体、货物和有效期限。'),
      entity('tracking', '物流轨迹', 'fact', '证明运输路线、时间与交接连续性。'),
      entity('imagery', '查勘影像', 'fact', '以设备、位置和时间签名事故现场。'),
      entity('assessment', 'a3s-power', 'compute', '在隔离环境中比对条款并计算损失区间。'),
      entity('sentry', 'AnySentry', 'control', '识别重复报案、旧影像复用和账户变更。'),
      entity('ledger', '保险理赔链', 'proof', '保险、被保险企业与审计节点确认理赔终局。'),
    ],
    relations: [
      relation('insurer', 'acvm', 'delegates'),
      relation('insured', 'acvm', 'delegates'),
      relation('policy', 'assessment', 'observes'),
      relation('tracking', 'assessment', 'observes'),
      relation('imagery', 'assessment', 'observes'),
      relation('sentry', 'assessment', 'controls'),
      relation('assessment', 'acvm', 'proves'),
      relation('sentry', 'acvm', 'controls'),
      relation('acvm', 'ledger', 'proves'),
      relation('ledger', 'insured', 'settles'),
    ],
  },
  {
    id: 'education-training',
    index: '11',
    industry: 'education',
    pattern: 'outcome',
    title: '职业培训按就业成效结算',
    thesis: '学习、考试与稳定就业形成同一人的连续匿名证明。',
    predicate: '本人学习 ∧ 考核通过 ∧ 稳定就业 ≥ 约定周期',
    finality: '121 人达到就业成效 · 培训机构结算 ¥420,000',
    terms: ['Selective Disclosure', 'DID / VC', 'Receipt Root'],
    entities: [
      entity('acvm', 'ACVM', 'compute', '执行培训成效规则并聚合匿名学员证明。', true),
      entity('bureau', '就业服务部门', 'actor', '发布培训目标、成效周期和资金规则。'),
      entity('school', '培训机构', 'actor', '组织教学、考试与就业服务。'),
      entity('lms', '教学平台', 'fact', '记录本人学习、作业和课程完成。'),
      entity('exam', '考试机构', 'fact', '签署考生身份与考核结果。'),
      entity('employment', '人社就业记录', 'fact', '证明就业主体与稳定周期。'),
      entity('privacy', '隐私匹配', 'compute', '以匿名标识关联学习、考试和就业事件。'),
      entity('sentry', 'AnySentry', 'control', '识别代刷考勤、证书复用和短期挂靠。'),
      entity('ledger', '公共就业链', 'proof', '就业部门、培训机构与审计节点确认成效终局。'),
    ],
    relations: [
      relation('bureau', 'acvm', 'delegates'),
      relation('school', 'lms', 'observes'),
      relation('lms', 'privacy', 'observes'),
      relation('exam', 'privacy', 'observes'),
      relation('employment', 'privacy', 'observes'),
      relation('sentry', 'privacy', 'controls'),
      relation('privacy', 'acvm', 'proves'),
      relation('sentry', 'acvm', 'controls'),
      relation('acvm', 'ledger', 'proves'),
      relation('ledger', 'school', 'settles'),
    ],
  },
  {
    id: 'royalty',
    index: '12',
    industry: 'business',
    pattern: 'outcome',
    title: '内容使用自动分成',
    thesis: '播放、订阅、订单和反作弊事件闭合后，再向权利人分成。',
    predicate: '已付费 ∧ 未退款 ∧ 使用去重 ∧ 反作弊通过',
    finality: '46,900 次有效使用 · 创作者分成 ¥18,760',
    terms: ['DID / VC', 'Receipt Root', 'Proof-carrying Execution'],
    entities: [
      entity('acvm', 'ACVM', 'compute', '绑定作品授权、有效使用谓词和分成状态。', true),
      entity('platform', '内容平台', 'actor', '发布费率、账期并登记作品授权。'),
      entity('creator', '内容创作者', 'actor', '以可验证身份授权作品并接收分成。'),
      entity('play', '播放系统', 'fact', '签署播放会话与设备匿名标识。'),
      entity('subscription', '订阅系统', 'fact', '证明用户订阅关系与有效期。'),
      entity('orders', '支付订单', 'fact', '证明订单已支付且未退款。'),
      entity('fraud', '反作弊模型', 'compute', '去重使用记录并识别刷量集群。'),
      entity('sentry', 'AnySentry', 'control', '阻断重复结算和权利人账户替换。'),
      entity('ledger', '版权分成链', 'proof', '平台、创作者与审计节点确认账期终局。'),
    ],
    relations: [
      relation('platform', 'acvm', 'delegates'),
      relation('creator', 'acvm', 'delegates'),
      relation('play', 'fraud', 'observes'),
      relation('subscription', 'fraud', 'observes'),
      relation('orders', 'fraud', 'observes'),
      relation('fraud', 'acvm', 'proves'),
      relation('sentry', 'fraud', 'controls'),
      relation('sentry', 'acvm', 'controls'),
      relation('acvm', 'ledger', 'proves'),
      relation('ledger', 'creator', 'settles'),
    ],
  },
];

const industryMeta: Record<Industry, { label: string; english: string; description: string }> = {
  business: {
    label: '商业',
    english: 'BUSINESS',
    description: '结果计量、服务结算与数字内容分成。',
  },
  government: {
    label: '政务',
    english: 'GOVERNMENT',
    description: '跨部门资格核验、门限授权与财政拨付。',
  },
  manufacturing: {
    label: '制造',
    english: 'MANUFACTURING',
    description: '设备事实、批次谱系、质量验收与效果付费。',
  },
  finance: {
    label: '金融',
    english: 'FINANCE',
    description: '隐私风控、真实贸易、保险责任与资金终局。',
  },
  education: {
    label: '教育',
    english: 'EDUCATION',
    description: '匿名成效核验与长期科研里程碑证明。',
  },
};

const patternMeta: Record<PatternKind, { code: string; label: string; english: string; description: string }> = {
  outcome: {
    code: 'P01',
    label: '结果结算',
    english: 'OUTCOME SETTLEMENT',
    description: '可验证结果成立后释放资金或权益。',
  },
  threshold: {
    code: 'P02',
    label: '多方验收',
    english: 'MULTI-PARTY ACCEPTANCE',
    description: '责任主体达到约定门限后推进敏感状态。',
  },
  privacy: {
    code: 'P03',
    label: '隐私核验',
    english: 'PRIVATE ELIGIBILITY',
    description: '原始数据留在隐私域，只验证资格和区间证明。',
  },
  longrun: {
    code: 'P04',
    label: '长期证明',
    english: 'LONG-RUN PROOF',
    description: '连续状态承诺最终折叠为固定大小的完成证明。',
  },
};

const entityKindLabel: Record<EntityKind, string> = {
  actor: '责任主体',
  fact: '事实节点',
  compute: '计算节点',
  control: '控制节点',
  proof: '证明节点',
};

const relationKindLabel: Record<RelationKind, string> = {
  delegates: '委托/申报',
  observes: '取证',
  controls: '控制',
  proves: '证明',
  settles: '结算',
};

const describeRelation = (kind: RelationKind, source: string, target: string) => {
  if (kind === 'delegates') return `${source}提交委托或结果声明，${target}接收本次核验任务。`;
  if (kind === 'observes') return `${source}从${target}取得本次业务事实。`;
  if (kind === 'controls') return `${source}对${target}施加运行时策略与安全控制。`;
  if (kind === 'proves') return `${source}向${target}提交可验证证据。`;
  return `${source}依据验证终局向${target}执行结算。`;
};

type UniverseNodeKind = 'core' | 'industry' | 'pattern' | 'scenario';

type UniverseNode = {
  id: string;
  label: string;
  kind: UniverseNodeKind;
  position: readonly [number, number, number];
  industry?: Industry;
  pattern?: PatternKind;
  scenario?: Scenario;
};

type UniverseEdge = {
  source: string;
  target: string;
  kind: 'executes' | 'contains' | 'governs';
};

const industryOrder: Industry[] = ['business', 'government', 'manufacturing', 'finance', 'education'];
const patternOrder: PatternKind[] = ['outcome', 'threshold', 'privacy', 'longrun'];
const goldenAngle = Math.PI * (3 - Math.sqrt(5));

const universeNodes: UniverseNode[] = [
  { id: 'acvm-root', label: 'ACVM', kind: 'core', position: [0, 0, 0] },
  ...industryOrder.map((industry, index) => ({
    id: `industry-${industry}`,
    label: industryMeta[industry].label,
    kind: 'industry' as const,
    industry,
    position: [
      Math.cos(-Math.PI / 2 + (index / industryOrder.length) * Math.PI * 2) * 0.52,
      Math.sin(-Math.PI / 2 + (index / industryOrder.length) * Math.PI * 2) * 0.4,
      Math.sin(index * 1.7) * 0.34,
    ] as const,
  })),
  ...patternOrder.map((pattern, index) => ({
    id: `pattern-${pattern}`,
    label: patternMeta[pattern].label,
    kind: 'pattern' as const,
    pattern,
    position: [
      Math.cos(-Math.PI / 4 + (index / patternOrder.length) * Math.PI * 2) * 0.3,
      Math.sin(-Math.PI / 4 + (index / patternOrder.length) * Math.PI * 2) * 0.26,
      Math.cos(index * 1.9) * 0.4,
    ] as const,
  })),
  ...scenarios.map((scenario, index) => {
    const y = 1 - ((index + 0.5) / scenarios.length) * 2;
    const radial = Math.sqrt(1 - y * y);
    const theta = index * goldenAngle;
    return {
      id: `scenario-${scenario.id}`,
      label: scenario.title,
      kind: 'scenario' as const,
      scenario,
      industry: scenario.industry,
      pattern: scenario.pattern,
      position: [
        Math.cos(theta) * radial,
        y * 0.78,
        Math.sin(theta) * radial,
      ] as const,
    };
  }),
];

const universeEdges: UniverseEdge[] = [
  ...industryOrder.map((industry) => ({
    source: 'acvm-root',
    target: `industry-${industry}`,
    kind: 'executes' as const,
  })),
  ...patternOrder.map((pattern) => ({
    source: 'acvm-root',
    target: `pattern-${pattern}`,
    kind: 'executes' as const,
  })),
  ...scenarios.flatMap((scenario) => [
    {
      source: `industry-${scenario.industry}`,
      target: `scenario-${scenario.id}`,
      kind: 'contains' as const,
    },
    {
      source: `pattern-${scenario.pattern}`,
      target: `scenario-${scenario.id}`,
      kind: 'governs' as const,
    },
  ]),
];

type ProjectedUniverseNode = UniverseNode & {
  px: number;
  py: number;
  depth: number;
  scale: number;
  opacity: number;
};

type UniverseRotation = { x: number; y: number };

function projectUniversePoint(
  position: readonly [number, number, number],
  rotation: UniverseRotation,
) {
  const [x, y, z] = position;
  const cosY = Math.cos(rotation.y);
  const sinY = Math.sin(rotation.y);
  const cosX = Math.cos(rotation.x);
  const sinX = Math.sin(rotation.x);
  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;
  const y1 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;
  const perspective = 3.25 / (3.25 - z2);
  return {
    x: 380 + x1 * 258 * perspective,
    y: 206 + y1 * 202 * perspective,
    depth: z2,
    perspective,
  };
}

function universeOrbitPath(
  rotation: UniverseRotation,
  plane: 'equator' | 'vertical' | 'tilted',
) {
  const points = Array.from({ length: 65 }, (_, index) => {
    const angle = (index / 64) * Math.PI * 2;
    const point: readonly [number, number, number] = plane === 'equator'
      ? [Math.cos(angle), Math.sin(angle) * 0.78, 0]
      : plane === 'vertical'
        ? [Math.cos(angle), 0, Math.sin(angle)]
        : [Math.cos(angle) * 0.92, Math.sin(angle) * 0.5, Math.sin(angle) * 0.68];
    return projectUniversePoint(point, rotation);
  });
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ');
}

function ScenarioMiniature({ scenario }: { scenario: Scenario }) {
  const points = [
    [0, -6],
    [5.8, -2.2],
    [4.1, 5],
    [-3.8, 5.2],
    [-6, -1.4],
    [0, 0],
  ] as const;
  const sample = scenario.entities.filter((item) => !item.core).slice(0, 5);

  return (
    <g className="universe-miniature" aria-hidden="true">
      <circle className="universe-miniature-orbit" r="11.5" />
      {points.slice(0, 5).map(([x, y], index) => (
        <line key={`line-${index}`} x1={points[5][0]} y1={points[5][1]} x2={x} y2={y} />
      ))}
      <polyline points={points.slice(0, 5).map(([x, y]) => `${x},${y}`).join(' ')} />
      {sample.map((item, index) => (
        <circle
          key={item.id}
          className={`universe-miniature-node universe-miniature-node--${item.kind}`}
          cx={points[index][0]}
          cy={points[index][1]}
          r="1.55"
        />
      ))}
      <circle className="universe-miniature-core" r="2.3" />
    </g>
  );
}

function ExpandedScenarioGraph({ scenario }: { scenario: Scenario }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeRelationIndex, setActiveRelationIndex] = useState(0);
  const graphCanvasRef = useRef<HTMLDivElement>(null);
  const guidedRelation = hoveredId || selectedId
    ? null
    : scenario.relations[activeRelationIndex % scenario.relations.length];
  const focusId = hoveredId ?? selectedId ?? guidedRelation?.target ?? null;
  const detailId = focusId ?? 'acvm';

  useEffect(() => {
    setSelectedId(null);
    setHoveredId(null);
    setActiveRelationIndex(0);
  }, [scenario.id]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => {
      setActiveRelationIndex((index) => (index + 1) % scenario.relations.length);
    }, 1800);
    return () => window.clearInterval(timer);
  }, [scenario.id, scenario.relations.length]);

  const adjacency = useMemo(() => {
    const map = new Map(scenario.entities.map((item) => [item.id, new Set<string>()]));
    scenario.relations.forEach((item) => {
      map.get(item.source)?.add(item.target);
      map.get(item.target)?.add(item.source);
    });
    return map;
  }, [scenario]);

  const positioned = useMemo(() => {
    const controlledActorIds = new Set(
      scenario.relations
        .filter((item) => item.kind === 'controls')
        .map((item) => item.target)
        .filter((id) => scenario.entities.some((candidate) => candidate.id === id && candidate.kind === 'actor')),
    );
    const settlementExecutorIds = new Set(
      scenario.relations
        .filter((item) => item.kind === 'settles')
        .map((item) => item.source),
    );
    const finalActorIds = new Set(
      [...controlledActorIds].filter((id) => settlementExecutorIds.has(id)),
    );
    const columns = {
      actor: scenario.entities.filter((item) => item.kind === 'actor' && !finalActorIds.has(item.id)),
      fact: scenario.entities.filter((item) => item.kind === 'fact'),
      control: scenario.entities.filter(
        (item) => item.kind === 'control' || (item.kind === 'compute' && !item.core),
      ),
      core: scenario.entities.filter((item) => item.core),
      final: scenario.entities.filter(
        (item) => item.kind === 'proof' || (item.kind === 'actor' && finalActorIds.has(item.id)),
      ),
    };
    const columnById = new Map<string, keyof typeof columns>();
    (Object.keys(columns) as Array<keyof typeof columns>).forEach((column) => {
      columns[column].forEach((item) => columnById.set(item.id, column));
    });
    const columnX: Record<keyof typeof columns, number> = {
      actor: 68,
      fact: 198,
      control: 336,
      core: 462,
      final: 580,
    };
    const columnY = (column: keyof typeof columns, id: string) => {
      const list = columns[column];
      const index = list.findIndex((item) => item.id === id);
      if (list.length <= 1) return 152;
      const top = list.length >= 4 ? 57 : 72;
      const bottom = list.length >= 4 ? 253 : 232;
      return top + (index / (list.length - 1)) * (bottom - top);
    };

    return scenario.entities.map((item) => {
      const column = columnById.get(item.id) ?? 'control';
      const width = item.core
        ? 86
        : Math.min(116, Math.max(82, item.label.length * 8.5 + 30));
      const height = item.core ? 42 : 38;
      return {
        ...item,
        x: columnX[column],
        y: columnY(column, item.id),
        width,
        height,
      };
    });
  }, [scenario]);

  const byId = useMemo(() => new Map(positioned.map((item) => [item.id, item])), [positioned]);
  const detail = scenario.entities.find((item) => item.id === detailId) ?? scenario.entities[0];
  const neighbours = focusId ? adjacency.get(focusId) ?? new Set<string>() : new Set<string>();
  const detailRelations = scenario.relations
    .filter((item) => item.source === detail.id || item.target === detail.id)
    .slice(0, 2)
    .map((item) => {
      const source = scenario.entities.find((candidate) => candidate.id === item.source)?.label ?? item.source;
      const target = scenario.entities.find((candidate) => candidate.id === item.target)?.label ?? item.target;
      return `${source} —${relationKindLabel[item.kind]}→ ${target}`;
    });
  const guidedSource = guidedRelation
    ? scenario.entities.find((item) => item.id === guidedRelation.source)
    : null;
  const guidedTarget = guidedRelation
    ? scenario.entities.find((item) => item.id === guidedRelation.target)
    : null;

  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas || !guidedRelation || !window.matchMedia('(max-width: 960px)').matches) return;
    const source = byId.get(guidedRelation.source);
    const target = byId.get(guidedRelation.target);
    if (!source || !target) return;
    const focusX = (source.x + target.x) / 2;
    const left = Math.max(0, (focusX / 640) * canvas.scrollWidth - canvas.clientWidth / 2);
    canvas.scrollTo({
      left,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, [activeRelationIndex, byId, guidedRelation]);

  return (
    <div className="expanded-scenario-graph">
      <div className="expanded-scenario-canvas" ref={graphCanvasRef}>
        <svg
          viewBox="0 0 640 292"
          role="img"
          aria-label={`${scenario.title}参与方与证明关系`}
          onClick={() => setSelectedId(null)}
        >
        <defs>
          <marker id="expanded-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 8 4 0 8Z" />
          </marker>
        </defs>

        <g className="expanded-layers" aria-hidden="true">
          <line x1="132" y1="31" x2="132" y2="278" />
          <line x1="266" y1="31" x2="266" y2="278" />
          <line x1="402" y1="31" x2="402" y2="278" />
          <line x1="520" y1="31" x2="520" y2="278" />
          <text x="68" y="17" textAnchor="middle">委托 / 申报</text>
          <text x="198" y="17" textAnchor="middle">事实取证</text>
          <text x="336" y="17" textAnchor="middle">安全与隐私</text>
          <text x="462" y="17" textAnchor="middle">ACVM 核验</text>
          <text x="580" y="17" textAnchor="middle">证明 / 终局</text>
        </g>

        <g>
          {scenario.relations.map((item, index) => {
            const source = byId.get(item.source);
            const target = byId.get(item.target);
            if (!source || !target) return null;
            const connected = guidedRelation
              ? index === activeRelationIndex % scenario.relations.length
              : Boolean(focusId) && (item.source === focusId || item.target === focusId);
            const dimmed = guidedRelation
              ? !connected
              : Boolean(focusId) && !connected;
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const sourceScale = Math.min(
              dx === 0 ? Number.POSITIVE_INFINITY : (source.width / 2 + 3) / Math.abs(dx),
              dy === 0 ? Number.POSITIVE_INFINITY : (source.height / 2 + 3) / Math.abs(dy),
            );
            const targetScale = Math.min(
              dx === 0 ? Number.POSITIVE_INFINITY : (target.width / 2 + 3) / Math.abs(dx),
              dy === 0 ? Number.POSITIVE_INFINITY : (target.height / 2 + 3) / Math.abs(dy),
            );
            const x1 = source.x + dx * sourceScale;
            const y1 = source.y + dy * sourceScale;
            const x2 = target.x - dx * targetScale;
            const y2 = target.y - dy * targetScale;
            const labelX = (x1 + x2) / 2;
            const labelY = (y1 + y2) / 2 + (index % 2 === 0 ? -4 : 7);
            return (
              <g key={`${item.source}-${item.target}`}>
                <line
                  className={`expanded-link expanded-link--${item.kind} ${connected ? 'is-active' : ''} ${dimmed ? 'is-dimmed' : ''}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  markerEnd="url(#expanded-arrow)"
                />
                <text
                  className={`expanded-link-label ${connected ? 'is-active' : ''} ${dimmed ? 'is-dimmed' : ''}`}
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                >
                  {relationKindLabel[item.kind]}
                </text>
              </g>
            );
          })}
        </g>

        <g>
          {positioned.map((item) => {
            const guided = Boolean(
              guidedRelation
              && (item.id === guidedRelation.source || item.id === guidedRelation.target),
            );
            const related = guidedRelation
              ? guided
              : !focusId || item.id === focusId || neighbours.has(item.id);
            return (
              <g
                key={item.id}
                className={`expanded-node expanded-node--${item.kind} ${item.id === focusId || guided ? 'is-active' : ''} ${related ? '' : 'is-dimmed'}`}
                role="button"
                tabIndex={0}
                aria-label={`${entityKindLabel[item.kind]}：${item.label}。${item.detail}`}
                onPointerEnter={(event) => {
                  event.stopPropagation();
                  setHoveredId(item.id);
                }}
                onPointerLeave={(event) => {
                  event.stopPropagation();
                  setHoveredId(null);
                }}
                onFocus={() => setHoveredId(item.id)}
                onBlur={() => setHoveredId(null)}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedId(item.id);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedId(item.id);
                  }
                }}
              >
                <rect
                  className="expanded-node-card"
                  x={item.x - item.width / 2}
                  y={item.y - item.height / 2}
                  width={item.width}
                  height={item.height}
                  rx="2"
                />
                <rect
                  className="expanded-node-ring"
                  x={item.x - item.width / 2 - 3}
                  y={item.y - item.height / 2 - 3}
                  width={item.width + 6}
                  height={item.height + 6}
                  rx="3"
                />
                <text className="expanded-node-kind" x={item.x} y={item.y - 4} textAnchor="middle">
                  {entityKindLabel[item.kind]}
                </text>
                <text className="expanded-node-label" x={item.x} y={item.y + 9} textAnchor="middle">
                  {item.label}
                </text>
                <rect
                  className="expanded-node-hit"
                  x={item.x - item.width / 2}
                  y={item.y - item.height / 2}
                  width={item.width}
                  height={item.height}
                  rx="2"
                />
              </g>
            );
          })}
        </g>
        </svg>
      </div>

      <div className="expanded-node-detail" aria-live={guidedRelation ? 'off' : 'polite'}>
        {guidedRelation && guidedSource && guidedTarget ? (
          <>
            <span>{String(activeRelationIndex + 1).padStart(2, '0')} · {relationKindLabel[guidedRelation.kind]}</span>
            <strong>{guidedSource.label} → {guidedTarget.label}</strong>
            <div>
              <p>{describeRelation(guidedRelation.kind, guidedSource.label, guidedTarget.label)}</p>
              <small>该验证关系写入执行回执与证据根</small>
            </div>
          </>
        ) : (
          <>
            <span>{entityKindLabel[detail.kind]}</span>
            <strong>{detail.label}</strong>
            <div>
              <p>{detail.detail}</p>
              <small>{detailRelations.join(' · ')}</small>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function UniverseDetail({
  node,
  onSelect,
}: {
  node: UniverseNode;
  onSelect: (id: string) => void;
}) {
  if (node.kind === 'scenario' && node.scenario) {
    const scenario = node.scenario;
    const settlementActorIds = new Set(
      scenario.relations
        .filter((item) => item.kind === 'settles')
        .map((item) => item.source),
    );
    const actors = scenario.entities
      .filter((item) => item.kind === 'actor' && !settlementActorIds.has(item.id))
      .map((item) => item.label);
    const facts = scenario.entities.filter((item) => item.kind === 'fact').map((item) => item.label);
    const controls = scenario.entities
      .filter((item) => item.kind === 'control' || (item.kind === 'compute' && !item.core))
      .map((item) => item.label);
    const proofs = scenario.entities.filter((item) => item.kind === 'proof').map((item) => item.label);
    const settlementActors = scenario.entities
      .filter((item) => item.kind === 'actor' && settlementActorIds.has(item.id))
      .map((item) => item.label);
    const journey = [
      {
        label: '谁委托 / 申报',
        title: actors.join(' · '),
        detail: '签署业务目标、验收谓词、授权范围与责任边界',
      },
      {
        label: '谁取证',
        title: facts.join(' · '),
        detail: '分别出具来源、主体、时间和完整性可验证的业务事实',
      },
      {
        label: '谁控制',
        title: controls.join(' · ') || '零信任策略与人工审批',
        detail: '限制数据与工具权限，对异常调用执行审批或阻断',
      },
      {
        label: '谁执行',
        title: 'ACVM 内的可信验证 Agent',
        detail: scenario.predicate,
      },
      {
        label: '谁证明 / 结算',
        title: [...proofs, ...settlementActors].join(' · '),
        detail: scenario.finality,
      },
    ];
    const journeyIcons = ['fingerprint', 'eye', 'shield', 'terminal', 'chain'] as const;

    return (
      <aside className={`universe-detail universe-detail--scenario universe-detail--${scenario.industry}`}>
        <header>
          <div>
            <span>{scenario.index} · {industryMeta[scenario.industry].english}</span>
            <small>{patternMeta[scenario.pattern].code} · {patternMeta[scenario.pattern].label}</small>
          </div>
          <h3>{scenario.title}</h3>
          <p>{scenario.thesis}</p>
        </header>

        <div className="scenario-verification-journey" aria-label={`${scenario.title}端到端验证流程`}>
          {journey.map((step, index) => (
            <section
              key={step.label}
              style={{ '--journey-index': index } as React.CSSProperties}
            >
              <i><Icon name={journeyIcons[index]} /></i>
              <span>
                <small>{String(index + 1).padStart(2, '0')} · {step.label}</small>
                <strong>{step.title}</strong>
                <p>{step.detail}</p>
              </span>
            </section>
          ))}
        </div>

        <footer className="scenario-detail-footer">
          <span><i /> VERIFIED FINALITY</span>
          <div>{scenario.terms.map((term) => <TechTerm term={term} key={term} />)}</div>
        </footer>
      </aside>
    );
  }

  const linkedScenarios = scenarios.filter((scenario) => {
    if (node.kind === 'industry') return scenario.industry === node.industry;
    if (node.kind === 'pattern') return scenario.pattern === node.pattern;
    return true;
  });

  const title = node.kind === 'industry' && node.industry
    ? industryMeta[node.industry].label
    : node.kind === 'pattern' && node.pattern
      ? patternMeta[node.pattern].label
      : 'ACVM 场景本体';
  const eyebrow = node.kind === 'industry' && node.industry
    ? `INDUSTRY ONTOLOGY · ${industryMeta[node.industry].english}`
    : node.kind === 'pattern' && node.pattern
      ? `CONTRACT ONTOLOGY · ${patternMeta[node.pattern].code}`
      : 'ACVM ONTOLOGY · AGENTIC CONTRACT VM';
  const description = node.kind === 'industry' && node.industry
    ? industryMeta[node.industry].description
    : node.kind === 'pattern' && node.pattern
      ? patternMeta[node.pattern].description
      : '身份承诺、企业事实、策略决定、执行回执与联盟链终局被绑定到同一责任链。';

  return (
    <aside className="universe-detail universe-detail--index">
      <header>
        <span>{eyebrow}</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </header>

      <div className="universe-child-graphs">
        {linkedScenarios.map((scenario) => (
          <button
            type="button"
            key={scenario.id}
            onClick={() => onSelect(`scenario-${scenario.id}`)}
          >
            <svg className="universe-child-miniature" viewBox="-15 -15 30 30" aria-hidden="true">
              <ScenarioMiniature scenario={scenario} />
            </svg>
            <span><small>{scenario.index} · {industryMeta[scenario.industry].label}</small><strong>{scenario.title}</strong></span>
            <Icon name="arrow" />
          </button>
        ))}
      </div>

      <footer>
        <span><i className="legend-dot legend-dot--actor" />责任主体</span>
        <span><i className="legend-dot legend-dot--fact" />事实</span>
        <span><i className="legend-dot legend-dot--control" />控制</span>
        <span><i className="legend-dot legend-dot--proof" />证明</span>
      </footer>
    </aside>
  );
}

export function ScenarioPatterns() {
  const [selectedId, setSelectedId] = useState('scenario-ads');
  const [locked, setLocked] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [rotation, setRotation] = useState<UniverseRotation>({ x: -0.22, y: 0.42 });
  const [graphVisible, setGraphVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null);
  const draggedRef = useRef(false);
  const focusId = hoveredId ?? (locked ? selectedId : null);
  const detailId = locked ? selectedId : hoveredId ?? selectedId;

  useEffect(() => {
    const centerMobileGraph = () => {
      const canvas = canvasRef.current;
      if (!canvas || !window.matchMedia('(max-width: 960px)').matches) return;
      window.requestAnimationFrame(() => {
        canvas.scrollLeft = Math.max(0, (canvas.scrollWidth - canvas.clientWidth) / 2);
      });
    };
    centerMobileGraph();
    window.addEventListener('resize', centerMobileGraph);
    return () => window.removeEventListener('resize', centerMobileGraph);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setGraphVisible(entry.isIntersecting),
      { threshold: 0.18 },
    );
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (
      !graphVisible
      || hoveredId
      || window.matchMedia('(max-width: 960px)').matches
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return undefined;

    let frame = 0;
    let previous = 0;
    const rotate = (time: number) => {
      if (time - previous >= 42 && !dragRef.current) {
        previous = time;
        setRotation((current) => ({ ...current, y: current.y + 0.0018 }));
      }
      frame = window.requestAnimationFrame(rotate);
    };
    frame = window.requestAnimationFrame(rotate);
    return () => window.cancelAnimationFrame(frame);
  }, [graphVisible, hoveredId]);

  const adjacency = useMemo(() => {
    const map = new Map(universeNodes.map((node) => [node.id, new Set<string>()]));
    universeEdges.forEach((edge) => {
      map.get(edge.source)?.add(edge.target);
      map.get(edge.target)?.add(edge.source);
    });
    return map;
  }, []);

  const degree = useMemo(() => {
    const map = new Map(universeNodes.map((node) => [node.id, 0]));
    universeEdges.forEach((edge) => {
      map.set(edge.source, (map.get(edge.source) ?? 0) + 1);
      map.set(edge.target, (map.get(edge.target) ?? 0) + 1);
    });
    return map;
  }, []);

  const projected = useMemo<ProjectedUniverseNode[]>(() => {
    return universeNodes.map((node) => {
      const point = projectUniversePoint(node.position, rotation);
      const normalizedDepth = Math.max(0, Math.min(1, (point.depth + 1.15) / 2.3));
      return {
        ...node,
        px: point.x,
        py: point.y,
        depth: point.depth,
        scale: node.kind === 'core' ? 1.2 : 0.84 + normalizedDepth * 0.4,
        opacity: node.kind === 'core' ? 1 : 0.64 + normalizedDepth * 0.36,
      };
    });
  }, [rotation]);

  const orbitPaths = useMemo(() => [
    universeOrbitPath(rotation, 'equator'),
    universeOrbitPath(rotation, 'vertical'),
    universeOrbitPath(rotation, 'tilted'),
  ], [rotation]);

  const axes = useMemo(() => ([
    [[-1.12, 0, 0], [1.12, 0, 0]],
    [[0, -1.02, 0], [0, 1.02, 0]],
    [[0, 0, -1.08], [0, 0, 1.08]],
  ] as const).map(([start, end]) => ({
    start: projectUniversePoint(start, rotation),
    end: projectUniversePoint(end, rotation),
  })), [rotation]);

  const byId = useMemo(() => new Map(projected.map((node) => [node.id, node])), [projected]);
  const neighbours = focusId ? adjacency.get(focusId) ?? new Set<string>() : new Set<string>();
  const detailNode = universeNodes.find((node) => node.id === detailId) ?? universeNodes[0];
  const scenarioFocused = detailNode.kind === 'scenario';

  const selectNode = (id: string) => {
    setSelectedId(id);
    setLocked(true);
  };

  return (
    <div className="scenario-universe">
      <div className="scenario-universe-meta">
        <div>
          <span><i className="universe-shape universe-shape--core" />ACVM</span>
          <span><i className="universe-shape universe-shape--pattern" />合约机制</span>
          <span><i className="universe-shape universe-shape--industry" />行业</span>
          <span><i className="universe-shape universe-shape--scenario" />业务场景</span>
        </div>
        <strong><i /> 3D SPACE · 12 SCENARIOS</strong>
      </div>

      <div className={`scenario-universe-layout ${scenarioFocused ? 'is-scenario-focused' : ''}`}>
        <div className={`scenario-universe-canvas ${dragging ? 'is-dragging' : ''}`} ref={canvasRef}>
          <svg
            viewBox="0 0 760 414"
            role="img"
            aria-label="可旋转的 ACVM 行业与业务场景三维图谱"
            onPointerDown={(event) => {
              if ((event.target as Element).closest('.universe-node')) return;
              if (window.matchMedia('(max-width: 960px)').matches) return;
              dragRef.current = { x: event.clientX, y: event.clientY, rx: rotation.x, ry: rotation.y };
              draggedRef.current = false;
              setDragging(true);
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              const drag = dragRef.current;
              if (!drag) return;
              if (Math.abs(event.clientX - drag.x) + Math.abs(event.clientY - drag.y) > 5) {
                draggedRef.current = true;
              }
              setRotation({
                x: Math.max(-0.48, Math.min(0.48, drag.rx - (event.clientY - drag.y) * 0.003)),
                y: drag.ry + (event.clientX - drag.x) * 0.004,
              });
            }}
            onPointerUp={(event) => {
              dragRef.current = null;
              setDragging(false);
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
            }}
            onPointerCancel={() => {
              dragRef.current = null;
              setDragging(false);
            }}
            onPointerLeave={() => {
              dragRef.current = null;
              setDragging(false);
              setHoveredId(null);
            }}
            onClick={() => {
              if (draggedRef.current) {
                draggedRef.current = false;
                return;
              }
              setLocked(false);
              setSelectedId('acvm-root');
            }}
          >
            <defs>
              <radialGradient id="universe-core-glow">
                <stop offset="0" stopColor="#69d8e8" stopOpacity=".2" />
                <stop offset=".5" stopColor="#5f72ff" stopOpacity=".08" />
                <stop offset="1" stopColor="#050812" stopOpacity="0" />
              </radialGradient>
            </defs>

            <ellipse className="universe-ground" cx="380" cy="354" rx="238" ry="29" />
            <circle className="universe-volume" cx="380" cy="206" r="176" />

            <g className="universe-axes" aria-hidden="true">
              {axes.map((axis, index) => (
                <line
                  key={index}
                  x1={axis.start.x}
                  y1={axis.start.y}
                  x2={axis.end.x}
                  y2={axis.end.y}
                />
              ))}
            </g>

            <g className="universe-orbits-3d" aria-hidden="true">
              {orbitPaths.map((path, index) => <path d={path} key={index} />)}
            </g>

            <g className="universe-edges">
              {universeEdges.map((edge) => {
                const source = byId.get(edge.source);
                const target = byId.get(edge.target);
                if (!source || !target) return null;
                const connected = Boolean(focusId) && (edge.source === focusId || edge.target === focusId);
                const dimmed = Boolean(focusId) && !connected;
                const depth = (source.depth + target.depth) / 2;
                const opacity = Math.max(.12, Math.min(.58, .25 + (depth + 1) * .16));
                return (
                  <line
                    key={`${edge.source}-${edge.target}`}
                    className={`universe-edge universe-edge--${edge.kind} ${connected ? 'is-active' : ''} ${dimmed ? 'is-dimmed' : ''}`}
                    x1={source.px}
                    y1={source.py}
                    x2={target.px}
                    y2={target.py}
                    style={{ '--edge-opacity': opacity } as React.CSSProperties}
                  />
                );
              })}
            </g>

            <g className="universe-nodes">
              {[...projected].sort((a, b) => a.depth - b.depth).map((node) => {
                const related = !focusId
                  || node.id === focusId
                  || node.kind === 'core'
                  || neighbours.has(node.id);
                const active = node.id === focusId;
                const radius = node.kind === 'core'
                  ? 23
                  : node.kind === 'scenario'
                    ? 14 + Math.min(2, (degree.get(node.id) ?? 0) * 0.4)
                    : node.kind === 'industry'
                      ? 11
                      : 9.5;
                const scaledRadius = radius * node.scale;
                const labelAtLeft = node.px < 205;
                const labelAtRight = node.px > 555;
                const labelX = labelAtLeft
                  ? node.px - scaledRadius - 8
                  : labelAtRight
                    ? node.px + scaledRadius + 8
                    : node.px;
                const labelY = labelAtLeft || labelAtRight
                  ? node.py + 3
                  : node.py < 206
                    ? node.py - scaledRadius - 8
                    : node.py + scaledRadius + (node.kind === 'scenario' ? 12 : 11);
                const labelAnchor = labelAtLeft ? 'end' : labelAtRight ? 'start' : 'middle';
                return (
                  <g
                    key={node.id}
                    className={`universe-node universe-node--${node.kind} ${active ? 'is-active' : ''} ${related ? '' : 'is-dimmed'}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${node.kind === 'scenario' ? '业务场景' : node.kind === 'industry' ? '行业本体' : node.kind === 'pattern' ? '合约机制' : 'ACVM'}：${node.label}`}
                    onPointerEnter={(event) => {
                      event.stopPropagation();
                      setHoveredId(node.id);
                    }}
                    onPointerLeave={(event) => {
                      event.stopPropagation();
                      setHoveredId(null);
                    }}
                    onFocus={() => setHoveredId(node.id)}
                    onBlur={() => setHoveredId(null)}
                    onClick={(event) => {
                      event.stopPropagation();
                      selectNode(node.id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        selectNode(node.id);
                      }
                    }}
                    style={{
                      '--node-scale': node.scale,
                      '--node-opacity': node.opacity,
                      '--node-depth': node.depth,
                    } as React.CSSProperties}
                  >
                    {node.kind === 'scenario' && node.scenario ? (
                      <g transform={`translate(${node.px} ${node.py}) scale(${node.scale})`}>
                        <ScenarioMiniature scenario={node.scenario} />
                        <circle className="universe-node-hit" r={radius + 5} />
                      </g>
                    ) : (
                      <>
                        {node.kind === 'pattern' && node.pattern ? (
                          <>
                            <rect
                              x={node.px - scaledRadius}
                              y={node.py - scaledRadius}
                              width={scaledRadius * 2}
                              height={scaledRadius * 2}
                              transform={`rotate(45 ${node.px} ${node.py})`}
                            />
                            <text className="universe-pattern-code" x={node.px} y={node.py + 2.5} textAnchor="middle">
                              {patternMeta[node.pattern].code}
                            </text>
                          </>
                        ) : (
                          <circle cx={node.px} cy={node.py} r={scaledRadius} />
                        )}
                        {node.kind === 'core' && (
                          <>
                            <circle className="universe-core-orbit" cx={node.px} cy={node.py} r={scaledRadius + 7} />
                            <text className="universe-core-label" x={node.px} y={node.py + 3} textAnchor="middle">ACVM</text>
                          </>
                        )}
                      </>
                    )}
                    {node.kind !== 'core' && (
                      <text className="universe-node-label" x={labelX} y={labelY} textAnchor={labelAnchor}>
                        {node.kind === 'pattern' && node.pattern ? patternMeta[node.pattern].label : node.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            <text className="universe-axis-label" x="16" y="22">ACVM VERIFICATION SPACE / XYZ</text>
            <text className="universe-axis-label" x="744" y="22" textAnchor="end">IDENTITY · EVIDENCE · POLICY · PROOF · FINALITY</text>
          </svg>
        </div>

        <UniverseDetail node={detailNode} onSelect={selectNode} />
      </div>
    </div>
  );
}
