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
        mechanism: '封面以“让有效推理成为链上价值”统领 PoI、结果验收、按约结算和多方分账。产品定义、场景、算法与实现路径由后续页面逐层展开。',
        acceptance: '观众在十秒内能复述 ACVM 的作用：把有效推理转成可验证、可结算、可分配的链上价值。',
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
        mechanism: 'Worker 或 A3S 提交执行回执；ACVM Validator 按 contractRoot 中冻结的证据、阈值和挑战规则生成 AcceptedResult；现有链或支付系统根据终局裁决释放或退回资金。',
        acceptance: '执行成功不能直接提款；没有 AcceptedResult 不能付款；ACVM 不替代执行层，也不替代资金终局。',
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
  'data-space': {
    implementation: [
      {
        title: '冻结多方数据清单与分账规则',
        mechanism: '数字合约逐一记录企业、机构等数据贡献方的 dataProductId、dataRoot、授权范围、用途、次数和环境；SignedDemand 另行冻结业务结果谓词、预算、Validator、挑战期与 splitRoot。splitRoot 表达各方事前确认的分配规则，不代表 ACVM 能自动计算唯一的因果贡献。',
        acceptance: '每个收款方都能追溯到有效数字合约和数据产品版本；缺少 AccessGrant、策略版本不匹配或分账总额不守恒时，ACVM 拒绝结算。',
      },
      {
        title: '履约与结果同时通过后分配收益',
        mechanism: '各方连接器记录数据交付、访问、计算和二次传输日志，并提交 UsageProof 与谱系证明。Worker 回执绑定模型、容器和 outputRoot；Validator 分别签署 UsageCompliant 与 AcceptedResult，两者终局后，ACVM 才按 splitRoot 向多方释放结果池。',
        acceptance: '外部审计者能从数字合约重建到 AccessGrant、UsageProof、AcceptedResult 和 PaymentClaimed；分账总额严格等于结果池，且每个收款项只能领取一次。',
      },
    ],
    challenges: [
      {
        title: '单条数据的因果贡献通常无法客观计算',
        failure: '多个数据集、模型、提示词、算力和人工运营共同产生结果，事后声称某条数据贡献了固定比例会制造虚假精确度并引发分账争议。',
        solution: '签约前冻结任务级分账公式、最低保底与上限；有可靠对照时可把消融实验或边际贡献作为调整证据，但不能在结果出现后单方改权重。',
        residual: 'ACVM 能证明按约使用并产生已验收结果，不能证明唯一真实的因果份额；高价值任务仍需要合同治理与争议仲裁。',
      },
    ],
    security: [
      {
        title: '伪造谱系或重复使用同一授权',
        failure: 'Worker 伪造数据来源、替换数据集，或把一次 AccessGrant 在多个任务和环境中重复使用，再重复领取结果分成。',
        solution: 'AccessGrant、dataRoot、usagePolicyRoot、环境证明和 outputRoot 全部绑定 taskId 与新鲜 nonce；受控环境和空间网关分别签名，Validator 检查连续日志、撤销状态与已使用 taskKey。',
        residual: '若数据空间运营方与 Worker 同时串谋，签名日志仍可能一致但不真实，需要独立审计、抽样复核和组织责任追索。',
      },
      {
        title: '越权复用、数据泄露与推断攻击',
        failure: '模型或 Agent 通过出站网络、日志、缓存、提示词注入或过细输出带走原始数据，也可能在任务结束后继续留存和复用。',
        solution: '最小字段授权、默认禁止出站、短期凭证、隔离执行、输出过滤、查询预算和可撤销密钥共同控制；高敏数据增加 TEE 或多方计算，并把保留与删除证明纳入挑战证据。',
        residual: '硬件侧信道、内部人员和模型记忆无法被完全消除；极高敏数据仍需要线下合规审查、额度限制和人工批准。',
      },
    ],
    sources: [sources.dataTerms, sources.dataTwenty, sources.trustedDataSpacePlan, sources.trustedDataSpaceTech, sources.odrl, sources.contracts, sources.agentSecurity],
  },
  'execution-boundary': {
    implementation: [
      {
        title: '可信执行与结果有效使用两条独立证据链',
        mechanism: 'Worker 回执至少包含 taskId、contractRoot、inputRoot、modelRoot、envRoot、toolCallRoot、outputRoot、前后状态、nonce 和签名，用于证明任务按冻结环境执行。AcceptedResult 另行绑定独立业务证据、验收谓词版本、Validator 身份与法定人数签名，用于证明结果按约达标。',
        acceptance: '节点分别验证执行证明和结果证明，再检查状态转移与防重放；两者同时成立才生成 AcceptedResult，不要求每台节点重跑 GPU 推理。',
      },
      {
        title: '副作用采用意图—确认两阶段',
        mechanism: '发邮件、下单或写外部系统时，Agent 先生成带能力令牌和幂等键的 intent；授权执行器完成后再返回 signed receipt，合约据此推进状态。',
        acceptance: '同一幂等键重复提交不产生第二次副作用；未确认、超时和部分完成都有明确补偿路径。',
      },
      {
        title: '异步状态机避免区块等待推理',
        mechanism: 'contractRoot 固定输入输出 schema、角色、证据策略、预算、超时和补偿动作。链上状态从 Requested 进入 AwaitingInference，收到合格的 AcceptedResult 后才进入 Resumed 或 Settled；模型输出不能直接调用结算入口。',
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
        title: '把 AP2 授权映射为 ACVM 需求，不改写 AP2',
        mechanism: '适配器验证 Intent Mandate 或 Cart Mandate 的签名、主体、范围和有效期，计算 mandateHash 并写入 SignedDemand。ACVM 另加 resultSpecRoot、verificationPolicyRoot、budget、deadline 和 disputePolicy；AP2 负责授权与支付可追责性，ACVM 负责履约结果。',
        acceptance: '官方 AP2 测试向量能通过签名与 schema 校验；mandateHash、需求主体或支付范围不匹配时任务不能入池。没有 AcceptedResult 时，AP2 授权本身不能触发 ACVM 结果费。',
      },
      {
        title: 'A3S 是实际执行底座，不是架构占位符',
        mechanism: 'A3S Flow 记录可重放工作流；Runtime 用 caller-owned request ID 和持久回执管理 Task / Service；Event 保存事件历史；Box 明确选择 MicroVM 或 Sandbox；Power 绑定模型、环境、nonce 与执行回执；Gateway / Sentry 管协议入口和安全控制。ACVM Adapter 将这些记录归一为 ExecReceipt。',
        acceptance: '故障测试在步骤执行后、回执提交前杀进程，恢复后不得重复副作用；ExecReceipt 必须能追到 A3S runId、requestId、artifact digest、policy digest 和证明引用。缺少任一绑定字段则不能进入业务验收。',
      },
      {
        title: 'Verdict 是执行层与结算层之间的唯一闸门',
        mechanism: 'A3S 只报告执行事实，不宣布业务成功。ACVM Validator 分别检查 executionEvidence 和 businessEvidence，生成 verdictRoot；底层链或 AVS 只接受版本化 verifier 对该根的确定判断。',
        acceptance: '替换模型、A3S Provider、支付轨道或底层链后，同一验收测试向量仍得到相同 Verdict；任何 A3S succeeded 状态都不能绕过 AcceptedResult 直接提款。',
      },
    ],
    challenges: [
      {
        title: '三套协议版本会独立演进',
        failure: 'AP2 schema、A3S receipt 和 ACVM contractRoot 任一升级，都可能让旧任务无法重放或被新验证器误判。',
        solution: '每个任务固定 ap2Profile、a3sReceiptVersion、acvmContractVersion 和 verifierHash；适配器按版本注册，发布前跑跨版本 golden fixtures，运行中任务禁止隐式升级。',
        residual: '版本矩阵会增加运维成本，早期试点应只支持一组明确锁定的协议版本。',
      },
    ],
    security: [
      {
        title: 'Mandate 重放与权限过宽',
        failure: '攻击者把同一授权搬到另一任务、商户或支付轨道，或者利用模糊意图扩大金额和商品范围。',
        solution: 'mandateHash 做 domain separation，绑定主体、商户、支付轨道、币种、金额上限、有效期、nonce 和 taskId；任何范围扩张必须取得新签名，敏感执行采用最小权限能力令牌。',
        residual: '自然语言意图仍可能含歧义，高金额任务必须把可执行范围转成结构化字段并允许人工确认。',
      },
      {
        title: '执行回执摘要不等于硬件真实性',
        failure: '攻击者可以自己构造格式正确的 receipt JSON；仅有 SHA-256 只能证明相对某个可信锚点未变化，不能证明运行发生在声明硬件上。',
        solution: '普通任务用签名 Provider 身份与抽检；高保证任务要求 A3S Power / Box 的远程证明、nonce 新鲜性、可信发布或等价外部 pin，并校验证明链和撤销状态。',
        residual: 'TEE 厂商、证明服务和签名发布仍是显式信任根，不能包装成无条件密码学真相。',
      },
    ],
    sources: [sources.ap2, sources.ap2Overview, sources.ap2Lab, sources.a3s, sources.a3sRuntime, sources.a3sPower, sources.survey],
  },
  'fog-inference': {
    implementation: [
      {
        title: '可验证调度租约',
        mechanism: '调度器按地域、延迟、加速卡、价格、数据驻留和证明策略过滤 Worker，随后签发绑定 taskId、镜像哈希、资源上限和到期时间的 lease。',
        acceptance: 'Worker 在 lease 内回传启动证明；超时、镜像不符或资源声明不匹配即撤销，调度器转交备用节点。',
      },
      {
        title: '证明环境而不是公开数据',
        mechanism: '可信执行环境以挑战 nonce 生成远程证明，绑定测量值、镜像哈希和临时加密公钥。需求方只向通过证明的公钥加密输入，结果以 outputRoot 和加密产物返回。',
        acceptance: 'Verifier 检查证明签发链、新鲜 nonce、允许的测量值和安全版本；过期或被撤销的平台证书不接受。',
      },
    ],
    challenges: [
      {
        title: '异构硬件与可用性',
        failure: '不同 TEE、驱动和 GPU 组合的证明格式不同；严格白名单会使节点不足，宽松又扩大攻击面。',
        solution: '用统一 Evidence API 适配厂商证明，策略按任务敏感度分级；高敏任务只用审核组合并保留跨厂商备用池，普通任务可采用抽样复算。',
        residual: '硬件供应集中和补丁窗口无法由协议消除，必须把可用容量和撤销演练纳入 SLA。',
      },
    ],
    security: [
      {
        title: '证明回放、降级与侧信道',
        failure: '恶意 Worker 重放旧证明、降级到有漏洞固件，或通过缓存和时间侧信道窃取数据。',
        solution: 'nonce 绑定 taskId 和 lease；校验安全版本与撤销状态；禁用调试、限制共享资源、最小化驻留时间。高价值任务在不同厂商节点重复执行或采用 MPC，避免单点 TEE 信任。',
        residual: '远程证明只能说明某个测量环境启动，不能证明芯片无后门或运行期无侧信道。',
      },
      {
        title: '恶意镜像、模型供应链与数据外泄',
        failure: '签名镜像依赖被投毒，或 Agent 借合法网络工具把输入发往外部。',
        solution: '镜像和模型使用可复现构建、SBOM、签名与 allowlist；默认关闭出站网络，按域名和数据类型授权。密钥短期注入，任务结束后销毁并记录证明。',
        residual: '供应链审计只能降低概率，关键任务还需多实现比对和异常输出检测。',
      },
    ],
    sources: [sources.a3s, sources.a3sPower, sources.agentSecurity, sources.survey],
  },
  'poi-proof': {
    implementation: [
      {
        title: '四项条件共同生成结算凭证',
        mechanism: 'ValidPoI = SignedDemand ∧ AcceptedResult ∧ ExecutionEvidence ∧ UniqueTaskKey。taskKey 由 taskId、verdictRoot、Worker 和任务类别做域隔离哈希；任何 AcceptedResult 都必须执行这条确定性派生路径。',
        acceptance: '验证器逐项检查需求签名与托管、终局裁决、执行证据策略和 usedTaskKey；任一失败都不写 PoI，也不能领取结果费。失败任务只生成 FailureReceipt，不伪装成有效贡献。',
      },
      {
        title: '贡献可重算、不可转移',
        mechanism: 'PoI 明细保存类别、质量分、有效成本、时间和来源裁决。epoch 权重由这些终局明细确定性计算，不接受 Worker 自报分值。',
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
        solution: 'taskKey 纳入规范化输出根和需求 nonce；跨链注册全局来源域。按任务类别设置最小规模、批次去重和主体上限，异常相似输出进入审查。',
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
        mechanism: '终局 PoI 明细先在各自任务类别内归一得到 qᵢ，再经主体上限和时间衰减得到 wᵢ。候选者计算 VRF 分数，获选者只提交区块，最终由 ValidBlock 与 QC ≥ 2f+1 确认。',
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
        solution: 'PoI 只进入有界候选权重；VRF 保持不可预测选择，其他节点独立重验交易、PoI 和状态转换，再由 BFT 法定人数签名。',
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
        title: 'ACVM 标准状态是链适配边界',
        mechanism: 'A3S 执行域完成模型运行与证据归集，ACVM/Validator 完成结果验收。ACVM 只向 ChainAdapter 输出 taskRoot、verdictRoot、poiRoot、identityRef、amount、nonce 和目标终局状态；Prompt、原始数据、模型与详细证据不进入通用链适配层。',
        acceptance: '对任一目标链，同一标准状态都能生成唯一链上事件，并把不可回退的终局回执映射回原 taskId；适配层不得修改验收结果。',
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
        title: 'Rust Runtime 只执行确定性状态转换',
        mechanism: '原生节点把 DeployContract、OpenInferenceTask、SubmitExecReceipt、SubmitVerdict、ResumeContract、Settle 和 RecordPoI 定义为版本化交易。Runtime 固定编码、验签、根承诺、防重放与状态转换；P2P、交易池、状态数据库和区块执行可参考 Rust 区块链 SDK 与 rust-libp2p 组件实现。',
        acceptance: '所有全节点对同一区块重放后得到相同 stateRoot；模型推理、私有数据和外部工具不进入同步区块执行。',
      },
      {
        title: 'PoI Worker 是链上 ACVM 的推理服务层',
        mechanism: 'Agentic Contract 发布绑定 taskId、modelRoot、inputRoot、policyRoot、预算、截止时间和 Validator 规则的 InferenceTask，并进入 AwaitingInference。PoI Worker 使用 a3s-box 固定执行边界、使用 a3s-power 完成隐私推理，提交 ExecReceipt；AcceptedResult 通过后 Runtime 恢复合约状态。',
        acceptance: '同一 taskId 的合格结果只能被消费一次；合约能读取规范化输出或 outputRoot，继续生成业务状态、工具意图、付款与 splitRoot 分账。',
      },
      {
        title: '同一次有效推理同时形成服务收益与 PoI',
        mechanism: 'AcceptedResult 触发结果费，同时按 SignedDemand、ExecutionEvidence、AcceptedResult 和 UniqueTaskKey 派生 ValidPoI。PoI 经过任务类别归一、封顶和衰减后只形成候选提议权重；VRF 负责抽签，BFT 法定人数负责区块终局。',
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
  'security-boundaries': {
    implementation: [
      {
        title: '按资产—入口—控制—恢复做威胁模型',
        mechanism: '对预算、结果、PoI、密钥和隐私数据分别列出攻击者目标；每条路径至少有预防、检测和恢复措施，并指定可观测指标与负责人。',
        acceptance: '上线门槛不是“做过审计”，而是关键威胁都有可执行测试、报警阈值、暂停权限和恢复演练记录。',
      },
      {
        title: '密钥与治理分权',
        mechanism: 'Worker、Validator、升级、暂停、资金和桥接使用不同密钥；高权限密钥进入 HSM/硬件钱包，多签成员跨机构，变更带时间锁。',
        acceptance: '演练单个密钥失守、成员离线和全网暂停；系统应能吊销角色而不改写已终局任务。',
      },
    ],
    challenges: [
      {
        title: '“多个 Validator”可能只是同一个故障域',
        failure: '表面上有五个节点，实际共用云账号、RPC、数据源、代码和运营团队，一次故障就全部失真。',
        solution: '登记运营主体、云区域、客户端、证明硬件和数据源；委员会抽样按故障域去相关。安全看板展示有效独立数，而不是只数地址。',
        residual: '组织关系很难完全验证，需要合同披露、随机审计和经济惩罚共同约束。',
      },
    ],
    security: [
      {
        title: '自交易、串谋与贿赂',
        failure: '需求方、Worker 和 Validator 隐蔽关联，或攻击者用链下贿赂换取通过票。',
        solution: '资金与身份图谱只做风险分层；委员会临近验收才随机揭示；Validator 锁定高于可得贿赂的保证金，投票和证据公开可挑战，单主体权重封顶。',
        residual: '无法证明所有链下关系，极高价值任务需要更多独立证据和人工合规。',
      },
      {
        title: '审查、拒绝服务与挑战洪泛',
        failure: '攻击者堵塞任务队列、阻止挑战上链，或用大量无效挑战拖延所有付款。',
        solution: '请求先付费并限速；挑战者缴纳与验证成本相关的 bond；多入口广播、优先通道和自动延长挑战期。核心合约避免无界循环，批量任务可分段结算。',
        residual: '链级拥堵无法完全规避，应为长时间停机定义退款和线下争议流程。',
      },
      {
        title: '治理捕获与紧急权限滥用',
        failure: '管理员以“修复漏洞”为由修改权重、替换 Validator 或转移托管资金。',
        solution: '参数、代码、成员和资金权限分开；常规变更走多签时间锁，紧急暂停只能冻结不能转账。所有动作公开事件，恢复需更高门槛并给用户退出期。',
        residual: '紧急治理是明确的信任假设，演示中不能把它包装成纯算法自治。',
      },
    ],
    sources: [sources.contracts, sources.agentSecurity, sources.cometBft, sources.survey],
  },
  'economy-roles': {
    implementation: [
      {
        title: '托管分账瀑布',
        mechanism: '预算拆成结果池、数据或执行费、证据费、验证费、链上费和安全准备金。GEO 的结果池可付给单一 Worker；可信数据空间可按 splitRoot 分给数据提供方、模型方和运营方。Accepted 释放结果池；正常未达标只退结果池；Fraud 才罚保证金。',
        acceptance: '会计不变量覆盖三条路径，任何状态下资产都可归属；正常未达标与可证明作恶使用不同错误码和资金结果，所有分账之和严格等于对应资金池。',
      },
      {
        title: '用攻击成本反推保证金',
        mechanism: 'Worker bond 至少覆盖一次可获不当收益与调查成本；Validator bond 按其可影响的在途订单上限计算。大额订单提高委员会规模或分阶段验收。',
        acceptance: '定期做偿付能力压力测试：同时争议、资产价格下跌和链上 gas 飙升时，准备金仍能支付挑战与退款。',
      },
    ],
    challenges: [
      {
        title: '不能把模型不确定性都当作作恶',
        failure: '如果任何未达标都罚没，Worker 会提高报价或只接简单任务，市场反而失去有效供给。',
        solution: '区分 normal miss、SLA breach 和 fraud：正常未达标不拿结果费；超时按 SLA 扣款；只有双签、伪证或隐瞒样本等可验证行为才罚没。',
        residual: '边界案例仍需仲裁，仲裁费和时限要在签约时写明。',
      },
    ],
    security: [
      {
        title: '贿赂与保证金不足',
        failure: 'Validator 可获贿赂高于被罚金额，或资产价格暴跌后保证金不再覆盖风险。',
        solution: '按在途风险动态提高 bond，使用流动性好且设置折扣的抵押品；随机委员会和延迟解押延长追责窗口。单次可影响金额不得超过有效保证金的倍数上限。',
        residual: '极端行情仍可能穿透抵押，需限额、保险准备金和暂停新增大单。',
      },
      {
        title: '挑战骚扰与拖延付款',
        failure: '竞争对手不断提交廉价挑战，耗尽验证资源并拖垮 Worker 现金流。',
        solution: '挑战 bond 随证据成本定价；无效挑战支付复核费用，成功挑战退 bond 并领取罚没奖励。重复理由合并处理，挑战窗口到期后确定终局。',
        residual: '高 bond 会阻挡资金较少的诚实挑战者，可由独立安全池代垫但需防止其被捕获。',
      },
      {
        title: '抢跑、排序权与 MEV',
        failure: '排序者看见高价值任务后抢先注册相似需求，或审查挑战和结算交易以提取收益。',
        solution: '敏感参数先承诺后揭示，批量竞价或统一截止时间减少先到优势；挑战提供强制入口，结算价格不依赖单区块可操纵的现货值。',
        residual: '承诺—揭示增加一轮延迟，且无法消除跨域信息泄露；高价值任务应优先隐私交易入口。',
      },
    ],
    sources: [sources.dataTwenty, sources.trustedDataSpacePlan, sources.contracts, sources.cometBft, sources.survey],
  },
} as const satisfies Record<ScreenId, SpeakerGuideDetails>;
