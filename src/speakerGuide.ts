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
    duration: '0:50',
    focus: 'ACVM 把目标、证据、裁决和付款绑定为一笔结果订单。',
    example: 'GEO Worker 更新内容，观察方独立复测；ACVM 判定引用增量达标后，现有支付系统释放结果费。',
    beats: ['签约时冻结目标、证据、预算和挑战规则。', '执行层提交回执，ACVM 负责裁决，支付或链完成资金终局。'],
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
  'system-architecture': {
    duration: '0:55',
    focus: '一笔订单用技术证明和业务证据完成五步闭环。',
    example: '预测性维护订单中，TEE 回执证明模型按约运行，工厂停机记录证明时长下降 15%；两类证据都通过后才分账。',
    beats: ['规则、执行、双证据、裁决和结算都绑定同一个 taskId。', '技术证明验执行，业务证据验结果；同一订单只能结算一次。'],
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
  'execution-boundary': {
    duration: '0:45',
    focus: 'Worker 执行一次，节点验证回执和状态变化。',
    example: '采购 Agent 发送真实订单会产生外部副作用，不能让每个共识节点重复发送一次。',
    beats: ['GPU 推理、私有数据和外部工具不适合全网重放。', '节点只检查签名、承诺、证明、裁决和确定性结算状态。'],
  },
  'agentic-contract': {
    duration: '0:45',
    focus: '智能体合约用签名回执推进长任务状态。',
    example: '采购 Agent 可能运行三天并等待人工审批；Worker 不能因为完成一次工具调用就自行宣布订单完成。',
    beats: ['Schema 固定输入、结果、证据和裁决格式。', '超时、拒绝、挑战和付款都有明确状态转换。'],
  },
  'poi-proof': {
    duration: '0:45',
    focus: 'PoI 是结果验收后的结算凭证。',
    example: '同一个预测结果即使被复制到两个订单，也只有同时匹配签名需求、验收结果、执行回执和唯一 taskKey 的订单可以领取一次费用。',
    beats: ['SignedDemand 证明真实订单与预算，AcceptedResult 证明结果已按约通过。', 'ExecutionEvidence 与 AntiReplay 保证执行可查且不能重复结算。'],
  },
  'deployment-modes': {
    duration: '0:45',
    focus: 'ACVM 复用既有身份、支付和终局，适配接口在试点中落地。',
    example: '国内试点可把任务根和裁决根写入联盟链，人民币仍通过合规托管支付；开放模式可另行评估 AVS。',
    beats: ['原始数据、Prompt 和详细证据留在受控存储。', '具体链、身份和支付接口必须在试点选型后实现并验收。'],
  },
} as const satisfies Record<ScreenId, SpeakerGuideEntry>;
