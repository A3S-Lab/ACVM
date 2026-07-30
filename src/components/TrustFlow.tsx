import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks';
import { Icon, type IconName } from './Icons';

type FlowMode = 'legacy' | 'acvm';

type ActorKey = 'initiator' | 'operator' | 'evidence' | 'acvm' | 'ledger';

type FlowStage = {
  key: string;
  label: string;
  tag: string;
  title: string;
  detail: string;
  artifact: string;
  actors: ActorKey[];
};

type StoryPlaybook = {
  oneLine: string;
  subject: string;
  labels: [string, string, string, string, string, string, string];
  agreement: {
    object: string;
    rule: string;
    result: string;
  };
  operation: {
    action: string;
    object: string;
    result: string;
    hold: string;
  };
  evidence: {
    action: string;
    items: [string, string, string];
    result: string;
    missing: string;
  };
  privateRule: string;
  verifyFail: string;
  safety: {
    signals: [string, string, string];
    rule: string;
    block: string;
  };
};

export type StoryId =
  | 'ads'
  | 'supply'
  | 'sla'
  | 'royalty'
  | 'gov-subsidy'
  | 'gov-project'
  | 'factory-quality'
  | 'factory-energy'
  | 'finance-credit'
  | 'finance-insurance'
  | 'education-training'
  | 'education-research';

export type StoryCategory = '商业' | '政务' | '制造' | '金融' | '教育';

export type Story = {
  id: StoryId;
  index: string;
  category: StoryCategory;
  title: string;
  summary: string;
  source: string;
  contract: string;
  amount: string;
  api: string;
  privateTitle: string;
  privateDetail: string;
  zeroTrustTitle: string;
  verification: string;
  verificationDetail: string;
  sentry: string;
  consensus: string;
  receipt: string;
  receiptLabel: string;
  legacyInference: string;
  legacyExecution: string;
  nodes: [string, string];
};

export type StoryParticipant = {
  name: string;
  role: string;
};

export type StoryParticipants = {
  initiator: StoryParticipant;
  operator: StoryParticipant;
  evidence: StoryParticipant;
};

