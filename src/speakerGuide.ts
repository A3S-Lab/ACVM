import type { ScreenId } from './deck';

export type SpeakerGuideEntry = {
  duration: string;
  focus: string;
  example: string;
  beats: readonly [string, string];
};

export const speakerGuides = {
  top: {
    duration: '0:15',
    focus: 'ACVM 让 AI 服务按已验证结果付费。',
    example: 'GEO 优化或联合数据产品交付后，先验收结果，再释放结果费。',
    beats: ['付款依据是已验证结果，不是一次成功调用。', '当前目标是跑通一笔可审计的小额试点。'],
  },
  'product-snapshot': {
    duration: '0:40',
    focus: 'ACVM 把目标、证据、裁决和资金状态绑定为一笔结果订单。',
    example: 'GEO 服务签约时约定 30 天引用份额提升 8pp，独立复测达标后自动释放结果费。',
    beats: ['签约时冻结目标、证据、预算和挑战规则。', '独立验收通过后生成付款指令。'],
  },
  'product-thesis': {
    duration: '0:40',
    focus: 'ACVM 连接执行回执、结果裁决与资金结算。',
    example: 'GEO Worker 更新内容，观察方独立复测，ACVM 给出裁决，现有支付系统按裁决放款。',
    beats: ['Worker 或 A3S 负责执行并提交回执。', 'ACVM 固定规则并生成 ValidPoI；资金终局仍由现有系统负责。'],
  },
  'geo-verification': {
    duration: '0:50',
    focus: 'GEO 按独立观测到的增量结算，不按内容数量结算。',
    example: '试点示例：引用份额从 14.2% 提升到 25.8%，增量 11.6pp，超过签约门槛 8pp。',
    beats: ['签约前冻结问题集、基线、观察窗口和排除项。', '复测由独立观察方完成，服务方不能自己报成绩。'],
  },
  'data-space': {
    duration: '0:55',
    focus: '多方数据形成联合数据产品，验收后由 ACVM 按约分配收益。',
    example: '试点示例：设备厂提供设备参数，工厂提供运行数据，维保商提供故障工单，共同形成预测性维护数据产品；停机时长达到改善目标后，三方按事前规则分配收益。',
    beats: ['空间连接器记录每一方的授权、实际用数和谱系。', 'UsageProof 与 AcceptedResult 同时通过后，ACVM 才按 splitRoot 释放结果池。'],
  },
  'geo-poi-boundary': {
    duration: '0:40',
    focus: '跨组织结果协作应使用 ACVM。',
    example: '设备厂、工厂与维保商共同交付预测性维护产品，由 ACVM 统一验收停机改善结果并按约分账。',
    beats: ['高价值订单事前冻结验收、挑战和结算规则。', '独立裁决与唯一 taskId 形成可追责记录。'],
  },
  'system-architecture': {
    duration: '0:45',
    focus: '一笔订单只有规则、执行、证据、裁决和结算五步。',
    example: '预测性维护订单先约定“停机时长下降 15%”，再执行模型、提交日志、独立验收，最后按结果分账。',
    beats: ['每一步只新增一种可核对的签名记录。', '同一个 taskId 只能形成一次结算。'],
  },
  'verification-engine': {
    duration: '0:45',
    focus: '技术证明与业务证据缺一不可。',
    example: 'TEE 证明预测模型在指定环境运行；工厂停机记录证明业务目标达标。',
    beats: ['复算、挑战、TEE 或 zkML 证明任务执行过程。', '冻结口径、独立观测和业务规则证明结果达标。'],
  },
  'economy-roles': {
    duration: '0:50',
    focus: '结果池、验证成本和违规保证金分开处理。',
    example: '示例预算 12 万元：10 万元是条件结果池，2 万元覆盖证据、验证、协议和准备金。',
    beats: ['达标时结果池付给 GEO Worker，或按 splitRoot 分给多方数据贡献者。', '未达标退回结果池；只有证据造假等可证明违规才罚没保证金。'],
  },
  'security-boundaries': {
    duration: '0:45',
    focus: '真实订单、唯一任务和独立验证共同抬高作弊成本。',
    example: '服务方自建关联公司下单，再把同一输出重复提交，就可能伪造“有效需求”和收入。',
    beats: ['签名订单、预算托管和唯一 taskKey 控制虚假需求与重放。', '独立证据源、随机 Validator、挑战和罚没控制伪造与串谋。'],
  },
  'product-roadmap': {
    duration: '0:40',
    focus: '当前有执行底座与产品规范，最小结算闭环仍待实现。',
    example: '当前可以演示 SignedDemand、证据和裁决流程，但还不能宣称已接入生产支付或生产链。',
    beats: ['A3S 提供开源执行组件；ACVM 当前交付规范与演示。', '下一项是任务适配、回执绑定、裁决状态机和小额结算。'],
  },
  simulation: {
    duration: '0:45',
    focus: '隐私数据留在本地，只公开聚合结果和验证证明。',
    example: '例如多家机构评估公共服务方案，各自保留人群数据，只提交加密统计和置信区间。',
    beats: ['先冻结模型、样本承诺、随机过程和隐私预算。', 'Validator 复核统计管线，不把模拟结论当作现实事实。'],
  },
  'useful-work': {
    duration: '0:50',
    focus: '相对质量、执行正确、经济安全和业务达标是四类命题。',
    example: '预测网络的高评分可以分配网络激励，但不能直接证明某家企业的签名订单已经达标。',
    beats: ['现有网络能力可以作为执行证明或经济安全底座。', 'ACVM 负责把签名订单的业务裁决连接到结算。'],
  },
  'execution-boundary': {
    duration: '0:45',
    focus: 'Worker 执行一次，节点验证回执和状态变化。',
    example: '采购 Agent 发送真实订单会产生外部副作用，不能让每个共识节点重复发送一次。',
    beats: ['GPU 推理、私有数据和外部工具不适合全网重放。', '节点只检查签名、承诺、证明、裁决和确定性结算状态。'],
  },
  ans: {
    duration: '0:35',
    focus: 'ANS 可返回带签名的服务卡，但不是试点前提。',
    example: '示例服务卡 geo.optimize.ans 可列出端点、版本、价格和历史任务量；这些字段仍需签名核验。',
    beats: ['名称解析提供服务发现。', '调用方核验签名、撤销、信誉样本量和交易规则。'],
  },
  'agentic-contract': {
    duration: '0:45',
    focus: '智能体合约用签名回执推进长任务状态。',
    example: '采购 Agent 可能运行三天并等待人工审批；Worker 不能因为完成一次工具调用就自行宣布订单完成。',
    beats: ['Schema 固定输入、结果、证据和裁决格式。', '超时、拒绝、挑战和付款都有明确状态转换。'],
  },
  'fog-inference': {
    duration: '0:40',
    focus: '原始数据不出域，链上只接收结果根和证明。',
    example: '工厂摄像头画面留在厂区节点，外部只接收缺陷统计、模型版本和运行证明。',
    beats: ['本地隔离环境运行模型并生成回执。', 'Validator 验证明和结果，公共节点不接触原始数据。'],
  },
  'poi-proof': {
    duration: '0:40',
    focus: 'PoI 必须同时证明真实需求、结果达标、执行可查和不可重放。',
    example: '同一个预测结果即使被复制到两个订单，也只能由匹配的签名需求和唯一 taskKey 领取一次费用。',
    beats: ['SignedDemand 证明真实订单与预算。', 'AcceptedResult、ExecutionEvidence 和 AntiReplay 共同决定能否生成 ValidPoI。'],
  },
  'poi-consensus': {
    duration: '0:35',
    focus: 'PoI 可用于未来提议权重；终局由法定人数确认。',
    example: '即使某个 Worker 积累了更多 ValidPoI，它最多提高被抽中提议区块的概率，不能单独确认区块。',
    beats: ['权重需要按任务类型归一、封顶和衰减。', '最终确认仍由其他节点验块并达到法定人数。'],
  },
  'deployment-modes': {
    duration: '0:45',
    focus: 'ACVM 复用既有身份、支付和终局，适配接口在试点中落地。',
    example: '国内试点可把任务根和裁决根写入联盟链，人民币仍通过合规托管支付；开放模式可另行评估 AVS。',
    beats: ['原始数据、Prompt 和详细证据留在受控存储。', '具体链、身份和支付接口必须在试点选型后实现并验收。'],
  },
} as const satisfies Record<ScreenId, SpeakerGuideEntry>;
