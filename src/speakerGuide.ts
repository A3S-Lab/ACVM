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
    focus: 'ACVM 是链上 Agentic Contract 的 Runtime，负责挂起等待外部结果，并在收到终局裁决后确定性恢复合约。',
    example: 'GEO Agentic Contract 发布复测任务后进入等待状态；链上收到结果证书 R，所有节点执行同一 δACVM 状态转换并释放结果费。',
    beats: ['Agentic Contract 固定代码、任务状态、验收规则、预算和 Runtime 版本。', '模型推理不会阻塞区块；Runtime 只处理任务事件、结果证书和确定性状态转换。'],
  },
  'poi-proof': {
    duration: '0:45',
    focus: 'ValidPoI 是结果验收后的有效贡献凭证，不是 Worker、Validator 或 BFT 终局本身。',
    example: '同一个预测结果即使被复制到两个订单，也只有同时匹配签名需求、验收结果、执行回执和唯一 taskKey 的订单可以领取一次费用。',
    beats: ['SignedDemand 证明真实订单与预算，AcceptedResult 证明结果已按约通过。', 'ExecutionEvidence 与 AntiReplay 保证执行可查且不能重复结算；共识权重由后续算法另行计算。'],
  },
  'useful-work': {
    duration: '0:50',
    focus: 'PoI Worker 把无链外产出的哈希搜索，换成能交付业务结果的模型推理。',
    example: '示例：GPU 不再反复尝试 nonce，而是对匿名化订单运行异常检测，交付异常清单、模型版本和执行证据。',
    beats: ['PoI Worker 改变的是工作量来源：从哈希搜索改为真实推理。', 'ValidPoI 记录已验收贡献，PoI Consensus 再把贡献换成有界候选权重。'],
  },
  'geo-verification': {
    duration: '0:50',
    focus: 'GEO 按独立观测到的增量结算，不按内容数量结算。',
    example: '试点示例：引用份额从 14.2% 提升到 25.8%，增量 11.6pp，超过签约门槛 8pp。',
    beats: ['签约前冻结问题集、基线、观察窗口和排除项。', '复测由独立观察方完成，服务方不能自己报成绩。'],
  },
  'agent-rental': {
    duration: '0:55',
    focus: '这一笔完整订单把 ANS 服务发现、雾节点调度、TEE 隐私推理和 ACVM 分账串在同一 taskId 下。',
    example: '示例：设备厂开放故障诊断智能体，工厂按批次提交订单；加密镜像只在雾节点 TEE 内解密，链上智能体 PoI 验证器结合维修工单验收后，ACVM 再释放结果费。',
    beats: ['企业通过 a3s-code 构建、a3s-use 声明能力，再由 ANS 发布签名服务卡。', 'a3s-box 管理隔离环境，a3s-power 在 TEE 内推理；结果证书触发付款、ValidPoI 和 splitRoot 分账。'],
  },
  simulation: {
    duration: '0:50',
    focus: '社会模拟在不公开个体数据的前提下交付可验证的群体结果。',
    example: '示例：多家机构在本地运行同一政策仿真，只提交加密统计；ACVM 核验冻结的模型、样本和随机种子后，对群体指标与置信区间完成验收。',
    beats: ['模型、样本承诺、随机过程和隐私预算在运行前冻结。', '协议能证明实验按约运行，不能把模拟结论当成现实事实。'],
  },
  'poi-consensus': {
    duration: '0:50',
    focus: '已终局的 ValidPoI 先按任务类别归一，再变成有界权重、VRF 抽签和 BFT 终局。',
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
    focus: '同一规则承诺 C 依次绑定隐私执行回执 rPriv、结果证书 R 和 ACVM 状态恢复。',
    example: '采购 Agent 在隔离环境完成询价后签发 rPriv；链上验证智能体结合采购单与到货记录形成 R。Runtime 验证 R 与未消费 taskKey 后才恢复合约并付款。',
    beats: ['C 固定链域、Runtime 版本、任务、输入、模型、权限、验收、分账和 nonce。', 'PoI Worker 生成 rPriv，验证智能体生成 R，ACVM Runtime 只执行 Verify(R) 与 δACVM。'],
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
    focus: 'ACVM 有两种部署路径：Rust 原生链内置 Runtime，现有国内链通过 ChainAdapter 接入标准状态与终局。',
    example: 'GEO 任务可以在 Rust 原生链直接运行 Agentic Contract；也可以由长安链 Driver 写入 taskRoot、verdictRoot 和 poiRoot，再把终局回执返回 ACVM。',
    beats: ['两种路径共用 taskId、规则承诺、结果证书、ValidPoI 和结算语义。', '模型、原始数据和详细证据留在 A3S 执行域，链上只保存必要状态与内容根。'],
  },
  'native-chain': {
    duration: '1:00',
    focus: 'Rust 原生链内置 ACVM Runtime 与智能体 PoI 验证器，PoI Worker 在链下提供隐私模型推理，BFT Validator 负责区块终局。',
    example: '链上理赔 Agentic Contract 发布票据识别任务；a3s-box 与 a3s-power 在链下保护票据和模型，链上验证智能体结合保单规则与复核证据形成 AcceptedResult，ACVM Runtime 随后恢复合约并结算。',
    beats: ['规则承诺 C 绑定链域、Runtime、任务、模型、输入、策略、验收与分账；PoI Worker 只返回 rPriv 与 outputRoot。', '验证智能体形成结果证书 R；taskKey 未消费时，δACVM 恢复合约并记录 ValidPoI。'],
  },
} as const satisfies Record<ScreenId, SpeakerGuideEntry>;