export const storyOptions: Story[] = [
  {
    id: 'ads',
    index: '01',
    category: '商业',
    title: '广告按效果结算',
    summary: '核验有效转化后付款',
    source: '广告主',
    contract: '广告 AC · #18',
    amount: '¥68,400',
    api: 'campaign.read · conversion.verify · payment.release',
    privateTitle: 'a3s-power 在隔离环境中分析脱敏转化事件',
    privateDetail: '用户级转化数据只在 a3s-box 的 TEE 内处理，对外输出聚合证明。',
    zeroTrustTitle: '广告平台、独立分析和 CRM 数据分别通过零信任网关',
    verification: '多源数据确认 2,184 个有效转化，无效流量 1.7%',
    verificationDetail: 'Agent 调用投放、分析和订单工具交叉核验，结果达到结算门槛。',
    sentry: '未发现指标篡改、异常导出或未知数据目标',
    consensus: '广告主、渠道与审计节点确认本期投放结果',
    receipt: 'ACVM 向推广渠道结算 ¥68,400',
    receiptLabel: '渠道结算 #AD18',
    legacyInference: '外部 AI 读取渠道报表后给出投放效果判断',
    legacyExecution: '传统合约只能执行传入的转化数量和付款条件，无法核验报表来源与工具过程。',
    nodes: ['广', '渠'],
  },
  {
    id: 'supply',
    index: '02',
    category: '制造',
    title: '供应链验收付款',
    summary: '核验交付与质检后付款',
    source: '采购企业',
    contract: '采购 AC · #31',
    amount: '¥252,000',
    api: 'logistics.read · quality.verify · payment.release',
    privateTitle: 'a3s-power 在隔离环境中分析质检单和交付影像',
    privateDetail: '商业单据和质检影像不离开企业隐私域，只返回验收结论和证明。',
    zeroTrustTitle: '物流、仓储、质检和付款接口分别通过零信任网关',
    verification: '签收数量、温控记录与抽检结果全部符合采购合同',
    verificationDetail: 'Agent 使用物流、IoT 和质检工具核验交付，不依赖供应商单方声明。',
    sentry: '未发现补录数据、异常设备身份或越权付款请求',
    consensus: '采购企业、供应商与审计节点确认验收结果',
    receipt: 'ACVM 向供应商支付 ¥252,000',
    receiptLabel: '验收付款 #SC31',
    legacyInference: '外部系统读取供应商提交的验收结果并建议付款',
    legacyExecution: '传统合约能检查“已签收”字段，却无法核验物流、IoT 与质检工具产生的证据链。',
    nodes: ['企', '供'],
  },
  {
    id: 'sla',
    index: '03',
    category: '商业',
    title: '软件 SLA 自动结算',
    summary: '核验可用率并计算服务费',
    source: '企业客户',
    contract: 'SLA AC · #12',
    amount: '¥29,600',
    api: 'metrics.read · incidents.verify · invoice.settle',
    privateTitle: 'a3s-power 在隔离环境中归因故障日志与工单',
    privateDetail: '生产日志中的用户和系统敏感信息留在企业侧，只输出故障归因摘要。',
    zeroTrustTitle: '服务商监控、独立探针和工单系统分别通过零信任网关',
    verification: '本月可用率 99.82%，按 SLA 扣减 ¥2,400',
    verificationDetail: 'Agent 交叉核验监控、探针和故障工单，自动计算最终应付金额。',
    sentry: '未发现监控缺口、时间戳回写或指标来源漂移',
    consensus: '客户、服务商与审计节点确认 SLA 结算结果',
    receipt: 'ACVM 结算服务费 ¥29,600',
    receiptLabel: 'SLA 结算 #SV12',
    legacyInference: '外部脚本读取服务商月报并计算 SLA 费用',
    legacyExecution: '传统合约可按输入的可用率算费用，却无法验证监控覆盖、故障归因和指标完整性。',
    nodes: ['客', '服'],
  },
  {
    id: 'royalty',
    index: '04',
    category: '商业',
    title: '内容使用自动分成',
    summary: '核验有效使用量后分成',
    source: '内容平台',
    contract: '分成 AC · #22',
    amount: '¥18,760',
    api: 'usage.read · fraud.filter · royalty.release',
    privateTitle: 'a3s-power 在隔离环境中去重使用记录并识别异常流量',
    privateDetail: '用户行为明细保持私密，只输出有效使用量、异常比例和可验证摘要。',
    zeroTrustTitle: '播放、订阅、订单和反作弊接口分别通过零信任网关',
    verification: '去重后确认 46,900 次有效付费使用',
    verificationDetail: 'Agent 使用统计、订单与反作弊工具核验分成基数。',
    sentry: '未发现刷量、重复结算或创作者账户替换',
    consensus: '平台、创作者与审计节点确认本期分成结果',
    receipt: 'ACVM 向创作者支付 ¥18,760',
    receiptLabel: '内容分成 #IP22',
    legacyInference: '平台脚本汇总内部使用量并提交分成数字',
    legacyExecution: '传统合约可按提交数字计算分成，却无法验证去重、反作弊和订单核验过程。',
    nodes: ['平', '创'],
  },
  {
    id: 'gov-subsidy',
    index: '05',
    category: '政务',
    title: '惠企补贴核验拨付',
    summary: '跨部门核验资格后拨款',
    source: '产业主管部门',
    contract: '补贴 AC · #45',
    amount: '¥800,000',
    api: 'tax.verify · credit.verify · milestone.read · fund.release',
    privateTitle: 'a3s-power 在隔离环境中核验企业经营与项目材料',
    privateDetail: '纳税、用工和经营数据不跨部门扩散，只返回资格结论和证明。',
    zeroTrustTitle: '税务、信用、项目监管和财政接口分别通过政务零信任网关',
    verification: '企业资质有效，投资与就业指标达到专项资金规则',
    verificationDetail: 'Agent 调用授权的跨部门工具核验资格，避免重复申报和人工搬运数据。',
    sentry: '未发现材料篡改、重复申领或非授权数据查询',
    consensus: '主管部门、财政与审计节点确认拨付条件',
    receipt: 'ACVM 向企业拨付专项资金 ¥800,000',
    receiptLabel: '补贴拨付 #GV45',
    legacyInference: '业务系统汇总企业材料并由人员判断是否符合补贴条件',
    legacyExecution: '传统合约可按“审核通过”字段拨款，却无法验证跨部门核验过程与最小授权边界。',
    nodes: ['产', '财'],
  },
  {
    id: 'gov-project',
    index: '06',
    category: '政务',
    title: '政府工程进度款',
    summary: '核验工程进度后付款',
    source: '项目建设单位',
    contract: '工程 AC · #63',
    amount: '¥3,200,000',
    api: 'bim.read · supervision.verify · invoice.verify · fund.release',
    privateTitle: 'a3s-power 在隔离环境中比对 BIM、影像和监理记录',
    privateDetail: '工程图纸、现场影像和合同细节留在项目隐私域，只输出进度证明。',
    zeroTrustTitle: 'BIM、监理、发票和财政支付接口分别通过政务零信任网关',
    verification: '本期工程量完成 32.4%，监理签章与发票一致',
    verificationDetail: 'Agent 使用工程、影像、监理和票据工具交叉核验进度。',
    sentry: '未发现重复计量、签章异常或收款账户变更',
    consensus: '建设单位、监理、财政和审计节点确认本期工程量',
    receipt: 'ACVM 向承建方支付进度款 ¥3,200,000',
    receiptLabel: '工程款 #GV63',
    legacyInference: '项目系统读取监理上报的工程量并提交付款申请',
    legacyExecution: '传统合约能按上报比例付款，却无法核验 BIM、现场影像、签章和发票的一致性。',
    nodes: ['建', '监'],
  },
  {
    id: 'factory-quality',
    index: '07',
    category: '制造',
    title: '生产批次质量结算',
    summary: '核验工艺与质检后结算',
    source: '整机制造商',
    contract: '质量 AC · #71',
    amount: '¥1,460,000',
    api: 'mes.read · qms.verify · lab.verify · payment.release',
    privateTitle: 'a3s-power 在隔离环境中分析工艺参数、质检与实验室数据',
    privateDetail: '产线配方和质量数据不暴露给交易对手，只输出批次合格证明。',
    zeroTrustTitle: 'MES、QMS、实验室和供应商接口分别通过工业零信任网关',
    verification: '批次良率 99.3%，关键尺寸与材料检测全部合格',
    verificationDetail: 'Agent 调用制造与质量工具核验完整批次，不依赖纸面合格证。',
    sentry: '未发现传感器身份异常、检测补录或批次号替换',
    consensus: '制造商、供应商和质量审计节点确认批次结果',
    receipt: 'ACVM 向零部件供应商结算 ¥1,460,000',
    receiptLabel: '质量结算 #MF71',
    legacyInference: '供应商提交批次合格证，采购系统据此发起结算',
    legacyExecution: '传统合约能读取合格字段，却无法验证 MES、QMS、实验室和传感器证据。',
    nodes: ['制', '供'],
  },
  {
    id: 'factory-energy',
    index: '08',
    category: '制造',
    title: '节能改造按效果付费',
    summary: '核验真实节能量后付款',
    source: '生产企业',
    contract: '节能 AC · #84',
    amount: '¥386,000',
    api: 'meter.read · production.normalize · baseline.verify · payment.release',
    privateTitle: 'a3s-power 在隔离环境中归一化能耗、产量和工况数据',
    privateDetail: '产能与工艺参数保持私密，只输出可复验的基线和节能量。',
    zeroTrustTitle: '智能电表、MES、能源平台和结算接口分别通过工业零信任网关',
    verification: '剔除产量与工况影响后，确认节能率 12.6%',
    verificationDetail: 'Agent 使用计量、生产和基线工具核验节能服务的真实效果。',
    sentry: '未发现电表离线、基线漂移或历史数据回写',
    consensus: '生产企业、节能服务商与审计节点确认节能量',
    receipt: 'ACVM 向节能服务商支付 ¥386,000',
    receiptLabel: '节能结算 #MF84',
    legacyInference: '服务商根据自有报表计算节能量并提出付款金额',
    legacyExecution: '传统合约可按提交的节能率付款，却无法核验生产工况、计量来源和基线调整。',
    nodes: ['厂', '能'],
  },
  {
    id: 'finance-credit',
    index: '09',
    category: '金融',
    title: '供应链融资按履约放款',
    summary: '核验真实贸易后分段放款',
    source: '供应链金融机构',
    contract: '融资 AC · #91',
    amount: '¥5,000,000',
    api: 'order.verify · logistics.read · invoice.verify · credit.release',
    privateTitle: 'a3s-power 在隔离环境中核验订单、发票与企业经营数据',
    privateDetail: '交易明细和授信模型只在 a3s-box 的 TEE 内处理，对参与方输出融资条件证明。',
    zeroTrustTitle: '核心企业、物流、票据和授信接口分别通过金融零信任网关',
    verification: '贸易背景真实，货物已交付，应收账款未重复融资',
    verificationDetail: 'Agent 交叉核验订单、物流、发票和登记信息，再按履约进度申请放款。',
    sentry: '未发现重复质押、关联账户替换或异常批量查询',
    consensus: '金融机构、核心企业与审计节点确认本期履约状态',
    receipt: 'ACVM 向供应商发放融资 ¥5,000,000',
    receiptLabel: '履约放款 #FN91',
    legacyInference: '融资系统读取企业提交的贸易材料并给出授信建议',
    legacyExecution: '传统合约能按“审核通过”字段放款，却无法验证贸易背景、重复质押和数据授权范围。',
    nodes: ['银', '核'],
  },
  {
    id: 'finance-insurance',
    index: '10',
    category: '金融',
    title: '货运保险核验赔付',
    summary: '核验事故责任后自动赔付',
    source: '保险机构',
    contract: '理赔 AC · #26',
    amount: '¥128,000',
    api: 'policy.read · logistics.verify · damage.inspect · claim.release',
    privateTitle: 'a3s-power 在隔离环境中比对保单、运输轨迹和损失影像',
    privateDetail: '客户资料、货值和事故影像不向交易对手公开，只输出责任与损失区间证明。',
    zeroTrustTitle: '保单、物流、查勘和赔付接口分别通过金融零信任网关',
    verification: '事故在承保区间内，运输轨迹连续，定损金额符合条款',
    verificationDetail: 'Agent 调用保单、定位、查勘与价格工具核验事故，不依赖单方报案描述。',
    sentry: '未发现重复报案、影像复用或收款账户临时变更',
    consensus: '保险机构、被保险企业与审计节点确认理赔事实',
    receipt: 'ACVM 向被保险企业赔付 ¥128,000',
    receiptLabel: '保险赔付 #FN26',
    legacyInference: '理赔系统读取查勘报告并由人员决定是否赔付',
    legacyExecution: '传统合约可按提交的定损金额赔付，却无法核验保单、轨迹、影像和反欺诈证据。',
    nodes: ['保', '企'],
  },
  {
    id: 'education-training',
    index: '11',
    category: '教育',
    title: '职业培训按就业成效结算',
    summary: '核验学习与就业后结算',
    source: '公共就业服务部门',
    contract: '培训 AC · #52',
    amount: '¥420,000',
    api: 'course.verify · exam.verify · employment.verify · fund.release',
    privateTitle: 'a3s-power 在隔离环境中核验学习、考试和就业记录',
    privateDetail: '学员身份、成绩和就业信息不在机构间扩散，只输出达标人数与成效证明。',
    zeroTrustTitle: '培训平台、考试、人社和财政接口分别通过政务教育零信任网关',
    verification: '148 名学员完成课程，121 人通过考核并实现稳定就业',
    verificationDetail: 'Agent 使用教学、考试和就业工具核验结果，过滤代学、重复申报和短期挂靠。',
    sentry: '未发现考勤代刷、证书复用或批量越权查询',
    consensus: '就业部门、培训机构与审计节点确认培训成效',
    receipt: 'ACVM 向培训机构结算 ¥420,000',
    receiptLabel: '培训结算 #ED52',
    legacyInference: '培训机构汇总结业和就业名单并提交结算申请',
    legacyExecution: '传统合约能按上报人数结算，却无法验证学习过程、考试结果和就业真实性。',
    nodes: ['教', '培'],
  },
  {
    id: 'education-research',
    index: '12',
    category: '教育',
    title: '科研项目按里程碑拨款',
    summary: '证明阶段成果后拨付经费',
    source: '高校科研管理部门',
    contract: '科研 AC · #37',
    amount: '¥1,200,000',
    api: 'repository.verify · ethics.verify · equipment.read · grant.release',
    privateTitle: 'a3s-power 在隔离环境中核验实验记录、成果版本和经费材料',
    privateDetail: '未公开论文、实验数据和知识产权材料留在校内，只输出里程碑完成证明。',
    zeroTrustTitle: '科研仓库、伦理审查、设备平台和财务接口分别通过校园零信任网关',
    verification: '第二阶段实验完成，成果版本、伦理审批与设备记录一致',
    verificationDetail: 'Agent 按任务书核验长期项目状态，并将连续里程碑承诺关联到本次拨款。',
    sentry: '未发现成果重复使用、记录补写或非授权资料导出',
    consensus: '高校、资助单位与审计节点确认阶段成果',
    receipt: 'ACVM 向项目团队拨付经费 ¥1,200,000',
    receiptLabel: '科研拨款 #ED37',
    legacyInference: '项目团队提交阶段报告，由管理人员判断是否完成里程碑',
    legacyExecution: '传统合约可按“验收通过”字段拨款，却无法验证长期状态承诺、成果版本和隐私证据。',
    nodes: ['校', '资'],
  },
];

