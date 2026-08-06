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
    focus: 'ACVM 是去中心化智能体即服务网络：企业发布智能体，用户按需调用，网络验证结果并自动分配收益。',
    example: '示例：设备厂把故障诊断智能体发布为服务；工厂提交诊断订单，结果通过独立验收后，ACVM 向所有者付款并生成 ValidPoI。',
    beats: ['ANS 负责服务发现，雾计算网络负责匹配隐私执行节点。', '链上智能体 PoI 验证器确认结果后，ACVM Runtime 完成付款、分账和贡献计量。'],
  },
  'product-snapshot': {
    duration: '0:50',
    focus: 'ACVM 是链上 Agentic Contract 的 Runtime，负责执行任务状态机并在验证后恢复合约。',
    example: 'GEO Agentic Contract 冻结问题集、引用基线和预算；链下观察节点提交复测结果，链上智能体 PoI 验证器确认增量后，ACVM Runtime 恢复合约并释放结果费。',
    beats: ['Agentic Contract 在链上保存任务、验收、预算和防重放状态。', '链下服务只提交结果与回执；验证通过后，ACVM Runtime 才更新状态、付款或退款。'],
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
    example: '示例：设备厂开放故障诊断智能体，工厂按批次提交订单；加密镜像只在雾节点 TEE 内解密，链上智能体 PoI 验证器结合维修工单验收后，ACVM 再释放结果费。',
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
    focus: 'ANS 找到服务后，雾计算网络按安全、资源、位置和时延选择单节点或同域 MoE 专家组。',
    example: '工厂质检任务优先选择厂区内带 TEE 的 GPU 节点；MoE 模式则选择同一机房的路由节点和 Top-k 专家，避免跨地域激活传输抵消并行收益。',
    beats: ['FogLease 把 taskId、加密镜像、TEE 等级、资源和截止时间固定到本次执行。', 'a3s-box 建立隐私边界，a3s-power 只加载命中的专家参数；外部只收到结果根和组合回执。'],
  },
  'execution-boundary': {
    duration: '0:55',
    focus: '链下负责隐私计算，链上智能体 PoI 验证器负责执行证明、业务结果与防重放裁决。',
    example: '采购 Agent 在 a3s-box 内完成供应商询价，πpriv 证明指定模型、工具和权限按约运行；链上验证智能体再结合采购单与到货记录判断结果。两类证据通过后，ACVM Runtime 才恢复合约并付款。',
    beats: ['承诺 C 固定任务、输入、模型、策略、验收和分账；ExecOK 验证 πpriv、outputRoot 与本次 nonce 的绑定。', '验证智能体的有效签名票达到阈值 q 才得到 OutcomeOK；taskKey 未消费时，δACVM 才推进 Agentic Contract 状态。'],
  },
  'a3s-box': {
    duration: '0:55',
    focus: 'A3S 执行栈把智能体从可签名构建包安全送入 TEE，并按任务远程挂载最小权限能力。',
    example: '示例：企业用 a3s-code 打包售后智能体并发布加密镜像；雾节点证明通过后，a3s-box 才在 TEE 内解密，a3s-use 再挂载本次任务授权的 CRM 读取和模型推理能力。',
    beats: ['imageRoot 与 capabilityRoot 分别锁定智能体镜像和能力清单，仓库与宿主机看不到明文。', '任务结束后，a3s-box 签发隐私执行回执并清零镜像密钥、能力令牌和临时卷。'],
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
    focus: 'Rust 原生链内置 ACVM Runtime 与智能体 PoI 验证器，PoI Worker 在链下提供隐私模型推理。',
    example: '链上理赔 Agentic Contract 发布票据识别任务；a3s-box 与 a3s-power 在链下保护票据和模型，链上验证智能体结合保单规则与复核证据形成 AcceptedResult，ACVM Runtime 随后恢复合约并结算。',
    beats: ['任务根 T 绑定任务、模型、输入与策略；链下只返回 outputRoot 与 πpriv，区块不等待模型计算。', '链上智能体 PoI 验证器达到法定人数 q 后形成裁决；taskKey 未消费时，δACVM 恢复合约并更新 ValidPoI。'],
  },
} as const satisfies Record<ScreenId, SpeakerGuideEntry>;
