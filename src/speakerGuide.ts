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
    focus: 'ACVM 把已验收的有效推理转成可验证、可结算、可分配的链上价值。',
    example: '示例：设备厂把故障诊断智能体发布为服务；工厂提交诊断订单，结果通过独立验收后，ACVM 向所有者付款并生成 ValidPoI。',
    beats: ['真实需求、结果验收、执行证明和防重放同时成立，推理才形成 ValidPoI。', 'ValidPoI 可触发付款与多方分账，也可形成有界的 PoI 候选权重。'],
  },
  'product-snapshot': {
    duration: '0:50',
    focus: 'ACVM 把目标、证据、裁决和付款绑定为一笔结果订单。',
    example: 'GEO Worker 更新内容，观察方独立复测；ACVM 判定引用增量达标后，现有支付系统释放结果费。',
    beats: ['签约时冻结目标、证据、预算和挑战规则。', '执行层提交回执，ACVM 负责裁决，支付或链完成资金终局。'],
  },
  'poi-proof': {
    duration: '0:45',
    focus: 'PoI 是结果验收后的结算凭证。',
    example: '同一个预测结果即使被复制到两个订单，也只有同时匹配签名需求、验收结果、执行回执和唯一 taskKey 的订单可以领取一次费用。',
    beats: ['SignedDemand 证明真实订单与预算，AcceptedResult 证明结果已按约通过。', 'ExecutionEvidence 与 AntiReplay 保证执行可查且不能重复结算；共识权重由后续算法另行计算。'],
  },
  'useful-work': {
    duration: '0:50',
    focus: 'PoI 把无链外产出的哈希搜索，换成能交付业务结果的模型推理。',
    example: '示例：GPU 不再反复尝试 nonce，而是对匿名化订单运行异常检测，交付异常清单、模型版本和执行证据。',
    beats: ['PoI 改变的是工作量来源：从哈希搜索改为真实推理。', '结果验收、付款与共识权重分别由 ACVM 裁决、PoI 凭证和共识算法完成。'],
  },
  'geo-verification': {
    duration: '0:50',
    focus: 'GEO 按独立观测到的增量结算，不按内容数量结算。',
    example: '试点示例：引用份额从 14.2% 提升到 25.8%，增量 11.6pp，超过签约门槛 8pp。',
    beats: ['签约前冻结问题集、基线、观察窗口和排除项。', '复测由独立观察方完成，服务方不能自己报成绩。'],
  },
  'agent-rental': {
    duration: '0:55',
    focus: '智能体所有者保留模型与私有资产，也能按已验收结果获得服务收益。',
    example: '示例：设备厂开放故障诊断智能体，工厂按批次提交订单；模型留在所有者或雾节点，Validator 根据维修工单验收后，ACVM 再释放结果费。',
    beats: ['ANS 服务卡先绑定智能体身份、能力、接口与调用条件，租用方再签署任务和验收规则。', 'A3S 隔离执行并提交回执；AcceptedResult 触发付款和 ValidPoI，组合服务可按 splitRoot 分账。'],
  },
  simulation: {
    duration: '0:50',
    focus: '社会模拟在不公开个体数据的前提下交付可验证的群体结果。',
    example: '示例：多家机构在本地运行同一政策仿真，只提交加密统计；ACVM 核验冻结的模型、样本和随机种子后，对群体指标与置信区间完成验收。',
    beats: ['模型、样本承诺、随机过程和隐私预算在运行前冻结。', '协议能证明实验按约运行，不能把模拟结论当成现实事实。'],
  },
  'poi-consensus': {
    duration: '0:50',
    focus: '已验收的 PoI 先按任务类别归一，再变成有界权重、VRF 抽签和 BFT 终局。',
    example: '示例：GEO、智能体租赁和社会模拟不直接按订单金额比较，而是在各自类别内归一、封顶和衰减，避免高价任务直接垄断提议机会。',
    beats: ['贡献分数只来自已终局的 PoI，不接受 Worker 自报成本或分值。', '权重只影响候选概率；其他节点仍重验交易与状态，并由 BFT 法定人数完成终局。'],
  },
  'system-architecture': {
    duration: '1:05',
    focus: '一笔订单在同一 taskId 下完成验收、资金处理和风险控制。',
    example: '示例预算 12 万元：故障诊断通过后，10 万元结果池按 splitRoot 分账，2 万元支付证据与验证；正常未达标退回结果池，伪造维修工单才罚没保证金。',
    beats: ['签名订单、a3s-box 回执、独立业务证据和 FinalVerdict 沿用同一 taskId，taskKey 防止重复结算。', 'Accepted 触发分账与 ValidPoI，Rejected 只退款，Fraud 才触发保证金罚没；验证成本按真实工作结算。'],
  },
  ans: {
    duration: '0:40',
    focus: 'ANS 用签名服务卡证明智能体的身份、能力、端点和调用条件。',
    example: '工厂 Agent 查询 diagnose.machine.ans，取得端点、能力、报价和有效期；核验签名与撤销状态后再创建租赁订单。',
    beats: ['服务卡把名称解析为可核验的身份、接口和交易条件。', '历史回执提供履约参考，不能替代本次订单的独立验收。'],
  },
  'fog-inference': {
    duration: '0:45',
    focus: 'a3s-box 在雾节点建立本地隐私执行边界，只把结果和签名回执送往外部。',
    example: '工厂质检图像进入厂区 a3s-box MicroVM；网络白名单、只读模型和临时数据卷限制数据流向，任务结束后销毁数据卷，外部只接收缺陷统计与 ExecReceipt。',
    beats: ['租约把 taskId、镜像、网络策略、资源上限和截止时间固定到同一个 a3s-box 实例。', '原始图像不出本地数据域；ACVM 只核验 ExecReceipt、outputRoot 与独立业务证据。'],
  },
  'execution-boundary': {
    duration: '0:55',
    focus: '链下可信由规则承诺、执行验证、结果验证和防重放四个确定条件共同生成。',
    example: '示例：采购 Agent 完成供应商询价后，TEE 回执证明指定模型、工具和权限按约运行；真实采购单与到货记录再证明业务目标完成。两类证据通过 Validator 法定人数确认后才生成 ValidPoI 并付款。',
    beats: ['承诺 C 固定任务、输入、模型、策略、验收和分账；ExecOK 再验证 πexec、outputRoot 与本次 nonce 的绑定。', '有效签名票达到阈值 q 才得到 OutcomeOK；只有 taskKey 未消费，δACVM 才能用 AcceptedResult 推进链上状态。'],
  },
  'a3s-box': {
    duration: '0:55',
    focus: 'a3s-box 为本地 OCI 工作负载固定可恢复、可审计的隔离执行边界。',
    example: '示例：非可信 Validator 镜像默认进入专用内核 MicroVM，CPU、内存和网络策略随任务持久化，并记录启动、exec、日志、退出与清理事件。',
    beats: ['a3s-box 管理镜像、构建、网络、卷、快照、健康、重启、日志和清理。', '默认 MicroVM 与显式 Sandbox 之间不静默降级，恢复时沿用原后端和策略。'],
  },
  'a3s-power': {
    duration: '1:00',
    focus: 'a3s-power 在 TEE 内保护数据与模型，并以参数按层加载实现流式推理。',
    example: '示例：picolm 运行 7B+ GGUF 模型时，只把当前计算层所需参数载入可信内存，完成计算后立即释放，使 512MB 级 TEE EPC 也能承载大模型推理。',
    beats: ['SEV-SNP 或 TDX、远程证明、加密模型、日志脱敏和内存清零共同保护提示词、响应与模型权重。', '流式推理指活跃层参数按层载入、计算并释放，峰值内存接近单层规模，而不是完整模型规模。'],
  },
  'deployment-modes': {
    duration: '0:45',
    focus: 'ChainAdapter 把 ACVM 的统一任务状态，映射到国内区块链的身份、事件和终局接口。',
    example: '实施示例：GEO 任务在 A3S 执行并由 ACVM 形成 taskRoot、verdictRoot 和 poiRoot；长安链 Driver 将这些标准状态写入合约，再把终局回执返回 ACVM。',
    beats: ['A3S 执行域保留原始数据、模型与详细证据；ChainAdapter 只处理标准状态和链上最小记录。', 'BSN、星火链网、长安链与 FISCO BCOS 分别实现 Driver，ACVM 上层语义保持一致。'],
  },
  'native-chain': {
    duration: '1:00',
    focus: 'Rust 原生链用异步状态机把 PoI Worker 变成链上 ACVM 的模型推理服务层。',
    example: '示例：链上理赔合约发布票据一致性识别任务；PoI Worker 运行指定视觉模型，Validator 结合保单规则与人工复核验收，AcceptedResult 恢复合约并结算，同时形成 ValidPoI。',
    beats: ['任务根 T 绑定 taskId、模型、输入与策略；PoI Worker 提交 rExec，Validator 用 QC 形成裁决 R，区块全程不等待模型。', 'taskKey 绑定任务、输出与 nonce；Verify(R) 且 taskKey 未消费时，δACVM 恢复合约并由 UpdateBounded 更新 PoI。'],
  },
} as const satisfies Record<ScreenId, SpeakerGuideEntry>;