export const storyParticipants: Record<StoryId, StoryParticipants> = {
  ads: {
    initiator: { name: '广告主', role: '锁定预算与有效转化口径' },
    operator: { name: '推广渠道', role: '执行投放并持续优化' },
    evidence: { name: '广告平台 · 分析 · CRM', role: '提供曝光、转化与订单证据' },
  },
  supply: {
    initiator: { name: '采购企业', role: '发布采购订单与验收规则' },
    operator: { name: '零部件供应商', role: '生产、发货并申请验收' },
    evidence: { name: '物流 · 仓储 · 质检 · IoT', role: '提供签收、温控与抽检证据' },
  },
  sla: {
    initiator: { name: '企业客户', role: '约定可用率与扣款规则' },
    operator: { name: '软件服务商', role: '持续提供线上服务' },
    evidence: { name: '监控 · 独立探针 · 工单', role: '提供可用率与故障归因证据' },
  },
  royalty: {
    initiator: { name: '内容平台', role: '发布分成规则与结算周期' },
    operator: { name: '内容创作者', role: '授权内容并获得分成' },
    evidence: { name: '播放 · 订阅 · 订单 · 反作弊', role: '提供有效使用与付费证据' },
  },
  'gov-subsidy': {
    initiator: { name: '产业主管部门', role: '发布补贴条件与资金规则' },
    operator: { name: '申报企业', role: '履行投资与就业承诺' },
    evidence: { name: '税务 · 信用 · 项目监管', role: '提供跨部门资格与履约证据' },
  },
  'gov-project': {
    initiator: { name: '项目建设单位', role: '发布工程任务与付款节点' },
    operator: { name: '工程承建方', role: '施工并申请进度款' },
    evidence: { name: 'BIM · 监理 · 现场影像 · 发票', role: '提供工程量与票据一致性证据' },
  },
  'factory-quality': {
    initiator: { name: '整机制造商', role: '定义批次质量与结算规则' },
    operator: { name: '零部件供应商', role: '生产并交付指定批次' },
    evidence: { name: 'MES · QMS · 实验室 · 传感器', role: '提供工艺、检测与批次证据' },
  },
  'factory-energy': {
    initiator: { name: '生产企业', role: '约定节能目标与基线方法' },
    operator: { name: '节能服务商', role: '实施改造并持续运营' },
    evidence: { name: '智能电表 · MES · 能源平台', role: '提供能耗、产量与工况证据' },
  },
  'finance-credit': {
    initiator: { name: '供应链金融机构', role: '定义授信与分段放款规则' },
    operator: { name: '融资供应商', role: '履行订单并申请融资' },
    evidence: { name: '核心企业 · 物流 · 票据登记', role: '提供贸易、交付与质押证据' },
  },
  'finance-insurance': {
    initiator: { name: '保险机构', role: '发布承保与理赔规则' },
    operator: { name: '被保险企业', role: '运输货物并发起报案' },
    evidence: { name: '保单 · 物流轨迹 · 查勘影像', role: '提供事故责任与损失证据' },
  },
  'education-training': {
    initiator: { name: '公共就业服务部门', role: '约定培训与就业成效指标' },
    operator: { name: '职业培训机构', role: '组织教学、考试与就业服务' },
    evidence: { name: '教学平台 · 考试 · 人社', role: '提供学习、考核与就业证据' },
  },
  'education-research': {
    initiator: { name: '高校科研管理部门', role: '发布任务书与里程碑规则' },
    operator: { name: '科研项目团队', role: '执行实验并提交阶段成果' },
    evidence: { name: '科研仓库 · 伦理 · 设备平台', role: '提供版本、审批与实验记录' },
  },
};

