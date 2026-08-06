import type { ScreenId } from './deck';

export type GuideImplementation = {
  title: string;
  mechanism: string;
  acceptance: string;
};

export type GuideRisk = {
  title: string;
  failure: string;
  solution: string;
  residual: string;
};

export type GuideSource = {
  label: string;
  url: string;
};

export type SpeakerGuideDetails = {
  implementation: readonly [GuideImplementation, ...GuideImplementation[]];
  challenges: readonly [GuideRisk, ...GuideRisk[]];
  security: readonly [GuideRisk, ...GuideRisk[]];
  sources: readonly [GuideSource, ...GuideSource[]];
};

const sources = {
  survey: {
    label: 'AI Agent 交易处理与扩展性综述',
    url: 'https://www.elspub.com/doi/10.55092/blockchain20260005',
  },
  dataTwenty: {
    label: '中共中央、国务院“数据二十条”',
    url: 'https://www.gov.cn/zhengce/2022-12/19/content_5732695.htm',
  },
  dataTerms: {
    label: '国家数据局《数据领域常用名词解释（第一批）》',
    url: 'https://www.nda.gov.cn/sjj/zwgk/zcfb/1230/20241230160715745237413_pc.html',
  },
  trustedDataSpacePlan: {
    label: '国家数据局《可信数据空间发展行动计划（2024—2028年）》',
    url: 'https://www.nda.gov.cn/sjj/zwgk/zcfb/1122/20241122164142182915964_pc.html',
  },
  trustedDataSpaceTech: {
    label: '全国数标委《可信数据空间 技术架构》',
    url: 'https://www.nda.gov.cn/sjj/ywpd/szkjyjcss/0430/20250430181352183912672_pc.html',
  },
  bitcoin: {
    label: '工作量证明与最长链原始论文',
    url: 'https://bitcoin.org/bitcoin.pdf',
  },
  posAttacks: {
    label: 'PoS 攻击与防御',
    url: 'https://ethereum.org/developers/docs/consensus-mechanisms/pos/attack-and-defense/',
  },
  weakSubjectivity: {
    label: 'PoS 弱主观检查点',
    url: 'https://ethereum.org/developers/docs/consensus-mechanisms/pos/weak-subjectivity/',
  },
  cometBft: {
    label: 'CometBFT 安全性与活性证明',
    url: 'https://docs.cometbft.com/v0.38/spec/consensus/consensus',
  },
  vrf: {
    label: 'RFC 9381 可验证随机函数',
    url: 'https://www.rfc-editor.org/rfc/rfc9381.html',
  },
  contracts: {
    label: 'OWASP 智能合约 Top 10',
    url: 'https://scs.owasp.org/sctop10/',
  },
  bridges: {
    label: '跨链桥模型与风险',
    url: 'https://ethereum.org/developers/docs/bridges',
  },
  zkRollups: {
    label: 'ZK Rollup 原理与风险边界',
    url: 'https://ethereum.org/developers/docs/scaling/zk-rollups/',
  },
  dataAvailability: {
    label: '数据可用性',
    url: 'https://ethereum.org/developers/docs/data-availability/',
  },
  did: {
    label: 'W3C DID Core',
    url: 'https://www.w3.org/TR/did-core/',
  },
  odrl: {
    label: 'W3C ODRL 信息模型（用途与权限策略）',
    url: 'https://www.w3.org/TR/odrl-model/',
  },
  agentSecurity: {
    label: 'OWASP Agentic Applications Top 10',
    url: 'https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/',
  },
  ap2: {
    label: 'Google AP2 官方协议仓库',
    url: 'https://github.com/google-agentic-commerce/AP2',
  },
  ap2Overview: {
    label: 'Google Cloud AP2 协议说明',
    url: 'https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol',
  },
  ap2Lab: {
    label: 'AP2 Lab 中文导读（社区资料）',
    url: 'https://ap2lab.com/docs/introduction/',
  },
  a3s: {
    label: 'A3S 开源框架与能力边界',
    url: 'https://github.com/A3S-Lab/a3s',
  },
  a3sRuntime: {
    label: 'A3S Runtime 持久生命周期与回执',
    url: 'https://github.com/A3S-Lab/Runtime',
  },
  a3sBox: {
    label: 'A3S Box 隔离工作负载与全生命周期能力',
    url: 'https://github.com/A3S-Lab/Box',
  },
  a3sPower: {
    label: 'A3S Power 隐私计算、参数流式推理与可验证回执',
    url: 'https://github.com/A3S-Lab/Power',
  },
  bittensor: {
    label: 'Bittensor Yuma 共识权重论文',
    url: 'https://docs.bittensor.com/papers/BT-Consensus-based-Weights.pdf',
  },
  allora: {
    label: 'Allora 共识与奖励机制',
    url: 'https://docs.allora.network/learn/consensus-and-rewards',
  },
  gensynVerde: {
    label: 'Gensyn Verde 执行验证边界',
    url: 'https://blog.gensyn.ai/verde-verification-system-in-production/',
  },
  eigenAi: {
    label: 'EigenAI 确定性推理白皮书',
    url: 'https://docs.eigencloud.xyz/assets/files/EigenAI_Whitepaper-f1c89ddb88c1e28ccadff250523a273c.pdf',
  },
  eigenRestaking: {
    label: 'EigenLayer Restaking 与 Slashing',
    url: 'https://docs.eigencloud.xyz/eigenlayer/restakers/concepts/overview',
  },
  eigenAvs: {
    label: 'EigenLayer AVS 任务、Quorum 与挑战示例',
    url: 'https://github.com/Layr-Labs/incredible-squaring-avs',
  },
  chainOpera: {
    label: 'ChainOpera PoI 协议设计与 L1 路线',
    url: 'https://paper.chainopera.ai/tokenomics-and-protocol-design/proof-of-intelligence-based-protocol-design-and-evolution-to-an-l1-ai-chain',
  },
  polkadotSdk: {
    label: 'Polkadot SDK Rust 区块链运行时参考',
    url: 'https://github.com/paritytech/polkadot-sdk',
  },
  rustLibp2p: {
    label: 'rust-libp2p 点对点网络实现',
    url: 'https://github.com/libp2p/rust-libp2p',
  },
  bsn: {
    label: 'BSN 链下系统网关接入说明',
    url: 'https://zhuanwang.bsnbase.com/static/tmpFile/bzsc/developer/5-4-1.html',
  },
  sparkChain: {
    label: '星火·链网 BIF-Core 开放文档',
    url: 'https://bif-doc.readthedocs.io/zh-cn/1.0.0/app/brief.html',
  },
  chainMaker: {
    label: '长安链技术平台与国密能力',
    url: 'https://docs.chainmaker.org.cn/quickstart/%E9%95%BF%E5%AE%89%E9%93%BE%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86%E4%BB%8B%E7%BB%8D.html',
  },
  fisco: {
    label: 'FISCO BCOS 权限治理体系',
    url: 'https://fisco-bcos-doc.readthedocs.io/zh-cn/release-3/docs/design/security_control/committee_design.html',
  },
} as const satisfies Record<string, GuideSource>;

