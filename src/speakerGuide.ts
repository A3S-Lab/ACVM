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
    example: '示例：设备厂、工厂和维保商联合形成预测性维护数据产品；结果达标后生成 ValidPoI，释放结果费并按 splitRoot 分账。',
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
  'data-space': {
    duration: '0:55',
    focus: '多方数据形成联合数据产品，验收后由 ACVM 按约分配收益。',
    example: '试点示例：设备厂提供设备参数，工厂提供运行数据，维保商提供故障工单，共同形成预测性维护数据产品；停机时长达到改善目标后，三方按事前规则分配收益。',
    beats: ['空间连接器记录每一方的授权、实际用数和谱系。', 'UsageProof 与 AcceptedResult 同时通过后，ACVM 才按 splitRoot 释放结果池。'],
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
    example: '示例：GEO、预测性维护和社会模拟不直接按订单金额比较，而是在各自类别内归一、封顶和衰减，避免高价任务直接垄断提议机会。',
    beats: ['贡献分数只来自已终局的 PoI，不接受 Worker 自报成本或分值。', '权重只影响候选概率；其他节点仍重验交易与状态，并由 BFT 法定人数完成终局。'],
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
  ans: {
    duration: '0:40',
    focus: 'ANS 用带签名的服务卡完成服务发现，ACVM 继续负责结果验收与结算。',
    example: '工厂 Agent 查询 fog.infer.ans，取得端点、能力、报价和有效期；核验签名与撤销状态后再创建推理任务。',
    beats: ['服务卡把名称解析为可核验的身份、接口和交易条件。', '历史回执提供履约参考，不能替代本次订单的独立验收。'],
  },
  'fog-inference': {
    duration: '0:45',
    focus: '雾节点让原始数据留在现场，同时向外部提交可验证结果。',
    example: '工厂质检图像留在厂区节点完成缺陷识别，外部只接收缺陷统计、模型版本、运行证明和绑定 taskId 的签名回执。',
    beats: ['调度租约固定节点、模型、环境、资源上限和截止时间。', 'ACVM 验证明与业务结果，公共节点不接触原始图像。'],
  },
  'execution-boundary': {
    duration: '0:55',
    focus: '执行证明确认按约运行，结果证明确认业务目标达标。',
    example: '示例：采购 Agent 完成供应商询价后，TEE 回执证明指定模型、工具和权限按约运行；真实采购单与到货记录再证明业务目标完成。两类证据通过 Validator 法定人数确认后才生成 ValidPoI 并付款。',
    beats: ['contractRoot 先冻结目标、权限、验收、分账和挑战规则；回执绑定 taskId、模型、环境、输入输出根与 nonce。', 'TEE 不能单独证明结果正确；AcceptedResult 必须来自独立业务证据，链上再验签、确认法定人数并防重放。'],
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
    focus: 'Rust 原生链把 PoI Worker 变成链上 ACVM 的异步模型推理服务层。',
    example: '示例：链上理赔合约发布票据一致性识别任务；PoI Worker 运行指定视觉模型，Validator 结合保单规则与人工复核验收，AcceptedResult 恢复合约并结算，同时形成 ValidPoI。',
    beats: ['区块不会同步等待模型；Agentic Contract 进入 AwaitingInference，收到 AcceptedResult 后再执行确定性状态转换。', '同一次有效推理获得服务收益并形成有界候选权重，VRF 选择提议者，BFT 完成区块终局。'],
  },
} as const satisfies Record<ScreenId, SpeakerGuideEntry>;