export const storyPlaybooks: Record<StoryId, StoryPlaybook> = {
  ads: {
    oneLine: '广告主先锁定预算，渠道完成投放，平台、独立分析与 CRM 分别出证；只有真实转化通过核验，渠道才收到款项。',
    subject: 'Campaign CN-18 · 30 天投放周期',
    labels: ['锁定预算', '渠道投放', '三方取证', '去重归因', '安全放行', '节点确认', '渠道收款'],
    agreement: {
      object: '预算 ¥68,400 · 转化口径 · 归因窗口',
      rule: '订单已支付 ∧ 归因不超过 7 天 ∧ 反作弊通过',
      result: '广告 AC #18 生效，预算进入锁定状态',
    },
    operation: {
      action: '推广渠道执行 30 天投放，广告平台持续记录每次曝光与点击',
      object: '投放计划 · 点击签名 · 渠道成本',
      result: '投放周期结束，渠道提交按效果结算申请',
      hold: '周期未结束或投放未达到约定范围，预算继续锁定',
    },
    evidence: {
      action: '广告平台、独立分析与广告主 CRM 各自开放本期只读证据',
      items: ['平台曝光与点击日志', '独立分析归因结果', 'CRM 已支付订单'],
      result: '三份来源独立、时间可对齐的签名证据进入核验',
      missing: '任一来源缺签、时间断档或超出本期范围，停止核验',
    },
    privateRule: '设备与订单去重 ∧ 归因窗口有效 ∧ 已退款订单剔除 ∧ 无效流量低于 5%',
    verifyFail: '无效流量超限或三方数量无法闭合，付款冻结并生成差异清单',
    safety: {
      signals: ['调用主体 = 广告 AC #18', '只访问本期 Campaign', '渠道收款账户未变更'],
      rule: '身份、数据范围、工具行为与付款指令同时可信才允许结算',
      block: '发现越权导出、指标回写或账户替换，ACVM 立即阻断付款',
    },
  },
  sla: {
    oneLine: '客户锁定月度服务费，服务商持续供服；监控、独立探针和工单共同还原故障，再按真实可用率自动扣费。',
    subject: '企业软件服务 · 2026-07 结算窗口',
    labels: ['生效 SLA', '持续供服', '监控取证', '故障归因', '扣费裁决', '双方确认', '服务结算'],
    agreement: {
      object: '月费 ¥32,000 · 99.90% SLA · 扣款阶梯',
      rule: '可用率按有效服务分钟计算，已批准维护窗口不计故障',
      result: 'SLA AC #12 生效，月费进入待结算状态',
    },
    operation: {
      action: '软件服务商持续提供线上服务，监控和工单记录每次中断',
      object: '7×24 服务日志 · 事件工单 · 维护日历',
      result: '月度窗口结束，服务商发起 SLA 结算',
      hold: '结算窗口未结束或监控覆盖不足，暂不计算服务费',
    },
    evidence: {
      action: '服务商监控、客户侧独立探针与双方工单系统分别提供时间线',
      items: ['服务商指标与告警', '客户侧探针时序', '故障工单与维护审批'],
      result: '三条时间线完成对齐，形成完整故障事件集',
      missing: '监控存在空窗或工单时间被改写，进入人工复核',
    },
    privateRule: '探针中断 ∧ 服务告警 ∧ 工单重叠；排除已批准维护并归属责任方',
    verifyFail: '故障来源无法交叉确认，不采用服务商单方月报结算',
    safety: {
      signals: ['监控覆盖率完整', '时间戳无回写', '发票与收款账户一致'],
      rule: '证据连续、归因可复验且扣款公式版本一致才允许开票结算',
      block: '指标源漂移或账单金额被改写，冻结结算并通知双方',
    },
  },
  royalty: {
    oneLine: '平台登记内容授权，用户持续使用；播放、订阅、订单与反作弊系统分别出证，去重后再向创作者分成。',
    subject: '作品 IP-22 · 月度内容分成',
    labels: ['登记授权', '内容使用', '四方取证', '去重反刷', '分成放行', '账期确认', '创作者收款'],
    agreement: {
      object: '作品授权 · ¥0.40/次 · 月度结算规则',
      rule: '仅统计已付费、未退款、非重复且反作弊通过的有效使用',
      result: '分成 AC #22 生效，作品与创作者身份完成绑定',
    },
    operation: {
      action: '内容平台分发作品，播放与订阅系统持续记录真实使用',
      object: '播放会话 · 订阅关系 · 订单流水',
      result: '账期结束，平台提交本期使用记录',
      hold: '授权过期或账期未结束，不生成分成指令',
    },
    evidence: {
      action: '播放、订阅、订单和反作弊系统按各自责任范围提供记录',
      items: ['播放会话签名', '订阅与支付订单', '设备反作弊标签'],
      result: '使用、付费和风险标签按同一匿名标识完成关联',
      missing: '订单无法对应使用记录或风险标签缺失，相关记录不计入分成',
    },
    privateRule: '同一用户与设备去重 ∧ 订单有效 ∧ 未退款 ∧ 非刷量集群',
    verifyFail: '刷量比例超限或创作者归属不一致，暂停本期分成',
    safety: {
      signals: ['内容 ID 与授权一致', '反作弊模型版本固定', '创作者账户未替换'],
      rule: '有效使用量、费率与权利人身份同时匹配才生成分成指令',
      block: '发现批量刷量、重复结算或权利人替换，ACVM 拒绝付款',
    },
  },
  'gov-subsidy': {
    oneLine: '主管部门发布补贴条件，企业履行投资与就业承诺；税务、信用和项目监管只出具必要证明，财政据此拨付。',
    subject: '先进制造专项资金 · 申报批次 2026-03',
    labels: ['发布条件', '企业履约', '跨部门取证', '资格核验', '防重控制', '财审确认', '专项拨付'],
    agreement: {
      object: '专项额度 ¥800,000 · 资格条件 · 绩效指标',
      rule: '主体资质有效 ∧ 投资和就业达标 ∧ 无失信与重复申报',
      result: '补贴 AC #45 生效，申报企业责任与拨付条件固定',
    },
    operation: {
      action: '申报企业完成设备投资、项目建设与新增就业承诺',
      object: '设备验收清单 · 项目台账 · 用工记录',
      result: '企业提交里程碑完成申请，等待跨部门核验',
      hold: '投资或就业指标未到验收节点，专项额度不进入拨付',
    },
    evidence: {
      action: '税务、信用和项目监管部门分别返回最小化资格证明',
      items: ['纳税与欠缴情形证明', '信用与重复申报记录', '投资发票与项目验收'],
      result: '跨部门证明在不交换原始台账的前提下完成关联',
      missing: '任一法定数据源缺失或授权过期，拨付流程暂停',
    },
    privateRule: '统一社会信用代码一致 ∧ 经营正常 ∧ 指标达标 ∧ 未在其他批次申领',
    verifyFail: '资格冲突、重复申领或绩效不足，退回企业补正或终止申请',
    safety: {
      signals: ['查询目的 = 本次补贴', '字段范围符合最小授权', '收款账户为企业备案账户'],
      rule: '用途、权限、资格结论和财政指令全部一致才允许进入共识',
      block: '出现越权查询、材料篡改或收款账户变更，立即阻断拨付',
    },
  },
  'gov-project': {
    oneLine: '建设单位锁定付款节点，承建方施工；BIM、监理、现场影像和发票共同证明真实工程量，再支付进度款。',
    subject: '市政工程第二进度节点 · 合同 GV-63',
    labels: ['锁定节点', '工程施工', '四方取证', '工程量核验', '账户控制', '四方确认', '进度付款'],
    agreement: {
      object: '进度款 ¥3,200,000 · 清单工程量 · 验收节点',
      rule: 'BIM 工程量、监理签章、现场完成度与发票必须一致',
      result: '工程 AC #63 生效，本期付款上限与责任主体锁定',
    },
    operation: {
      action: '承建方完成本期施工并在 BIM 中提交已完工程量',
      object: '施工批次 · BIM 版本 · 进度申请单',
      result: '承建方申报完成 32.4%，监理开始现场复核',
      hold: '未到合同节点或关键工序未验收，不受理进度款',
    },
    evidence: {
      action: 'BIM 平台、监理、现场影像和电子发票分别提供可签验证据',
      items: ['BIM 版本与工程量', '监理签章与测量记录', '定位影像与电子发票'],
      result: '图纸版本、实物进度、签章和票据按同一施工批次对齐',
      missing: '版本号、定位时间或签章任一不一致，退回本期计量',
    },
    privateRule: '清单工程量不重复 ∧ 影像位置匹配 ∧ 监理签章有效 ∧ 发票金额不超上限',
    verifyFail: '发现重复计量、影像复用或票据不一致，暂停付款并生成核减项',
    safety: {
      signals: ['BIM 版本已冻结', '监理证书有效', '承建方账户未变更'],
      rule: '工程事实、法定签章和财政支付边界全部通过才允许拨付',
      block: '临时改账户、越权改工程量或重复请款，ACVM 直接拦截',
    },
  },
  supply: {
    oneLine: '采购企业发布订单，供应商生产交付；物流、仓储、质检与 IoT 共同证明数量和质量，验收后才付款。',
    subject: '采购订单 PO-31 · 12,000 件零部件',
    labels: ['发布采购', '生产交付', '物流质检取证', '验收核验', '付款控制', '三方确认', '供应商收款'],
    agreement: {
      object: '订单 ¥252,000 · 数量 · 温控与抽检标准',
      rule: '足量签收 ∧ 全程温控合格 ∧ 抽检结果达到采购标准',
      result: '采购 AC #31 生效，货款按订单进入验收锁定',
    },
    operation: {
      action: '供应商按批次生产发货，物流承运并由采购仓库签收',
      object: '批次 SC31-B7 · 运单 · 12,000 件交付',
      result: '货物到仓，供应商发起验收付款申请',
      hold: '未签收、少件或运输超时，货款保持锁定',
    },
    evidence: {
      action: '物流、仓储、质检与温控设备分别提交本批次证据',
      items: ['运单与电子签收', '温控设备连续记录', '仓储数量与抽检报告'],
      result: '交付数量、运输状态与质量结果按批次号闭合',
      missing: '设备身份无效、温控断点或批次号不一致，拒绝自动验收',
    },
    privateRule: '签收数量 = 订单数量 ∧ 温控无越界 ∧ 抽检全部通过 ∧ 批次未被替换',
    verifyFail: '少件、温控异常或抽检失败，生成拒收/折价分支，不全额付款',
    safety: {
      signals: ['设备证书有效', '质检记录无补录', '供应商账户与订单一致'],
      rule: '物流事实、质量证明和付款主体完整一致才允许结算',
      block: '传感器异常、记录回填或付款账户替换，立即冻结货款',
    },
  },
  'factory-quality': {
    oneLine: '整机厂定义批次标准，供应商生产交付；MES、QMS、实验室和传感器共同证明工艺与质量，再结算货款。',
    subject: '零部件批次 MF71-06 · 整机装配前验收',
    labels: ['定义标准', '批次生产', '工艺质检取证', '全批核验', '质量放行', '节点确认', '批次结算'],
    agreement: {
      object: '批次货款 ¥1,460,000 · 工艺窗口 · 质量阈值',
      rule: '关键工艺不越界 ∧ 良率达标 ∧ 实验室关键尺寸全部合格',
      result: '质量 AC #71 生效，批次标准和结算规则不可单方修改',
    },
    operation: {
      action: '供应商按冻结工艺生产，MES 持续记录设备、配方与批次流转',
      object: '生产批次 MF71-06 · 工艺参数 · 在制品谱系',
      result: '批次生产完成并送检，供应商提交质量结算申请',
      hold: '工艺窗口未闭合或批次谱系断裂，不进入质量验收',
    },
    evidence: {
      action: 'MES、QMS、独立实验室与产线传感器分别提交本批证据',
      items: ['MES 工艺与设备记录', 'QMS 全检与抽检结果', '实验室材料和尺寸报告'],
      result: '工艺、检测与实验室结果按同一批次谱系关联',
      missing: '传感器证书失效、检测补录或批次断链，停止放行',
    },
    privateRule: '批次谱系完整 ∧ 良率 99.3% ∧ 关键尺寸合格 ∧ 配方始终在许可窗口',
    verifyFail: '关键参数越界或实验室结果不合格，整批隔离并发起质量处置',
    safety: {
      signals: ['传感器身份连续', '质检记录不可回写', '批次与供应商绑定'],
      rule: '工艺证据、检测结论和交易主体全部匹配才允许质量放行',
      block: '检测补录、批次替换或异常设备接入，ACVM 阻断结算',
    },
  },
  'factory-energy': {
    oneLine: '生产企业约定节能基线，服务商实施改造；电表、MES 和能源平台共同还原同等工况下的节能量，再按效果付费。',
    subject: '产线节能改造 · 第 3 个效果结算期',
    labels: ['冻结基线', '实施改造', '计量工况取证', '归一化计算', '效果裁决', '双方确认', '节能付款'],
    agreement: {
      object: '效果款 ¥386,000 · 基线模型 · 12% 目标值',
      rule: '按同等产量、产品结构与工况归一化后计算真实节能率',
      result: '节能 AC #84 生效，基线版本与计费公式完成冻结',
    },
    operation: {
      action: '节能服务商完成设备改造并运营，生产企业保持正常生产',
      object: '改造设备清单 · 运行周期 · 产线工况',
      result: '效果周期结束，服务商提交按节能量付费申请',
      hold: '计量周期不足或产线长期停机，不计算效果款',
    },
    evidence: {
      action: '智能电表、MES 与能源平台分别提供能耗、产量和环境数据',
      items: ['电表分钟级读数', 'MES 产量与产品结构', '环境温度与设备工况'],
      result: '能耗和生产工况按同一时间窗完成对齐',
      missing: '电表离线、生产数据缺口或时间窗不一致，延后结算',
    },
    privateRule: '校正产量、产品结构与温度影响后，实际节能率 = 12.6% 且基线未漂移',
    verifyFail: '归一化后未达目标或基线发生漂移，只结算实际达标部分或不付款',
    safety: {
      signals: ['电表身份有效', '基线版本未变', '历史读数无回写'],
      rule: '计量可信、模型固定且付款公式一致才允许效果结算',
      block: '电表替换、基线重算或历史数据回填，冻结效果款',
    },
  },
  'finance-credit': {
    oneLine: '金融机构先给出分段放款规则，供应商履行真实订单；核心企业、物流与票据登记共同证明贸易背景，再释放融资。',
    subject: '应收账款融资 FN-91 · 履约放款',
    labels: ['设定授信', '订单履约', '贸易取证', '真实性核验', '反欺诈控制', '机构确认', '融资放款'],
    agreement: {
      object: '融资 ¥5,000,000 · 应收账款 · 分段放款条件',
      rule: '订单真实 ∧ 货物已交付 ∧ 发票有效 ∧ 应收账款未重复质押',
      result: '融资 AC #91 生效，额度、用途和受益人身份锁定',
    },
    operation: {
      action: '融资供应商按核心企业订单生产发货，并形成真实应收账款',
      object: '采购订单 · 发货批次 · 应收账款编号',
      result: '核心企业签收货物，供应商发起本段融资申请',
      hold: '订单未履约或核心企业未签收，不释放融资额度',
    },
    evidence: {
      action: '核心企业、物流、电子发票与质押登记分别提供最小化证明',
      items: ['核心企业订单与签收', '物流轨迹与交付回单', '发票和质押登记状态'],
      result: '订单、货流、票流和融资登记按同一贸易编号闭合',
      missing: '任一贸易要素无法对应，申请转入人工尽调',
    },
    privateRule: '订单金额 = 发票与应收范围 ∧ 交付真实 ∧ 未重复融资 ∧ 风险规则通过',
    verifyFail: '贸易链不闭合、重复质押或关联交易异常，拒绝本段放款',
    safety: {
      signals: ['用途限定为订单履约', '查询范围不含无关经营数据', '受款人为已核验供应商'],
      rule: '贸易真实性、授权边界和反欺诈策略同时通过才允许放款',
      block: '批量越权查询、关联账户替换或重复质押，ACVM 阻断指令',
    },
  },
  'finance-insurance': {
    oneLine: '企业报案后，保单、物流轨迹与查勘影像共同还原事故；责任和损失都满足条款，保险款才自动赔付。',
    subject: '货运险理赔 FN-26 · 运输事故 2026-07-18',
    labels: ['保单生效', '运输报案', '事故取证', '责任定损', '反欺诈控制', '双方确认', '保险赔付'],
    agreement: {
      object: '保额 · 承保路线 · 免赔与责任条款',
      rule: '事故发生在承保期和路线内，责任成立且损失超过免赔额',
      result: '理赔 AC #26 与保单、车辆、货物和被保险人完成绑定',
    },
    operation: {
      action: '被保险企业组织运输，事故发生后按时定位报案并保护现场',
      object: '报案时间 · 车辆位置 · 受损货物清单',
      result: '保险机构受理报案，启动自动核验与定损',
      hold: '逾期报案、车辆或货物不在保单范围内，不进入自动赔付',
    },
    evidence: {
      action: '保单系统、物流定位和独立查勘分别提交事故证据',
      items: ['有效保单与责任条款', '连续物流轨迹', '带时间位置签名的损失影像'],
      result: '承保对象、事故时间地点和损失项目完成关联',
      missing: '轨迹中断、影像无签名或查勘对象不一致，转人工查勘',
    },
    privateRule: '事故在承保区间 ∧ 轨迹连续 ∧ 影像未复用 ∧ 定损价格符合条款',
    verifyFail: '责任不成立、影像复用或定损超范围，拒赔或调整赔付金额',
    safety: {
      signals: ['报案未重复', '查勘员身份有效', '被保险人账户未变更'],
      rule: '保单责任、事故证据、反欺诈和账户身份全部通过才允许赔付',
      block: '重复报案、影像复用或临时改账户，ACVM 立即阻断赔款',
    },
  },
  'education-training': {
    oneLine: '就业部门按真实成效采购培训，机构负责教学；学习、考试和就业系统分别证明过程与结果，达标后再结算。',
    subject: '职业技能培训 ED-52 · 160 人班次',
    labels: ['约定成效', '教学服务', '学考就取证', '成效核验', '防刷控制', '部门确认', '培训结算'],
    agreement: {
      object: '培训款 ¥420,000 · 课程 · 考试与稳定就业指标',
      rule: '真实学习完成 ∧ 考试通过 ∧ 非挂靠稳定就业达到约定周期',
      result: '培训 AC #52 生效，学员范围和成效计费规则固定',
    },
    operation: {
      action: '培训机构组织课程、实训、考试与就业服务，学员持续参与',
      object: '课程班次 · 学习记录 · 考试批次 · 就业服务',
      result: '班次结束，培训机构提交按就业成效结算申请',
      hold: '课程未完成或就业观察期未结束，不计算最终成效',
    },
    evidence: {
      action: '教学平台、考试机构和人社就业系统分别返回签名证明',
      items: ['学习时长与实训记录', '实名考试与证书', '社保就业与在岗周期'],
      result: '学、考、就三段记录按学员匿名凭证连续关联',
      missing: '身份无法贯通、考试缺签或就业周期不足，对应学员不计费',
    },
    privateRule: '排除代学代考、重复证书和短期挂靠后，确认 121 人通过并稳定就业',
    verifyFail: '异常考勤、证书复用或就业挂靠比例超限，扣除对应结算人数',
    safety: {
      signals: ['仅核验本班学员', '个人数据留在人社与教育域', '机构账户与合同一致'],
      rule: '最小化查询、实名连续性和成效规则全部通过才允许结算',
      block: '批量越权查人、代刷考勤或证书复用，ACVM 阻断本批付款',
    },
  },
  'education-research': {
    oneLine: '高校先固定科研里程碑，团队持续实验；代码版本、伦理审批与设备记录共同证明阶段成果，再拨付下一阶段经费。',
    subject: '科研项目 ED-37 · 第二阶段里程碑',
    labels: ['固定任务书', '持续研究', '成果过程取证', '里程碑证明', '合规控制', '资助方确认', '阶段拨款'],
    agreement: {
      object: '阶段经费 ¥1,200,000 · 任务书 · 验收与伦理规则',
      rule: '成果版本达到目标 ∧ 伦理审批有效 ∧ 实验与设备记录连续',
      result: '科研 AC #37 生效，目标、责任人和阶段拨款规则固定',
    },
    operation: {
      action: '科研团队持续数月完成实验、代码迭代和阶段成果',
      object: '状态承诺 M1…M6 · 成果版本 v2.4 · 实验批次',
      result: '第二阶段完成，团队提交里程碑完成证明申请',
      hold: '连续状态承诺中断或阶段目标未完成，不触发下一笔经费',
    },
    evidence: {
      action: '科研仓库、伦理系统和设备平台分别证明成果形成过程',
      items: ['代码与成果版本历史', '伦理审批与变更记录', '实验设备使用和数据承诺'],
      result: '版本、审批、实验批次与长期状态承诺形成连续证据链',
      missing: '版本历史断裂、伦理批件过期或设备记录缺失，暂停验收',
    },
    privateRule: '目标电路满足 ∧ M1…M6 状态承诺连续 ∧ 伦理有效 ∧ 成果未重复用于其他项目',
    verifyFail: '目标未达成、成果重复使用或过程承诺不连续，不生成完成证明',
    safety: {
      signals: ['仅验证任务书要求', '未公开成果不离开校内', '经费科目和项目账户一致'],
      rule: '里程碑证明、合规边界和经费用途全部通过才允许拨款',
      block: '越权导出资料、补写实验记录或变更项目账户，ACVM 阻断拨款',
    },
  },
};