export const speakerGuideDetails = {
  top: {
    implementation: [
      {
        title: '封面给出整套演示的总命题',
        mechanism: '封面以“去中心化智能体即服务网络”统领智能体发布、ANS 服务发现、雾计算隐私执行、PoI 结果验证和 ACVM 自动分账。产品定义、场景、算法与实现路径由后续页面逐层展开。',
        acceptance: '观众在十秒内能复述 ACVM 的作用：让智能体可发布、服务可发现、结果可验证、收益可分配。',
      },
    ],
    challenges: [
      {
        title: '链上价值不等于把全部数据写入链上',
        failure: '观众可能把“链上价值”理解为原始数据、模型与推理过程全部公开，或误解为对资产价格的承诺。',
        solution: '链上只锚定任务根、裁决根、PoI 根和结算状态；原始数据、模型与详细证据留在受控链下环境。',
        residual: '链上记录保证状态可追溯，业务结果仍取决于事前验收口径与 Validator 独立性。',
      },
    ],
    security: [
      {
        title: '有效推理必须由完整证据链定义',
        failure: '若无真实需求、无验收、无执行证明或允许重放，普通模型调用也会被包装成链上贡献。',
        solution: '把 SignedDemand、AcceptedResult、ExecutionEvidence 和 UniqueTaskKey 固化为 ValidPoI 与结算的必要条件。',
        residual: '完整证据链证明任务按规则完成，验收规则本身仍需需求方、Validator 和治理共同负责。',
      },
    ],
    sources: [sources.survey],
  },
  'product-snapshot': {
    implementation: [
      {
        title: '托管状态机',
        mechanism: '订单按 Funded → Running → Submitted → Accepted / Rejected → Settled 转移。每个入口校验调用角色、截止时间、上一状态和 nonce；资金只由终局状态驱动。',
        acceptance: '用状态机不变量检查“总托管额 = 可退额 + 可付额 + 已付额”，并保证 settle、refund 和 slash 都是幂等操作。',
      },
      {
        title: '执行、裁决与结算分层负责',
        mechanism: 'ACVM Runtime 执行链上 Agentic Contract 状态机；A3S 提交链下隐私计算回执，智能体 PoI 验证器按 contractRoot 中冻结的证据、阈值和挑战规则生成 AcceptedResult，Runtime 再恢复合约。',
        acceptance: '执行成功不能直接提款；没有 AcceptedResult，Agentic Contract 不能从等待态进入结算态；全节点重放后必须得到同一 stateRoot。',
      },
    ],
    challenges: [
      {
        title: '外部结果与链上资金必须原子衔接',
        failure: 'Worker 已交付结果但链上未付款，或资金已经释放却发现证据尚未终局。',
        solution: '把链上状态机设为唯一结算源；外部系统只发签名事件，不直接记账。AcceptedResult 达到配置终局后，单笔交易同时更新状态和可领取余额。',
        residual: '外部交付仍可能发生延迟，因此加密结果应在付款可领取后才释放解密材料。',
      },
    ],
    security: [
      {
        title: '访问控制、重入与业务逻辑漏洞',
        failure: '伪造 Validator 身份、在外部调用中重入，或借边界状态重复退款，都可能抽空托管资金。',
        solution: '角色采用最小权限；状态先更新再外部交互；付款改为 pull payment；关键入口加重入锁、nonce 和显式状态检查。对托管守恒、单次结算和超时路径做属性测试与模糊测试。',
        residual: '审计不能证明没有业务漏洞；高额订单还需要限额、延迟提款和可暂停开关。',
      },
      {
        title: '升级密钥失守',
        failure: '代理合约管理员可在订单运行中替换逻辑，绕过原有验收规则。',
        solution: '运行中订单固定实现哈希；升级由多签和时间锁控制，公开升级差异，并给用户退出窗口。紧急暂停权与升级权分离。',
        residual: '可升级系统始终保留治理信任；高保证场景可选择不可升级部署。',
      },
    ],
    sources: [sources.contracts, sources.survey],
  },
  'geo-verification': {
    implementation: [
      {
        title: '先冻结实验口径',
        mechanism: '订单记录 querySetRoot、目标引擎、地区与语言、siteVersion、baselineRoot、观察窗口和目标增量。任何站点或问题集变更都生成新实验，不覆盖原基线。',
        acceptance: '观察节点必须提交带时间、区域和引擎版本的签名样本；Validator 只比较同一口径、同一窗口内的数据。',
      },
      {
        title: '独立观察与统计裁决',
        mechanism: '从互不关联的观察节点随机抽样，隐藏具体采样时刻；对异常值做稳健聚合，并用对照组或差分方法隔离全网趋势。',
        acceptance: '达到预设样本量、置信区间和增量门槛才通过；缺样、来源过度集中或结果分歧过大时进入挑战。',
      },
    ],
    challenges: [
      {
        title: '把相关性误当成 GEO 优化效果',
        failure: '品牌活动、搜索引擎更新或季节变化也会推高引用率，单纯做前后对比会错付。',
        solution: '签约时指定对照查询、固定观察窗口和最小可检测效应；优先用差分比较。无法建立对照时降低结算比例，并把因果不确定性写进订单。',
        residual: '开放网络无法做到实验室级因果证明；ACVM 提供可审计的共同口径，而不是宣称绝对归因。',
      },
    ],
    security: [
      {
        title: '观察源被操纵',
        failure: 'Worker 控制观察节点、投毒问题集，或只提交有利样本。',
        solution: '问题集先承诺后揭示；观察节点由 VRF 抽取并分地域；要求原始响应内容哈希、完整采样日志和缺失样本证明。Validator 比对多个独立源，异常可触发复测。',
        residual: '若上游生成式搜索服务本身被统一操纵，多观察者仍会共享同一偏差，需要人工证据和延迟结算。',
      },
      {
        title: 'Sybil 与串谋验收',
        failure: '攻击者批量创建观察者和 Validator 身份，让虚假增量形成多数。',
        solution: '观察者需保证金、可追溯运营主体或硬件证明；委员会按利益冲突过滤后随机抽取，少数意见可在挑战期提交原始证据并获得奖励。',
        residual: '身份成本只能压低 Sybil 收益，不能消灭组织层面的串谋。',
      },
    ],
    sources: [sources.survey, sources.contracts, sources.vrf],
  },
  'agent-rental': {
    implementation: [
      {
        title: '服务能力与任务订单分别签名',
        mechanism: '智能体所有者通过 ANS 发布绑定 DID、capabilityRoot、endpoint、version、pricePolicy、validUntil 和 recordRoot 的签名服务卡。租用方另行签署 SignedDemand，冻结 taskId、目标、输入权限、预算、截止时间、Validator 与验收规则。',
        acceptance: '解析器先验证服务卡签名、序号、有效期和撤销状态；ACVM 再确认订单引用同一 capabilityRoot 与 endpoint。服务卡过期、能力版本不符或预算未托管时，任务不能进入执行队列。',
      },
      {
        title: '所有权留在执行域，结果进入结算域',
        mechanism: 'A3S 用 a3s-box 固定工具、网络和文件边界，用 a3s-power 保护模型、Prompt 与私有数据，并生成绑定 taskId、modelRoot、envRoot、outputRoot 和 nonce 的 ExecReceipt。Validator 使用独立业务证据生成 AcceptedResult。',
        acceptance: '租用方只能取得约定输出或 outputRoot，不能下载模型、系统提示词或私有数据；没有合格 ExecReceipt 与 AcceptedResult 时，ACVM 不释放结果费，也不生成 ValidPoI。',
      },
      {
        title: '组合服务按冻结规则分账',
        mechanism: '订单可用 splitRoot 记录智能体所有者、模型方、算力方和数据贡献方的固定比例、保底与上限。AcceptedResult 终局后，PaymentClaim 按同一 taskId 一次性分配结果池。',
        acceptance: '每个收款项都能追溯到已签名订单与终局裁决；分账总额严格等于结果池，任何主体、比例或收款地址变化都要求新的 SignedDemand。',
      },
    ],
    challenges: [
      {
        title: '开放式智能体任务难以逐字验收',
        failure: '同一智能体在不同采样、工具响应和业务环境下可能产生不同文本，租用方也可能在结果出现后改变成功口径。',
        solution: '签约时优先冻结结构化输出、阈值、禁用动作、外部观测和人工复核规则；开放任务用性质验证与挑战窗口，不把逐字一致作为唯一标准。',
        residual: '协议能确认结果满足冻结规则，不能证明开放式回答存在唯一真值；高价值任务仍需要专业人员承担最终业务责任。',
      },
    ],
    security: [
      {
        title: '恶意工具调用与数据外泄',
        failure: '被租用的智能体可能借浏览器、HTTP、日志或插件窃取输入，也可能执行订单范围外的邮件、转账或系统写入。',
        solution: 'a3s-box 默认禁止出站并按域名、工具和数据类型授权；高风险动作使用短期能力令牌、幂等键和人工确认。回执记录 toolCallRoot、网络策略和副作用确认。',
        residual: '提示词注入、供应链后门和内部人员风险无法完全消除，高敏订单仍需专用镜像、独立审计与最小数据披露。',
      },
      {
        title: '所有者自交易制造租赁量与 PoI',
        failure: '同一控制方创建租用账户、运行智能体并控制 Validator，可循环资金制造收入、成功率和候选权重。',
        solution: '要求真实预算托管、独立业务证据、关联账户合并、任务类别封顶与随机 Validator；低价值关联订单降低信誉与 PoI 贡献。',
        residual: '链下控制关系无法完全识别，信誉和 PoI 只能作为有界风险信号，高权重服务仍需身份成本与持续审计。',
      },
    ],
    sources: [sources.did, sources.a3s, sources.a3sBox, sources.a3sPower, sources.contracts, sources.agentSecurity],
  },
  'execution-boundary': {
    implementation: [
      {
        title: '可信执行与结果有效使用两条独立证据链',
        mechanism: '规则承诺 C 固定 chainId、Runtime 版本、合约根、taskId、输入、模型、策略、验收、分账和 nonce。PoI Worker 生成 rPriv = SignWorker(C ∥ envRoot ∥ outputRoot ∥ πpriv)；验证智能体再形成 R = QC(H(C ∥ rPriv ∥ verdictRoot))。',
        acceptance: '节点验证 C、rPriv、R 与 taskKey 的连续绑定后再执行 δACVM，不要求每台节点重跑 GPU 推理；任何模型、权限、验收或结果换件都会让证书失效。',
      },
      {
        title: '副作用采用意图—确认两阶段',
        mechanism: '发邮件、下单或写外部系统时，Agent 先生成带能力令牌和幂等键的 intent；授权执行器完成后再返回 signed receipt，合约据此推进状态。',
        acceptance: '同一幂等键重复提交不产生第二次副作用；未确认、超时和部分完成都有明确补偿路径。',
      },
      {
        title: '异步状态机避免区块等待推理',
        mechanism: '规则承诺 C 固定输入输出 schema、角色、证据策略、预算、超时和补偿动作。链上状态从 Requested 进入 AwaitingInference，收到合格的结果证书 R 后才进入 Resumed 或 Settled；模型输出不能直接调用结算入口。',
        acceptance: '每条状态转移都有前置条件、授权角色、单调 nonce 和最大执行次数；节点只重放确定性验证与状态转换，不同步重跑模型。',
      },
    ],
    challenges: [
      {
        title: '模型输出不确定，验证规则必须确定',
        failure: '不同 GPU、采样和外部 API 会产生不同字节；直接比较完整输出会让诚实节点也分叉。',
        solution: '固定模型、量化和环境版本；能固定种子的任务固定种子。开放任务不比较逐字输出，只验证预先定义的性质、评分阈值或独立观察结果。',
        residual: '放宽到性质验证后，可证明的是“满足验收谓词”，不是“这是唯一正确答案”。',
      },
    ],
    security: [
      {
        title: '回放、串链和双重回执',
        failure: '旧回执被搬到另一条链或另一版本合约，Worker 又为同一状态签出两个不同结果。',
        solution: '所有签名做 chainId、contractRoot、taskId 和 step 的域隔离；状态链包含 prevReceiptRoot 和单调 nonce。发现同一步双签即可提交两份签名罚没。',
        residual: '罚没依赖证据最终可用，证据存储期必须覆盖最长挑战期。',
      },
      {
        title: '数据不可用导致无法挑战',
        failure: '只把 outputRoot 写上链却不提供原始证据，挑战者无法证明结果有错。',
        solution: '结算前要求可用性收据；关键证据发布到链上数据层或多个有押金的存储节点。挑战期结束前不可删除，取回失败自动延迟付款。',
        residual: '外部数据受许可或隐私约束时无法完全公开，只能用 TEE、零知识或授权仲裁替代公开复核。',
      },
    ],
    sources: [sources.dataAvailability, sources.contracts, sources.agentSecurity, sources.a3sBox, sources.a3sPower, sources.survey],
  },
  ans: {
    implementation: [
      {
        title: '签名服务记录',
        mechanism: 'ANS 记录包含名称、DID、能力 schema、版本、A2A 端点、价格、有效期、序号、Validator 策略和记录签名。大字段存内容寻址层，链上保存 recordRoot。',
        acceptance: '解析器验证 DID 控制密钥、签名、单调序号、validUntil 和 recordRoot；A2A 握手还要证明端点持有记录中声明的密钥。',
      },
      {
        title: '信誉按能力隔离',
        mechanism: '每份终局回执只更新对应能力、任务类别和价格区间的成功率、争议率与样本量，不能把廉价分类任务的成绩搬到高风险任务。',
        acceptance: '信誉查询返回统计窗口、样本量和回执根，客户端能够独立抽查原始终局事件。',
      },
    ],
    challenges: [
      {
        title: '更新、缓存与撤销存在时间差',
        failure: 'Agent 已更换密钥或被撤销，调用方仍从缓存拿到旧端点。',
        solution: '记录使用短 TTL 和单调序号；高风险调用同时查链上根和两个独立解析器。紧急撤销单独上链，客户端维护撤销列表并拒绝降序记录。',
        residual: '链停摆时新撤销无法传播，高风险客户端应 fail closed，暂停新任务。',
      },
    ],
    security: [
      {
        title: '名称劫持与缓存投毒',
        failure: '攻击者让熟悉名称解析到自己的 A2A 端点，截获任务和预算。',
        solution: '注册和更新都验证控制密钥；敏感名称启用时间锁与多签。解析结果带可验证包含证明，客户端固定 DID 或组织根并校验 TLS/A2A 密钥绑定。',
        residual: '同形字和社会工程仍可能误导用户，界面要同时展示组织 DID、风险标识和最近变更。',
      },
      {
        title: 'Sybil 信誉与回执刷分',
        failure: '攻击者创建大量需求方，互相签低成本任务以制造漂亮的成功率。',
        solution: '信誉展示真实支付额、独立需求方数量和身份集中度；关联账户合并计算，低价值任务权重封顶，争议和退款也进入指标。',
        residual: '信誉是风险信号，不是身份真伪证明；高价值订单仍需白名单或额外尽调。',
      },
    ],
    sources: [sources.did, sources.survey],
  },
  'system-architecture': {
    implementation: [
      {
        title: '订单规则与资金池同时冻结',
        mechanism: 'SignedDemand 绑定 taskId、contractRoot、resultSpecRoot、verificationPolicyRoot、splitRoot、deadline、nonce 与需求方签名。Escrow 分开记录 ResultPool、VerificationPool 和各责任方 Bond，执行开始后不能单方改动。',
        acceptance: '资金守恒检查在任务创建时通过；预算未足额托管、splitRoot 总和不等于 ResultPool、规则版本缺失或 nonce 重复时，订单不能进入执行队列。',
      },
      {
        title: '双证据生成三态终局裁决',
        mechanism: '承诺 C 固定 domain、taskId、inputRoot、modelRoot、policyRoot、verifyRuleRoot、splitRoot 与 nonce；PoI Worker 的 rPriv 绑定环境、输出与隐私证明。Validator 对独立证据执行冻结谓词并验签，达到阈值后形成结果证书 R。挑战窗口结束后，FinalVerdict 只能是 Accepted、Rejected 或 Fraud。',
        acceptance: 'Accepted 必须满足 ExecOK 与 OutcomeOK 且 taskKey 未消费；Rejected 表示结果未达标但无可证明造假；Fraud 必须引用可重放的伪证、双签或篡改证据。任何模糊状态都不能触发资金终局。',
      },
      {
        title: '一个终局函数处理付款、退款、罚没与 PoI',
        mechanism: 'Settle(taskId, FinalVerdict) 按三条确定路径执行：Accepted 将 ResultPool 按 splitRoot 分账并记录 ValidPoI；Rejected 退回 ResultPool 且不记录 ValidPoI；Fraud 执行责任 Bond 的罚没。VerificationPool 仅按已完成的证据与验证工作支付。',
        acceptance: '三条路径都满足资金守恒、一次性领取和幂等重放；只有 Accepted 产生 ValidPoI，只有 FraudProof=1 产生 Slash，普通模型误判不能被包装成作恶。',
      },
    ],
    challenges: [
      {
        title: '正常未达标与可证明作恶必须分开',
        failure: '模型本身存在不确定性；如果结果未达标就罚没，执行方会只接简单任务或把风险全部加到报价中。',
        solution: '验收规则明确区分 Accepted、Rejected、SLA breach 与 Fraud；Fraud 仅接受双签、伪造证据、隐瞒样本或越权执行等可重放证明。',
        residual: '边界案例仍需仲裁，仲裁权限、费用和最长时限必须在 SignedDemand 中冻结。',
      },
    ],
    security: [
      {
        title: '自交易、重放与关联主体刷量',
        failure: '同一控制方创建需求方、Worker 和 Validator，并把同一输出提交给多个订单，可能伪造收入、成功率与 PoI。',
        solution: '要求真实预算托管、taskKey 域隔离、防重放集合、关联账户合并、任务类别封顶和随机 Validator；低价值关联订单降低 PoI 贡献。',
        residual: '链下控制关系无法完全识别，高权重服务仍需要身份成本、异常图谱和持续人工审计。',
      },
      {
        title: 'Validator 串谋与挑战洪泛',
        failure: '同一故障域的 Validator 可共同签错结果；攻击者也可用廉价挑战长期冻结诚实付款。',
        solution: '委员会按运营主体、数据源、云区域和证明硬件去相关；挑战者缴纳与复核成本相匹配的 Bond，有效挑战获奖励，无效挑战支付验证成本。',
        residual: '组织独立性无法完全密码学证明，极高价值订单仍需更多证据源、人工复核和限额。',
      },
    ],
    sources: [sources.a3s, sources.a3sBox, sources.a3sPower, sources.contracts, sources.agentSecurity, sources.cometBft, sources.survey],
  },
  'fog-inference': {
    implementation: [
      {
        title: 'a3s-box 把任务固定到本地隔离实例',
        mechanism: '调度器签发 lease = H(taskId ∥ imageRoot ∥ resourcePolicy ∥ deadline)。a3s-box 在数据现场创建专用内核或 TEE 支持的 MicroVM，管理镜像、网络、临时卷与生命周期；模型推理由实例内的 a3s-power 执行。',
        acceptance: '实际后端、TEE profile、镜像、网络策略、卷、CPU、内存和生命周期都与 lease 一致；运行中不能静默降级，任务结束后临时卷、密钥和进程被清理。',
      },
      {
        title: '原始数据留在隔离域，外部只验回执',
        mechanism: '摄像头、传感器和本地日志只进入 a3s-box 管理的数据卷；a3s-power 在 TEE 内保护模型与使用中数据。外部只收到绑定 C、envRoot、outputRoot 与隐私证明的 rPriv，以及独立业务证据。',
        acceptance: '出站网络测试不能传出原始字节、Prompt 或完整日志；ACVM 能验证回执签名、策略根、输出根和业务证据，但无法通过公共接口读取本地原始数据。',
      },
    ],
    challenges: [
      {
        title: '现场节点资源有限且环境异构',
        failure: '厂区节点的内核、驱动、加速卡和网络条件不同，严格策略可能找不到可运行节点，宽松策略又会扩大数据暴露面。',
        solution: '按任务敏感度预注册可接受的 a3s-box 后端、镜像和资源档位；调度器保留同地域备用节点，普通任务允许 Sandbox 但必须由订单显式选择。',
        residual: '现场硬件故障和补丁窗口无法由协议消除，容量、切换条件与最长中断时间仍需写入 SLA。',
      },
    ],
    security: [
      {
        title: '后端降级、卷残留与跨任务读取',
        failure: 'Worker 把 MicroVM 降级为共享内核、复用上一任务的数据卷，或在清理失败后让后续任务读取残留内容。',
        solution: 'a3s-box 把后端代际、卷 ID、策略根和清理回执写入生命周期事件；恢复必须沿用原后端，清理失败时节点隔离并停止接单。',
        residual: '主机固件、存储控制器和运维人员仍是显式信任边界，高敏数据需叠加磁盘加密、TEE 或专用节点。',
      },
      {
        title: '恶意镜像、模型供应链与数据外泄',
        failure: '签名镜像依赖被投毒，或 Agent 借合法网络工具把输入发往外部。',
        solution: '镜像和模型使用可复现构建、SBOM、签名与 allowlist；a3s-box 默认关闭出站网络，按域名、工具和数据类型授权。密钥短期注入，任务结束后销毁并记录清理回执。',
        residual: '供应链审计只能降低概率，关键任务还需多实现比对和异常输出检测。',
      },
    ],
    sources: [sources.a3s, sources.a3sBox, sources.a3sPower, sources.agentSecurity, sources.survey],
  },
  'poi-proof': {
    implementation: [
      {
        title: '四项条件共同生成结算凭证',
        mechanism: 'ValidPoI = DemandOK ∧ ExecOK ∧ OutcomeOK ∧ UniqueOK。taskKey = H(C ∥ outputRoot ∥ verdictRoot ∥ workerDID ∥ taskClass)，其中 C 已包含 chainId、Runtime 版本、合约根、taskId 和 nonce；任何 AcceptedResult 都必须执行这条确定性派生路径。',
        acceptance: '验证器逐项检查需求签名与托管、终局裁决、执行证据策略和 usedTaskKey；任一失败都不写 PoI，也不能领取结果费。失败任务只生成 FailureReceipt，不伪装成有效贡献。',
      },
      {
        title: '贡献可重算、不可转移',
        mechanism: 'ValidPoI 明细保存类别、质量分、有效成本、时间和来源裁决。epoch 权重由这些终局明细确定性计算，不接受 Worker 自报分值。',
        acceptance: '任意全节点能从终局事件重建同一 poiRoot；修正只能新增反向记录，不能改写历史。',
      },
    ],
    challenges: [
      {
        title: '证明“有人付钱”仍不足以证明真实需求',
        failure: '攻击者可把钱从自己的需求账户付给自己的 Worker，支付手续费换取长期共识收益。',
        solution: '把资金关联、独立需求方数量、任务类别基准和实际外部验收纳入质量因子；对刷量收益封顶，并让挑战成功损失高于单次潜在奖励。',
        residual: '关联分析会有误判且涉及隐私，所以不能用它单独定罪，只能降权并触发额外审查。',
      },
    ],
    security: [
      {
        title: '伪造需求或裁决',
        failure: '攻击者提交离线签名、过期 Validator 集或并未托管资金的订单。',
        solution: 'SignedDemand 绑定 chainId、contractRoot、nonce、预算和截止时间；AcceptedResult 必须包含对应 epoch 的 Validator 集根与法定人数签名，并引用已终局托管状态。',
        residual: '若 Validator 私钥大规模失守，签名本身仍会通过，需要密钥轮换、罚没和社会恢复。',
      },
      {
        title: '重复、切片与类别套利',
        failure: '把一次任务拆成许多小任务，或在多链重复申报同一结果，放大贡献。',
        solution: 'taskKey 统一绑定 C、outputRoot、verdictRoot、workerDID 与 taskClass；跨链通过 C 中的 domain 隔离来源。按任务类别设置最小规模、批次去重和主体上限，异常相似输出进入审查。',
        residual: '语义相同但字节不同的结果难以完全去重，经济上限必须作为最后一道防线。',
      },
    ],
    sources: [sources.survey, sources.contracts],
  },
  'useful-work': {
    implementation: [
      {
        title: '安全功能与工作来源分开',
        mechanism: 'PoW 通过可公开验证的哈希竞争形成稀缺成本，但搜索过程不交付链外业务结果。PoI 将工作对象换成真实需求触发的模型推理，交付结果、执行证据与可核对的资源记录。',
        acceptance: '同一次计算同时产生可交付的模型输出和可独立检查的执行证据；工作来源的替换不直接赋予区块终局权。',
      },
    ],
    challenges: [
      {
        title: '有业务价值不自动等于共识安全',
        failure: '推理结果即使有客户，也可能由关联方循环下单，或成本低到可以大量复制身份。',
        solution: '只接收带预算托管、独立验收和唯一 taskKey 的订单，并将身份成本、保证金与有界权重共同纳入候选资格。',
        residual: 'PoI 网络的抗女巫强度仍需用真实攻击成本和开放网络数据验证。',
      },
    ],
    security: [
      {
        title: '自交易把虚假推理包装成贡献',
        failure: '同一控制方下单、执行和验收，可用循环资金制造 PoI 权重。',
        solution: '要求签名需求、预算托管、独立验收和唯一 taskKey；关联订单降权，并对单主体贡献设置上限。',
        residual: '链下关联无法完全识别，开放网络仍需挑战机制、治理和经济上限。',
      },
    ],
    sources: [sources.bitcoin, sources.chainOpera, sources.survey],
  },
  simulation: {
    implementation: [
      {
        title: '冻结实验后在各数据域本地运行',
        mechanism: '订单固定 modelRoot、sampleRoot、policyRoot、随机种子、统计口径与隐私预算。各机构在受控执行域运行同一版本，只提交加密统计、聚合记录和执行回执。',
        acceptance: 'Validator 能重建统计管线并核对样本承诺、随机种子与聚合结果；任何一方都不需要公开个体画像和轨迹。',
      },
    ],
    challenges: [
      {
        title: '模拟结果不等于现实因果结论',
        failure: '模型假设、样本偏差或行为规则错误，会得到形式正确但现实失真的群体预测。',
        solution: '把假设、适用范围、置信区间和敏感性分析写进验收条件，并用历史回测和多模型对照限制结论强度。',
        residual: 'ACVM 只能证明实验按约运行，不能证明模型对现实社会具有绝对解释力。',
      },
    ],
    security: [
      {
        title: '聚合输出仍可能泄露个体信息',
        failure: '小样本切片、重复查询或差分攻击可从统计结果反推出敏感属性。',
        solution: '设置最小群组规模、查询预算和差分隐私参数；跨机构聚合采用 MPC 或等价受控方案，原始轨迹只保留到挑战期结束。',
        residual: '隐私与统计精度存在不可消除的权衡，高敏场景仍需人工合规审批。',
      },
    ],
    sources: [sources.a3s, sources.a3sPower, sources.dataAvailability, sources.survey],
  },
  'poi-consensus': {
    implementation: [
      {
        title: '四个确定公式连接验收到终局',
        mechanism: '终局 ValidPoI 明细先在各自任务类别内归一得到 qᵢ，再经主体上限和时间衰减得到 wᵢ。候选者计算 VRF 分数，获选者只提交区块，最终由 ValidBlock 与 QC ≥ 2f+1 确认。',
        acceptance: '任意节点从同一终局 PoI 集合和参数重算得到相同权重、poiRoot 与区块有效性；没有法定人数证书不得进入最终状态。',
      },
    ],
    challenges: [
      {
        title: '异构任务权重需要持续校准',
        failure: '简单任务与高成本任务按次数同权会诱导拆单，按自报成本计权又会诱导夸大资源。',
        solution: '按任务类别设置基准成本与质量门槛，使用终局证据估值，并对单主体、单类别和单周期设置上限与衰减。',
        residual: '跨类别公平权重只能通过真实网络数据逐步校准，早期参数应保守且可治理。',
      },
    ],
    security: [
      {
        title: '高权重主体不能同时控制终局',
        failure: '若 PoI 权重直接等于确认票权，积累大量任务的主体可自提议、自验证并固化错误区块。',
        solution: 'ValidPoI 只进入有界候选权重；VRF 保持不可预测选择，其他节点独立重验交易、ValidPoI 和状态转换，再由 BFT 法定人数签名。',
        residual: 'Validator 集合仍可能串谋，需要成员独立性、轮换、挑战和治理恢复机制。',
      },
    ],
    sources: [sources.vrf, sources.cometBft, sources.bitcoin, sources.chainOpera],
  },
  'a3s-box': {
    implementation: [
      {
        title: 'ExecutionManager 管完整工作负载生命周期',
        mechanism: 'a3s-box 从镜像、构建、网络、卷和快照开始，统一管理 create、start、exec、attach、pause、wait、restart、health、logs、stats、events 与 cleanup。请求、解析后的后端、策略和代际都进入持久状态。',
        acceptance: '任务重启或管理进程恢复后仍绑定同一镜像摘要、资源策略和执行后端；重复操作使用同一操作身份，不重复启动、解冻或清理。',
      },
      {
        title: '隔离模式显式选择且不静默降级',
        mechanism: '未提供 isolation 时选择专用内核 MicroVM；显式 Sandbox 才选择共享宿主内核路径。能力预检失败即拒绝，不能从 MicroVM 自动退到 Sandbox，也不能因后续策略变化重路由既有任务。',
        acceptance: '审计记录同时包含请求模式、resolved backend、策略摘要和运行代际；故障恢复沿用原路径，能力不匹配时 fail closed。',
      },
    ],
    challenges: [
      {
        title: '不同平台与后端的能力并不相同',
        failure: '把 Linux KVM、Apple HVF、Windows WHPX 与共享内核 Sandbox 当成等价环境，会错误宣称 TEE、网络、快照或 PTY 能力。',
        solution: '任务启动前读取主机能力并匹配明确的 profile；只宣传通过真实主机门禁的组合，未资格化功能直接拒绝。',
        residual: '硬件、内核和驱动升级会改变资格状态，生产部署仍需持续回归与证据留存。',
      },
    ],
    security: [
      {
        title: '共享内核 Sandbox 不是强租户边界',
        failure: '宿主内核漏洞、恶意管理员、硬件侧信道或危险 bind mount 仍可能突破共享内核隔离。',
        solution: '不可信任务默认使用专用内核 MicroVM；Sandbox 仅用于可信或半可信工具，并限制挂载、网络、设备和密钥。',
        residual: 'MicroVM 也不能消除宿主、固件和侧信道风险，高敏任务还需 TEE、最小权限与远程证明。',
      },
    ],
    sources: [sources.a3sBox, sources.a3sRuntime, sources.a3s],
  },
  'a3s-power': {
    implementation: [
      {
        title: 'TEE 隐私计算建立可独立验证的信任链',
        mechanism: 'a3s-power 可运行在 a3s-box 的 SEV-SNP 或 TDX MicroVM 中，将硬件报告、启动测量、客户端 nonce、modelRoot、运行策略和请求级回执绑定。加密模型加载、日志深度脱敏、敏感内存清零与 RA-TLS / vsock 共同缩小数据暴露面。',
        acceptance: '严格验证器必须校验硬件签名、预期测量值、nonce 新鲜性、模型与策略绑定；模拟 TEE 或缺少任一 pin 的报告不得进入高保证 ValidPoI。',
      },
      {
        title: '参数流式推理将内存峰值控制在单层规模',
        mechanism: 'picolm 的 GGUF 层流式路径只把当前计算层所需权重页载入可信内存，完成 attention 与 FFN 计算后立即释放，再推进下一层。峰值权重驻留量为 O(layer_size)，无需让完整模型常驻 TEE；嵌入式库与服务接口复用同一证明和隐私契约。Token SSE 仅是接口输出能力，不定义流式推理。',
        acceptance: '目标 TEE 能在受限内存中完成完整推理；最终回执绑定实际模型、运行策略、请求摘要与输出摘要，层流路径在不支持的后端上 fail closed。',
      },
    ],
    challenges: [
      {
        title: '执行可信不等于业务结果正确',
        failure: '硬件证明可以确认代码、模型和请求在声明环境中运行，但不能证明模型回答满足业务目标。',
        solution: '将 Power 回执作为 ExecutionEvidence，仍由 ACVM Validator 使用独立业务证据生成 AcceptedResult。',
        residual: '模型偏差、幻觉和验收口径缺陷仍需业务治理，不能用 TEE 报告替代。',
      },
    ],
    security: [
      {
        title: '证明回放、模型替换与流式侧信道',
        failure: '攻击者可能重放旧报告、替换模型文件，或利用 Token 数量、时间和错误日志推断敏感信息。',
        solution: '每次请求绑定新 nonce、模型哈希、运行策略和输出摘要；严格验证硬件签名与测量值，日志脱敏、可选 Token 指标抑制，并在卸载时清零内存。',
        residual: '硬件侧信道、固件漏洞与流量形态泄露无法完全消除，高敏任务仍需批处理、限流和额外隐私预算。',
      },
    ],
    sources: [sources.a3sPower, sources.a3sBox],
  },
  'deployment-modes': {
    implementation: [
      {
        title: '两种部署路径共用同一语义',
        mechanism: 'Rust 原生链把 ACVM Runtime 作为链上状态转换环境；适配模式由 ACVM Core 形成标准任务、裁决、ValidPoI 与结算事件，再通过 ChainAdapter 写入现有国内链。两种路径都不把 Prompt、原始数据、模型与详细证据写入链上。',
        acceptance: '原生链由全节点重放 δACVM；适配模式由目标链合约验证授权、证书、nonce 和状态连续性。两种路径都能把终局回执映射回同一 taskId，但不能把适配模式表述为目标链原生运行完整 Runtime。',
      },
      {
        title: '固定 ChainAdapter ABI，按网络实现 Driver',
        mechanism: 'ACVM Core 只依赖 submitTaskRoot、submitPoIRoot、finalityStatus、claimSettlement 和 subscribeEvents。Adapter 把 taskId、contractRoot、poiRoot、verdictRoot、amount、identityRef 和 nonce 映射到目标链合约；Prompt、原始数据、模型与详细证据留在 A3S 证据存储。',
        acceptance: '每个 Driver 跑同一套 conformance fixtures：重复提交幂等、状态根连续、终局回报单调、重组可检测、同一 verdict 不重复结算。链上事件能反向定位 A3S evidence URI 与摘要。',
      },
      {
        title: '国内基础设施按三类接口接入',
        mechanism: 'BSN 走城市节点 / 专网网关 API 与其承载的联盟链合约；星火·链网走 BIF-Core SDK，并可用 BID 解析主体；自建联盟链直接接长安链或 FISCO BCOS SDK、CA、国密与权限治理。ACVM 不把这些不同产品称成一条统一“国家链”。',
        acceptance: '选定一个具体部署配置后，锁定网络、节点、链框架、证书体系、密码套件、合约地址和终局规则。试点证明国密账户可签名、权限可撤销、任务根可查询、裁决事件可审计。',
      },
    ],
    challenges: [
      {
        title: '身份、支付与链终局来自不同系统',
        failure: '联盟链能确认裁决根，却不天然完成企业 KYC、人民币划拨或发票；把三者都写成链上 token 会破坏真实业务边界。',
        solution: 'IdentityAdapter 映射 CA / BID / DID，PaymentAdapter 调用现有托管或支付服务，ChainAdapter 记录授权引用、裁决和状态。用 saga 与幂等键处理链已终局但支付失败的补偿。',
        residual: '支付机构、银行接口和企业审批仍是外部依赖，试点必须把超时、撤销和人工对账写进 SLA。',
      },
    ],
    security: [
      {
        title: '联盟链证书、委员会或网关被攻破',
        failure: '攻击者取得 CA、合约管理员或网关权限后，可以伪造主体、审查挑战或替换业务合约；多节点不等于多故障域。',
        solution: '身份签发、合约升级、暂停和资金权限分离；跨机构多签与时间锁管理变更；ACVM 客户端校验多个网关 / 节点的区块头与事件，关键证据另做内容寻址副本。',
        residual: '许可链的安全上限由成员治理决定；治理机构共同失守时，ACVM 只能暂停并按审计与恢复方案迁移。',
      },
      {
        title: '把敏感业务材料直接上链',
        failure: '联盟链也会复制数据给多个成员，Prompt、个人轨迹、商业策略或完整模型日志一旦写入账本便难以删除和控制用途。',
        solution: '链上只保存最小根、状态和身份引用；A3S 执行域保存加密证据并按 retention policy 删除。高敏任务使用权限化取证、TEE 或隐私计算，审计者按角色取回。',
        residual: '摘要和时间模式仍可能泄露业务活动，必要时使用批量提交、延迟和访问隔离降低侧信道。',
      },
    ],
    sources: [sources.a3s, sources.a3sRuntime, sources.a3sBox, sources.a3sPower, sources.bsn, sources.sparkChain, sources.chainMaker, sources.fisco],
  },
  'native-chain': {
    implementation: [
      {
        title: 'ACVM Runtime 只执行确定性状态转换',
        mechanism: 'Rust 原生节点把 DeployAgenticContract、OpenInferenceTask、SubmitPrivateReceipt、SubmitAgentVerdict、ResumeContract、Settle 和 RecordPoI 定义为版本化交易。统一承诺 C 绑定 domain、taskId、inputRoot、modelRoot、policyRoot、verifyRuleRoot、splitRoot 与 nonce，状态按 Requested → AwaitingInference → Accepted → Resumed / Settled 单向推进。',
        acceptance: '所有全节点对同一区块重放后得到相同 stateRoot；模型推理、私有数据和外部工具不进入同步区块执行。',
      },
      {
        title: '链下隐私计算，链上智能体验证',
        mechanism: 'Agentic Contract 发布 C 并进入 AwaitingInference。PoI Worker 使用 a3s-box 固定执行边界、使用 a3s-power 完成隐私推理，提交 rPriv = SignWorker(C ∥ envRoot ∥ outputRoot ∥ πpriv)；链上智能体 PoI 验证器形成 R = QC(H(C ∥ rPriv ∥ verdictRoot))。',
        acceptance: '同一 taskId 的合格结果只能被消费一次；合约能读取规范化输出或 outputRoot，继续生成业务状态、工具意图、付款与 splitRoot 分账。',
      },
      {
        title: '同一次有效推理同时形成服务收益与 PoI',
        mechanism: 'Verify(R) 且 taskKey 未消费时，Sₙ₊₁ = δACVM(Sₙ, R) 恢复合约并结算；PoIₙ₊₁ = UpdateBounded(PoIₙ, ValidPoI) 同步更新有界贡献。VRF 负责抽签，BFT 法定人数负责区块终局。',
        acceptance: '服务结算、PoI 记录与状态恢复引用同一 taskId 和 verdictRoot；重复任务、退款或被挑战撤销的结果不能继续累积有效权重。',
      },
    ],
    challenges: [
      {
        title: '模型推理不能阻塞出块',
        failure: '若区块执行同步等待 GPU、外部工具或人工审批，慢节点会拖住全网，超时差异还会造成分叉。',
        solution: '使用 Requested → AwaitingInference → Accepted / Rejected → Resumed / Settled 的异步状态机；出块只处理任务事件、证据验证和确定性状态变化。',
        residual: '合约完成时间仍受 Worker 容量、模型延迟和挑战窗口影响，需要租约、备用 Worker 与明确超时补偿。',
      },
      {
        title: '非确定性模型输出需要确定性验收口径',
        failure: '不同采样、硬件和模型实现可能产生不同文本，要求节点比较逐字输出会拒绝诚实结果。',
        solution: '冻结模型与运行策略；结构化任务验证 schema、阈值和性质，开放任务使用独立业务观测、委员会裁决或多模型复核。',
        residual: '协议能确认结果满足冻结谓词，不能证明开放式回答是唯一真值。',
      },
    ],
    security: [
      {
        title: '自交易可能伪造推理需求与 PoI',
        failure: '同一控制方创建需求、运行 Worker 并控制 Validator，可循环资金制造服务量和候选权重。',
        solution: '要求真实预算托管、独立验收、关联账户合并、任务类别权重封顶和挑战保证金；PoI 只影响候选概率，不直接赋予终局票权。',
        residual: '链下关联关系无法完全识别，高权重主体仍需人工审计、身份成本和持续异常检测。',
      },
      {
        title: 'TEE 与 Validator 串谋会污染链上结果',
        failure: '被攻破的执行环境或同一故障域的 Validator 可能为错误推理签出完整证据链。',
        solution: 'TEE 报告绑定 nonce、模型与策略；委员会按故障域去相关，高价值任务采用跨厂商复算、挑战和可用性收据。证据验证与 BFT 成员权分离。',
        residual: '硬件厂商、证明服务与治理仍是显式信任根，原生链不能把这些依赖变成无条件密码学真相。',
      },
      {
        title: 'Runtime 升级不能改写运行中合约',
        failure: '治理升级验收规则、PoI 权重或结算模块后，可能改变已提交任务的付款与共识收益。',
        solution: '任务固定 runtimeVersion、contractRoot、verifierHash 和 weightPolicy；升级经多签时间锁，只作用于新任务，运行中任务按旧版本完成或显式迁移。',
        residual: '长期维护多个 Runtime 版本会增加节点和审计成本，正式网络需要清晰的支持周期与退出机制。',
      },
    ],
    sources: [sources.polkadotSdk, sources.rustLibp2p, sources.a3sBox, sources.a3sPower, sources.chainOpera, sources.vrf, sources.cometBft, sources.dataAvailability],
  },
} as const satisfies Record<ScreenId, SpeakerGuideDetails>;