function getAcvmStages(story: Story): FlowStage[] {
  const participants = storyParticipants[story.id];
  return [
    { key: 'publish', label: '发布合约', tag: '发布者身份已签名', title: `${story.source}发布“${story.title}” AgenticContract`, detail: '合约绑定组织身份、责任主体、业务目标、结算规则和可撤销凭证。', artifact: `${story.contract} · ${story.amount}`, actors: ['initiator', 'operator'] },
    { key: 'discover', label: '发现能力', tag: 'PROGRESSIVE API', title: `ACVM Agent 逐级发现业务能力：${story.api}`, detail: '先 list、describe、dry-run，确认工具语义与影响范围后申请最小执行权限。', artifact: 'list → describe → dry-run → execute', actors: ['acvm', 'evidence'] },
    { key: 'private', label: '隐私推理', tag: 'A3S-BOX + A3S-POWER', title: story.privateTitle, detail: story.privateDetail, artifact: `加密数据 → TEE → ${story.receiptLabel} 前置结论`, actors: ['evidence', 'acvm'] },
    { key: 'zero-trust', label: '逐次授权', tag: 'ZERO TRUST · RE-AUTH', title: story.zeroTrustTitle, detail: '每次工具调用都重新检查合约身份、短期凭据、设备状态与请求上下文。', artifact: '短期凭据 · 请求上下文 · 最小权限', actors: ['evidence', 'acvm'] },
    { key: 'capability', label: '交叉核验', tag: 'SIGNED EVIDENCE', title: story.verification, detail: story.verificationDetail, artifact: `${participants.evidence.name} → 签名证据包`, actors: ['operator', 'evidence', 'acvm'] },
    { key: 'sentry', label: '风险控制', tag: 'ANYSENTRY · ALLOW', title: story.sentry, detail: 'AnySentry 综合身份、工具、数据流和行为信号返回决定；ACVM 负责执行控制。', artifact: 'Policy v3.8 · ALLOW · 可追责', actors: ['acvm'] },
    { key: 'consensus', label: '共同确认', tag: 'CONSORTIUM CONSENSUS', title: story.consensus, detail: '业务方、执行方和审计节点按联盟治理规则确认同一执行事实。', artifact: `${story.nodes[0]}节点 · ${story.nodes[1]}节点 · 审计节点`, actors: ['initiator', 'operator', 'ledger'] },
    { key: 'receipt', label: '结算留证', tag: 'SETTLED + SEALED', title: story.receipt, detail: 'ACVM 执行付款或拨付，并将身份、证据根、规则版本、风险决定和结果封装为链上凭证。', artifact: `${story.receiptLabel} · ${story.amount}`, actors: ['operator', 'acvm', 'ledger'] },
  ];
}

function getLegacyStages(story: Story): FlowStage[] {
  const participants = storyParticipants[story.id];
  return [
    { key: 'legacy-inference', label: '链外上报', tag: 'SOURCE UNKNOWN', title: story.legacyInference, detail: `传统链收到的是 ${participants.operator.name} 或业务系统给出的结论，无法理解形成过程。`, artifact: `${participants.evidence.name} → 单一上报字段`, actors: ['operator', 'evidence'] },
    { key: 'legacy-wallet', label: '钱包签名', tag: 'KEY HOLDER ONLY', title: `共享钱包地址提交 ${story.amount} 交易`, detail: '钱包只能证明私钥持有人，不能证明具体 Agent、责任主体、工具能力和授权边界。', artifact: '0x8A…91F · shared key', actors: ['acvm'] },
    { key: 'legacy-execute', label: '静态执行', tag: 'INPUT ACCEPTED', title: '传统虚拟机按传入字段执行规则', detail: story.legacyExecution, artifact: 'if input == true → transfer', actors: ['acvm', 'ledger'] },
    { key: 'legacy-hash', label: '交易留痕', tag: 'CONTEXT MISSING', title: '链上只留下交易哈希 0x7F21', detail: '能够证明交易发生过，却无法回答真实参与方如何协同、证据是否可信、为何允许执行。', artifact: 'tx 0x7F21 · evidence unavailable', actors: ['ledger'] },
  ];
}

const stageIcons: Record<string, IconName> = {
  publish: 'fingerprint',
  discover: 'terminal',
  private: 'lock',
  'zero-trust': 'shield',
  capability: 'eye',
  sentry: 'shield',
  consensus: 'chain',
  receipt: 'receipt',
  'legacy-inference': 'eye',
  'legacy-wallet': 'key',
  'legacy-execute': 'terminal',
  'legacy-hash': 'chain',
};

export function TrustFlow({ storyId = 'ads', active = true }: { storyId?: StoryId; active?: boolean }) {
  const reducedMotion = useReducedMotion();
  const [mode, setMode] = useState<FlowMode>('acvm');
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const story = storyOptions.find((item) => item.id === storyId) ?? storyOptions[0];
  const participants = storyParticipants[story.id];
  const acvmStages = getAcvmStages(story);
  const legacyStages = getLegacyStages(story);
  const stages = mode === 'acvm' ? acvmStages : legacyStages;
  const current = stages[stage];
  const isLegacy = mode === 'legacy';
  const receiptReady = stage === stages.length - 1;

  const actors: Array<{ key: ActorKey; type: string; name: string; role: string; icon: IconName }> = [
    { key: 'initiator', type: '发起方', ...participants.initiator, icon: 'fingerprint' },
    { key: 'operator', type: '执行方', ...participants.operator, icon: 'bolt' },
    { key: 'evidence', type: '证据协同方', ...participants.evidence, icon: 'terminal' },
    {
      key: 'acvm',
      type: isLegacy ? '链外服务' : '可信执行中枢',
      name: isLegacy ? '共享钱包 · 传统 VM' : 'ACVM Agent',
      role: isLegacy ? '接收上报字段并触发静态规则' : '调用工具、核验证据并落实控制',
      icon: isLegacy ? 'key' : 'shield',
    },
    {
      key: 'ledger',
      type: '共识与审计方',
      name: `${story.nodes[0]}节点 · ${story.nodes[1]}节点 · 审计节点`,
      role: isLegacy ? '记录交易结果' : '共同确认执行事实并封存凭证',
      icon: 'chain',
    },
  ];

  const actorNames = Object.fromEntries(actors.map((actor) => [actor.key, actor.name])) as Record<ActorKey, string>;

  useEffect(() => {
    if (!active || reducedMotion || !playing) return;
    const timer = window.setInterval(() => {
      setStage((value) => (value + 1) % stages.length);
    }, isLegacy ? 3000 : 2750);
    return () => window.clearInterval(timer);
  }, [active, isLegacy, playing, reducedMotion, stages.length]);

  useEffect(() => {
    if (!active) return;
    setStage(0);
    setPlaying(true);
  }, [active, storyId]);

  const switchMode = (nextMode: FlowMode) => {
    setMode(nextMode);
    setStage(0);
    setPlaying(true);
  };

  return (
    <div
      className={`trust-demo trust-demo--${current.key} ${isLegacy ? 'trust-demo--legacy' : 'trust-demo--acvm'}`}
      data-testid="trust-flow"
      style={{ '--stage-count': stages.length } as React.CSSProperties}
    >
      <div className="demo-window-bar demo-window-bar--compare">
        <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
        <div className="flow-mode-switch" role="group" aria-label="对比传统区块链合约和 ACVM">
          <button type="button" className={isLegacy ? 'is-active' : ''} onClick={() => switchMode('legacy')} aria-pressed={isLegacy}>传统区块链合约</button>
          <button type="button" className={!isLegacy ? 'is-active' : ''} onClick={() => switchMode('acvm')} aria-pressed={!isLegacy}>ACVM AgenticContract</button>
        </div>
        <button
          className="demo-control"
          type="button"
          onClick={() => {
            if (reducedMotion) setStage((stage + 1) % stages.length);
            else setPlaying((value) => !value);
          }}
          aria-label={reducedMotion ? '播放下一步' : playing ? '暂停动画' : '继续动画'}
        >
          <Icon name={reducedMotion || !playing ? 'play' : 'pause'} />
          <span>{reducedMotion ? '下一步' : playing ? '暂停' : '继续'}</span>
        </button>
      </div>

      <div className="business-flow-scene">
        <div className="business-actor-rail" aria-label={`${story.title}参与方协同`}>
          {actors.map((actor, index) => {
            const isActiveActor = current.actors.includes(actor.key);
            const hasActed = stages.slice(0, stage).some((item) => item.actors.includes(actor.key));
            return (
              <div className="business-actor-wrap" key={actor.key}>
                <article className={isActiveActor ? 'is-active' : hasActed ? 'is-done' : ''} data-actor={actor.key}>
                  <header><span><Icon name={actor.icon} /></span><small>{actor.type}</small></header>
                  <strong>{actor.name}</strong>
                  <p>{actor.role}</p>
                  <em>{isActiveActor ? '正在协同' : hasActed ? '已完成动作' : '等待进入'}</em>
                </article>
                {index < actors.length - 1 ? <i className={isActiveActor || current.actors.includes(actors[index + 1].key) ? 'is-live' : ''}><Icon name="arrow" /></i> : null}
              </div>
            );
          })}
        </div>

        <div className={`business-handoff ${isLegacy ? 'is-legacy' : ''}`}>
          <span><Icon name={stageIcons[current.key] ?? 'spark'} /></span>
          <div>
            <small>当前协同 · {current.actors.map((actor) => actorNames[actor]).join(' ↔ ')}</small>
            <strong>{current.artifact}</strong>
          </div>
          <em>{isLegacy ? '链上只收到结果字段' : `STEP ${stage + 1} / ${stages.length}`}</em>
          <i aria-hidden="true" />
        </div>

        <div className="business-execution-grid">
          <div className="business-stage-explanation" aria-live="polite">
            <span className="narrative-index">0{stage + 1}</span>
            <div>
              <span className="narrative-tag"><i /> {current.tag}</span>
              <strong>{current.title}</strong>
              <p>{current.detail}</p>
            </div>
          </div>

          {isLegacy ? (
            <div className="legacy-context-gap">
              <header><Icon name="eye" /><span><small>传统链的上下文断点</small><strong>只能验证签名和输入，不能验证业务过程</strong></span></header>
              <p>{story.legacyExecution}</p>
              <div><span>参与方身份未知</span><span>工具过程不可见</span><span>隐私计算不可证</span><span>安全决定未闭环</span></div>
            </div>
          ) : (
            <div className="control-checkpoints" aria-label="ACVM 控制与证据检查点">
              <div className={stage >= 0 ? 'is-on' : ''}><Icon name="fingerprint" /><span><small>身份合约</small><strong>{story.contract}</strong></span></div>
              <div className={stage >= 1 ? 'is-on' : ''}><Icon name="terminal" /><span><small>渐进式 API</small><strong>先理解，再执行</strong></span></div>
              <div className={stage >= 2 ? 'is-on' : ''}><Icon name="lock" /><span><small>隐私推理</small><strong>a3s-box · a3s-power</strong></span></div>
              <div className={stage >= 3 ? 'is-on' : ''}><Icon name="shield" /><span><small>零信任</small><strong>每次请求重新验证</strong></span></div>
              <div className={stage >= 5 ? 'is-on' : ''}><Icon name="eye" /><span><small>AnySentry</small><strong>{stage >= 5 ? 'ALLOW · ACVM 执行' : '等待风险决定'}</strong></span></div>
              <div className={stage >= 6 ? 'is-on' : ''}><Icon name="chain" /><span><small>联盟共识</small><strong>{stage >= 6 ? '多方确认并留证' : '等待业务事实'}</strong></span></div>
            </div>
          )}
        </div>

        <div className={`business-settlement ${receiptReady ? 'is-ready' : ''}`}>
          <span><Icon name={receiptReady ? 'check' : 'receipt'} /></span>
          <div><small>{receiptReady ? '协同闭环完成' : '最终业务结果'}</small><strong>{receiptReady ? (isLegacy ? '交易发生，但依据不可审计' : story.receipt) : `${participants.operator.name}等待核验与结算`}</strong></div>
          <em>{receiptReady ? (isLegacy ? '0x7F21' : story.receiptLabel) : story.amount}</em>
        </div>
      </div>

      <div className="trust-steps" aria-label={isLegacy ? '传统区块链合约执行步骤' : 'ACVM 端到端执行步骤'}>
        {stages.map((item, index) => (
          <button
            className={index === stage ? 'is-active' : index < stage ? 'is-passed' : ''}
            key={item.key}
            type="button"
            onClick={() => {
              setStage(index);
              setPlaying(false);
            }}
            aria-current={index === stage ? 'step' : undefined}
          >
            <span>{index < stage || receiptReady ? <Icon name="check" /> : index + 1}</span>
            <small>{item.label}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
