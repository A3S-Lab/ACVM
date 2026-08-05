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
  a3sPower: {
    label: 'A3S Power 可验证推理与执行回执',
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
        title: '封面只保留一个产品承诺',
        mechanism: '封面只出现 ACVM 和“让 AI 服务按已验证结果付费”。产品定义、PoI、场景和技术边界全部从后续页面展开。',
        acceptance: '观众在十秒内能复述产品名与付款条件；封面没有目录、功能清单、按钮或机制说明。',
      },
    ],
    challenges: [
      {
        title: '一句话容易被理解成保证业务成功',
        failure: '“已验证结果”可能被误听成协议保证结果客观正确，而不是按事前规则完成验收。',
        solution: '将“已验证结果”明确为按签名验收条件通过的结果。',
        residual: '开放式任务仍依赖验收口径和 Validator 独立性，协议不能创造客观真值。',
      },
    ],
    security: [
      {
        title: '封面承诺必须受产品边界约束',
        failure: '若后续方案允许无验收、无执行证据或可重放任务付款，封面主张就无法成立。',
        solution: '把 SignedDemand、AcceptedResult、ExecutionEvidence 和 UniqueTaskKey 固化为 ValidPoI 与付款的必要条件。',
        residual: '必要条件只能证明按规则验收，验收规则本身仍需需求方、Validator 和治理共同负责。',
      },
    ],
    sources: [sources.survey],
  },
  'product-thesis': {
    implementation: [
      {
        title: '先建立唯一任务身份',
        mechanism: '需求方签名后生成 taskId：把链标识、contractRoot、需求 nonce、需求方地址和 inputRoot 一起做域隔离哈希。此后 Worker 回执、Validator 裁决、付款和 PoI 都必须引用它；ANS 等发现协议只是可选适配。',
        acceptance: '同一 taskId 只能存在一条合法状态链；任何缺字段、跨链复用或前后状态根不连续的回执都被拒绝。',
      },
      {
        title: '三层责任不能互相冒充',
        mechanism: 'Worker 或 A3S 只报告执行事实；ACVM Validator 按事前策略生成 AcceptedResult；现有链或支付系统只根据终局裁决释放资金。ValidPoI 是结算凭证，未来贡献账是独立开关。',
        acceptance: 'A3S succeeded 不能直接提款；没有 AcceptedResult 不能生成 ValidPoI；网络权重关闭时，结算仍能独立完成。',
      },
    ],
    challenges: [
      {
        title: '产品边界容易被愿景吞没',
        failure: '如果把 AP2、ANS、雾计算、AVS、VRF 和 BFT 都说成 ACVM 的当前必选组件，早期落地会变成无法交付的全栈工程。',
        solution: '主线只保留 SignedDemand、执行回执、独立裁决、ValidPoI 和结算；发现、隐私执行和网络权重全部通过版本化接口按需接入。',
        residual: '适配器仍会带来版本和信任矩阵，试点必须只选择一组锁定实现。',
      },
    ],
    security: [
      {
        title: '底层链重组或审查',
        failure: '任务已经显示通过，但承载结算的链发生重组；或者攻击者长期阻止挑战交易上链。',
        solution: '链适配器为每条链配置最小终局门槛；大额订单等待经济终局或 BFT 终局。挑战期按最坏拥堵时间设置，并提供多入口提交与紧急暂停。',
        residual: '若底层共识本身失效，ACVM 不能凭空恢复终局，只能暂停结算并按治理预案迁移。',
      },
      {
        title: '自买自卖与重复计分',
        failure: '同一控制人制造需求、执行和验收，循环支付以换取 PoI 权重。',
        solution: '试点阶段 PoI 权重系数保持为零；结果结算仍要求真实托管成本、独立 Validator 和唯一 taskKey。未来开放权重前再引入身份关联分析与主体上限。',
        residual: '隐蔽关联无法被密码学彻底识别，因此即使未来开放，PoI 也只能增加提议概率，不能直接决定终局。',
      },
    ],
    sources: [sources.survey, sources.contracts],
  },
  'product-snapshot': {
    implementation: [
      {
        title: '托管状态机',
        mechanism: '订单按 Funded → Running → Submitted → Accepted / Rejected → Settled 转移。每个入口校验调用角色、截止时间、上一状态和 nonce；资金只由终局状态驱动。',
        acceptance: '用状态机不变量检查“总托管额 = 可退额 + 可付额 + 已付额”，并保证 settle、refund 和 slash 都是幂等操作。',
      },
      {
        title: '把验收条件做成版本化清单',
        mechanism: 'contractRoot 固定输入 schema、Worker 版本、证据格式、Validator 集、阈值、挑战期和分账规则。任务只保存根，完整清单放在可用性层。',
        acceptance: '执行和裁决必须复算出相同 contractRoot；升级只能创建新版本，不能改写运行中的订单。',
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
  simulation: {
    implementation: [
      {
        title: '可复核的实验清单',
        mechanism: 'experimentRoot 固定模型与容器哈希、样本承诺、随机种子协议、步数、统计函数、差分隐私预算和允许输出字段。原始轨迹不进入公共账本。',
        acceptance: '每次运行提交 manifestRoot、aggregateRoot、随机性证明和环境证明；复核方能确认“同一实验定义”，但看不到个体数据。',
      },
      {
        title: '隐私域内计算，域外只交统计量',
        mechanism: '数据留在雾节点或可信执行环境；跨节点只做安全聚合。输出先经过最小分组阈值、裁剪和差分隐私，再由多个节点签名。',
        acceptance: '隐私会计器拒绝超预算查询；Validator 检查参与节点数、聚合签名、噪声参数和重复查询累计预算。',
      },
    ],
    challenges: [
      {
        title: '可重复与隐私天然冲突',
        failure: '完全公开种子和轨迹便于复算，却可能暴露个体；完全隐藏又让客户只能相信运营方。',
        solution: '用承诺—揭示生成种子，公开模型和统计管线，隐藏个体输入；由独立隐私域重复运行并比较分布，而不是逐条公开轨迹。',
        residual: '隐私增强会降低精度和逐项可解释性，订单必须预先写清可接受误差。',
      },
    ],
    security: [
      {
        title: '随机种子研磨',
        failure: '执行方反复试种子，只提交最符合预期的一次模拟。',
        solution: '需求方、Worker 和 Validator 分别承诺随机份额，截止后共同揭示；最终种子绑定 taskId，缺席方用预先约定的不可偏置替代值处理。',
        residual: '最后揭示者仍可能选择中止，因此需要扣除保证金并允许重新抽取，不能把中止当成普通失败。',
      },
      {
        title: '成员推断、模型提取与隔离环境失守',
        failure: '攻击者通过细粒度统计反推个人，或利用侧信道、恶意镜像和出站网络带走数据。',
        solution: '执行镜像白名单、远程证明新鲜 nonce、禁用默认出站、最小化可见数据；输出实施差分隐私和查询预算。高敏任务用多方安全聚合，不把单一 TEE 当唯一信任根。',
        residual: '硬件和统计隐私都有适用边界；极高敏感数据需要线下合规审查和人工批准。',
      },
    ],
    sources: [sources.survey, sources.agentSecurity],
  },
  'geo-poi-boundary': {
    implementation: [
      {
        title: '跨组织结果协作采用 ACVM',
        mechanism: '参与方跨组织、结果可争议或需要验收后付款时，ACVM 统一固定验收、挑战、追责和结算规则。',
        acceptance: '试点立项材料明确签名订单、验收证据、挑战期、分账规则和结算接口。',
      },
      {
        title: '结算价值与网络愿景分开验收',
        mechanism: '跨组织 ACVM 在 AcceptedResult 后生成 ValidPoI，并由现有链或支付系统完成结果结算。开放供给后，同一 PoI 才可能进入激励和提议权重；两条路径使用独立开关与不变量。',
        acceptance: '网络权重关闭时，ValidPoI 仍能完成 GEO 付款；未来重新开启权重也不能改变已经终局的业务付款。',
      },
    ],
    challenges: [
      {
        title: '跨组织独立性建设',
        failure: '如果首批需求方、Worker 和 Validator 都由同一团队运营，PoI 还不能证明开放网络已经具有独立性。',
        solution: '先用 permissioned pilot 生成 shadow PoI，测量观察成本、争议率、供给集中度和跨机构需求；只有新增独立供给显著降低成本或提高覆盖，才让 PoI 影响真实激励。',
        residual: '早期合作伙伴样本会高估协同意愿，开放网络的经济性必须用对抗性订单重新验证。',
      },
    ],
    security: [
      {
        title: '过早让 PoI 控制权重会把刷单变成共识攻击',
        failure: '需求方与 Worker 自买自卖，仍能完成形式上的 GEO 订单，再把付款循环成贡献权重。',
        solution: 'PoI 权重上线门槛包括独立需求方比例、关联交易率、制造单位权重的最低成本和 Validator 有效独立数；不达标时仍生成 PoI 并结算业务，但权重系数保持为零。',
        residual: '组织关联无法由密码学完全识别，因此 PoI 永远不能单独决定付款或 BFT 终局。',
      },
    ],
    sources: [sources.survey, sources.contracts, sources.eigenRestaking],
  },
  'useful-work': {
    implementation: [
      {
        title: '用同一张工程表比较 proof predicate',
        mechanism: 'Bittensor / Allora 比较相对质量并分配激励；Gensyn Verde / EigenAI 验证声明模型的忠实执行；EigenLayer AVS 提供可罚没 Operator 安全；ChainOpera 记录广义 AI 贡献。ACVM 的 predicate 是“签名订单的业务结果已按事前规则通过”。',
        acceptance: '每个比较项必须能回答证明对象、裁决者、经济结果和剩余信任四列；资料未证明的生产能力标成路线或设计，不把白皮书目标写成已交付事实。',
      },
      {
        title: '竞品能力作为可插拔证据或安全层',
        mechanism: 'ACVM 可以接收 Verde / EigenAI 一类 ExecProof，也可以把 Validator 服务做成 EigenLayer AVS；这些组件只替换 executionEvidence 或 validatorSecurity 接口，不替换 verificationPolicy 和 Verdict。',
        acceptance: '替换执行证明或 Operator Set 后，同一业务验收测试向量必须得到相同裁决；只有 ACVM 验收策略能触发结果结算。',
      },
    ],
    challenges: [
      {
        title: 'PoI 不是行业统一术语',
        failure: '不同项目用 PoI、incentive consensus、verification 或 AVS 描述不同层级，按名称比较会把预测评分、执行正确和业务验收混在一起。',
        solution: '评审只比较公开规范中的状态机与 predicate；把“当前主网”“测试网”“研究原型”“未来 L1 路线”分栏，不用代币市值或宣传语代替工程成熟度。',
        residual: '项目实现会持续变化，正式选型前仍需针对目标版本做代码、部署和经济参数复核。',
      },
    ],
    security: [
      {
        title: '质量共识会被评分权和 stake 集中影响',
        failure: 'Validator / Reputer 的评分、损失函数或 stake 分布被少数主体控制时，相对质量共识可以稳定地产生错误激励。',
        solution: 'ACVM 不直接复用外部网络的质量分作为 AcceptedResult；外部分数只是一项 evidence，仍需订单指定的数据源、阈值、故障域和挑战路径。',
        residual: '开放式业务质量最终仍含治理判断，无法被执行证明完全消除。',
      },
      {
        title: '执行正确与经济安全都不能替代业务正确',
        failure: '可复现执行能忠实地产生错误答案；再质押 Operator 也可能对一个定义错误的任务形成高额 quorum。',
        solution: 'ACVM 强制拆分 ExecProof、BusinessEvidence 和 VerificationPolicy；EigenLayer slashing 只处罚可客观举证的协议违规，业务争议进入订单约定的复测或仲裁。',
        residual: '若验收规格本身写错，所有节点都可能诚实地执行错误规则，需求方仍需承担规格责任。',
      },
    ],
    sources: [sources.bittensor, sources.allora, sources.gensynVerde, sources.eigenAi, sources.eigenRestaking, sources.eigenAvs, sources.chainOpera],
  },
  'execution-boundary': {
    implementation: [
      {
        title: '链下执行，链上验证回执',
        mechanism: 'Worker 回执至少包含 taskId、contractRoot、inputRoot、modelRoot、envRoot、outputRoot、前后状态、nonce、证据引用和签名。共识节点只执行有界、确定性的验证器。',
        acceptance: '节点校验签名、根承诺、状态转移和证据策略后得到同一布尔结果；不要求每台节点重跑 GPU 推理。',
      },
      {
        title: '副作用采用意图—确认两阶段',
        mechanism: '发邮件、下单或写外部系统时，Agent 先生成带能力令牌和幂等键的 intent；授权执行器完成后再返回 signed receipt，合约据此推进状态。',
        acceptance: '同一幂等键重复提交不产生第二次副作用；未确认、超时和部分完成都有明确补偿路径。',
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
    sources: [sources.dataAvailability, sources.contracts, sources.survey],
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
  ans: {
    implementation: [
      {
        title: '签名服务记录',
        mechanism: 'ANS 记录包含名称、DID、能力 schema、版本、A2A 端点、价格、有效期、序号、Validator 策略和记录签名。大字段存内容寻址层，链上保存 recordRoot。',
        acceptance: '解析器验证 DID 控制密钥、签名、单调序号、validUntil 和 recordRoot；A2A 握手还要证明端点持有记录中声明的密钥。',
      },
      {
        title: '信誉按能力隔离',
        mechanism: '每份终局回执只更新对应能力、任务类别和价格区间的成功率、争议率与样本量，不能把廉价分类任务的成绩搬到高风险医疗任务。',
        acceptance: '信誉查询必须返回统计窗口、样本量和回执根，客户端能独立抽查原始终局事件。',
      },
    ],
    challenges: [
      {
        title: '更新、缓存与撤销的时间差',
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
  'agentic-contract': {
    implementation: [
      {
        title: '合约目录与异步状态机',
        mechanism: '目录固定 input/output schema、Worker 接口、Validator 接口、证据策略、预算、超时、补偿动作和结算规则并生成 contractRoot。状态机只接受声明过的事件。',
        acceptance: '每条状态转移都有前置条件、授权角色和最大执行次数；模型输出本身不能直接调用结算入口。',
      },
      {
        title: '能力令牌约束 Agent',
        mechanism: '任务启动时按步骤签发短期、单用途令牌，限定工具、对象、金额、网络目标和调用次数。Worker 不能继承调度器或需求方的长期凭证。',
        acceptance: '网关拒绝越权目标、过期令牌和预算超限；所有工具调用生成可关联 taskId 的审计回执。',
      },
    ],
    challenges: [
      {
        title: '长任务会跨版本、跨超时、跨人工审批',
        failure: '把一切塞进单笔交易会超出 gas 和时间限制；随意续跑又会让旧权限长期有效。',
        solution: '按 checkpoint 拆分步骤，每步有租约、截止时间和恢复令牌。升级只影响新任务；运行中任务按原 contractRoot 完成、取消或显式迁移。',
        residual: '跨版本迁移无法完全自动化，状态不可兼容时必须退款并重新签约。',
      },
    ],
    security: [
      {
        title: '提示注入、工具误用与 confused deputy',
        failure: '网页或文档中的恶意指令诱导 Agent 使用合法工具泄露数据、转账或删除资源。',
        solution: '模型文本永远视为不可信数据；策略引擎在模型之外校验能力令牌、目标、金额和数据分类。高风险动作要求确定性规则或人工二次批准，工具响应也做 schema 校验。',
        residual: '模型仍可能在允许范围内做出低质量决策，因此权限范围和单次损失上限比“更聪明的提示词”更重要。',
      },
      {
        title: '合约重入、未检查外部调用与升级后门',
        failure: '外部适配器回调重入状态机，失败调用被当作成功，或升级管理员绕过原约束。',
        solution: '采用 checks-effects-interactions、pull payment、显式检查返回值和重入锁；适配器按 allowlist 版本固定。升级经多签、时间锁和用户退出窗口，运行中任务不可热换逻辑。',
        residual: '复杂业务逻辑仍需形式化不变量、审计与限额，不能只靠通用安全模板。',
      },
    ],
    sources: [sources.agentSecurity, sources.contracts, sources.survey],
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
  'poi-consensus': {
    implementation: [
      {
        title: '有上限的提议权重',
        mechanism: '候选公式可写成 weight = min(cap, log(1 + Σ normalizedPoI × quality × decay))。先按类别归一，再按主体聚合，防止大任务和高频小任务直接垄断。',
        acceptance: '所有输入来自已终局 PoI；全节点在 epoch 边界计算相同权重根，参数变更延迟一个以上 epoch 生效。',
      },
      {
        title: 'VRF 抽签与 BFT 终局分工',
        mechanism: '候选者对 epoch、poiRoot、上一轮随机数和 validatorId 做域隔离 VRF；满足权重阈值者可提议。区块仍需超过三分之二投票权预提交形成 QC。',
        acceptance: '节点验证 VRF 证明、PoI 权重、交易和状态转移；提议者不能用自己的 PoI 证明替代法定人数投票。',
      },
    ],
    challenges: [
      {
        title: '避免随机数研磨和权重自证循环',
        failure: '提议者尝试多个 poiRoot 或延迟任务入池，挑选对自己有利的 VRF 输入；又用自己产出的 PoI 控制验证集。',
        solution: 'epoch 截止前冻结 PoI 集；随机输入继承上一轮不可预测承诺；候选权重与 BFT 投票权分开管理。连续缺块或选择性收录会削减收益并触发替补。',
        residual: '最后贡献者和网络延迟仍可能造成轻微偏置，需要在测试网量化，不能先假定可忽略。',
      },
    ],
    security: [
      {
        title: 'PoW：多数算力、重组与审查',
        failure: '攻击者若长期拥有多数算力，可以更快扩展私有链、回滚自己的付款并排除交易；终局是随确认数增强的概率。',
        solution: '依赖算力和矿池分散、全节点独立验块、足够确认深度与攻击后经济损失。收款方按金额和观测算力选择确认数，不把“六次确认”当绝对保证。',
        residual: '当攻击者算力接近或超过诚实网络时，等待时间迅速失去保护作用。',
      },
      {
        title: 'PoS：无利害、长程、研磨与审查',
        failure: '签多个分叉的边际成本低；已退出验证者可能制造旧历史；大额质押者还能延迟终局或审查。',
        solution: '双签和冲突投票可罚没；检查点提供确定终局；新节点从多个独立来源取得近期弱主观检查点，间隔短于退出期；随机数采用不可预测混合并保持客户端多样性。',
        residual: '大比例质押攻击最终仍可能需要社会层选链；弱主观同步明确引入了近期检查点信任。',
      },
      {
        title: 'BFT / PoA：串谋、停机与密钥失守',
        failure: 'BFT 在恶意投票权达到三分之一时不再保有既定保证，且可阻止终局；PoA 的少数机构密钥被盗或串谋时可直接审查。',
        solution: 'Validator 跨运营方、地域和客户端分散；双签可证明并罚没；密钥放 HSM，支持轮换和替补。PoA 还需多签治理、透明成员变更和退出机制。',
        residual: '许可型集合的抗审查上限就是其治理独立性；超过容错阈值时只能暂停并人工恢复。',
      },
      {
        title: 'ACVM：PoI 操纵与验证者串谋',
        failure: '刷量者获得更多提议机会，或 Worker 与 Validator 合谋接受低质结果，再共同控制区块。',
        solution: 'PoI 归一、封顶、衰减并只控制提议资格；BFT 投票权单独约束。委员会随机抽取、披露利益冲突，错误裁决可挑战和罚没，网络保留弱主观检查点与紧急停机。',
        residual: 'ACVM 的新增信任集中在业务验收和身份关联；在真实攻击成本未测出前，不应开放无限 PoI 权重。',
      },
    ],
    sources: [sources.bitcoin, sources.posAttacks, sources.weakSubjectivity, sources.cometBft, sources.vrf],
  },
  'verification-engine': {
    implementation: [
      {
        title: '按任务选择证据组合',
        mechanism: 'verificationPolicyRoot 固定复算、乐观挑战、TEE、零知识证明、外部观察或人工仲裁的组合，以及阈值、成本和挑战期。任务启动后不能临时换验证方式。',
        acceptance: 'Validator 只运行策略清单中的验证器，并把每个子验证器的版本、输入根和结果写入 verdictRoot。',
      },
      {
        title: '证据生命周期',
        mechanism: '原始证据内容寻址，链上保存根与可用性收据；隐私证据加密给授权挑战者。存储租约至少覆盖执行期、挑战期和审计保留期。',
        acceptance: '结算前随机取回证据分片；取回失败、版本不符或证明过期都会延长挑战期而不是直接付款。',
      },
    ],
    challenges: [
      {
        title: '密码学证明不等于业务真相',
        failure: 'TEE 能证明某镜像运行过，ZK 能证明电路关系成立，但两者都不自动证明 GEO 提升或模拟假设合理。',
        solution: '把运行完整性和业务验收拆成两个 verdict；只有两者都通过才结算。演讲时要明确每种证据回答哪个问题、没有回答哪个问题。',
        residual: '开放世界的最终判断仍包含统计和治理假设，协议只能让假设公开、可追责。',
      },
    ],
    security: [
      {
        title: '乐观验证：挑战者不在线或数据被隐藏',
        failure: '错误结果在挑战期无人检查，或关键输入不可用，欺诈证明无法构造。',
        solution: '挑战者获得明确奖励并由多运营方值守；证据在结算前通过可用性检查；挑战交易有强制入口，拥堵时自动延长窗口。',
        residual: '乐观安全依赖至少一个诚实且在线的观察者，不能用于无法泄露且无人可复核的任务。',
      },
      {
        title: '零知识：电路漏洞、设置与证明者集中',
        failure: '电路漏约束会让错误计算生成有效证明；部分方案依赖可信设置；高成本 proving 可能只剩一个运营者。',
        solution: '电路版本固定并做双实现、审计和测试向量；优先透明设置或多方仪式；保留替代 prover、证明超时和退出路径。链上验证器升级要经时间锁。',
        residual: '证明只保证电路表达的命题，错误规格会被完美地证明。',
      },
      {
        title: 'TEE 与预言机：共同失效',
        failure: '同一厂商漏洞让多节点证明同时失真，或多个观察者实际依赖同一个上游 API。',
        solution: '按厂商、地区和数据提供方做故障域标记；高价值任务要求异构证据，例如 TEE 加外部观察、两家数据源加抽样复算。',
        residual: '证据数量不等于独立性；部署前要画出真实依赖图。',
      },
    ],
    sources: [sources.dataAvailability, sources.zkRollups, sources.contracts, sources.survey],
  },
  'deployment-modes': {
    implementation: [
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
      {
        title: '开放网络把 Validator 服务做成 AVS',
        mechanism: 'ACVM TaskManager 发布 verdict task；EigenLayer Operator Set 读取证据、按 verificationPolicy 执行 Validator、签名响应，Aggregator 达到 quorum 后提交聚合结果；挑战期内用客观反例触发争议和可配置 slashing。',
        acceptance: '先按 EigenLayer 官方示例跑测试网：任务响应、quorum、BLS 聚合、挑战和错误响应处置都有集成测试。只有可客观判定的违规进入 slashing；主观业务争议不自动罚没 restaked 资产。',
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
        title: 'AVS slashing 逻辑或治理失守',
        failure: 'EigenLayer 官方文档明确提示：恶意 AVS、受损治理或 Operator 可让委托 stake 面临罚没风险。把主观 GEO 争议直接接 slashing 会造成不可恢复的误罚。',
        solution: '第一阶段只奖励不罚没；随后仅对双签、超时、无效签名或可确定反例等客观违规启用有限 slashing。Operator Set、redistribution recipient、升级和退出延迟全部公开并加时间锁。',
        residual: '再质押提高攻击成本，也放大合约和治理错误的损失；它不是业务正确性的替代品。',
      },
      {
        title: '把敏感业务材料直接上链',
        failure: '联盟链也会复制数据给多个成员，Prompt、个人轨迹、商业策略或完整模型日志一旦写入账本便难以删除和控制用途。',
        solution: '链上只保存最小根、状态和身份引用；A3S 执行域保存加密证据并按 retention policy 删除。高敏任务使用权限化取证、TEE 或隐私计算，审计者按角色取回。',
        residual: '摘要和时间模式仍可能泄露业务活动，必要时使用批量提交、延迟和访问隔离降低侧信道。',
      },
    ],
    sources: [sources.bsn, sources.sparkChain, sources.chainMaker, sources.fisco, sources.eigenRestaking, sources.eigenAvs, sources.a3s],
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
  'product-roadmap': {
    implementation: [
      {
        title: '用安全门槛推进，而不是按功能列表推进',
        mechanism: '阶段一在 A3S Flow / Runtime / Box / Power 上跑通任务、回执绑定、ACVM 状态机和 shadow PoI；阶段二让 ValidPoI 驱动小额托管并开放挑战；阶段三才把累计 PoI 接入 VRF、BFT 或 AVS 权重。',
        acceptance: '每阶段都有退出条件：重复结算为零、证据取回率达标、挑战可用、Validator 有效独立数达标，且完成重组与密钥失守演练。',
      },
      {
        title: '真实首单只跑一条轨道',
        mechanism: 'GEO 与可信数据空间二选一，并固定一个验证策略和一个结算实现。GEO 锁定观察口径；数据空间锁定数字合约、连接器履约证明与分账规则。两者都记录需求、版本、证据、裁决、付款、争议与成本。',
        acceptance: '外部审计者能从 SignedDemand 重建到 VerdictFinalized、ValidPoI 和 PaymentClaimed；需求方能解释为何付款，各结果贡献方能解释为何得款或被拒。PoI 权重关闭时，结算证明链仍完整。',
      },
    ],
    challenges: [
      {
        title: '没有真实数据就无法定费率和权重',
        failure: '概念阶段给出固定 PoI 参数、保证金和挑战期，会制造“方案已经定型”的假象。',
        solution: '先以 shadow mode 收集耗时、失败率、串谋收益和重组延迟；参数写入可审计配置，明确置信区间和调整规则。',
        residual: '早期样本仍会偏向合作伙伴，开放网络前必须重新做对抗性测试。',
      },
    ],
    security: [
      {
        title: '上线前的工程安全门槛',
        failure: '概念验证直接承载真实大额资金，代码、参数、密钥和运维流程都未经攻击检验。',
        solution: '建立托管与状态机形式化不变量，做单元、属性、模糊和跨模块集成测试；完成两家独立审计、公开测试网、漏洞赏金和事件响应演练。初期限额并延迟提款。',
        residual: '审计和测试降低已知风险，不等于生产安全证明；规模只能随观测到的可靠性逐级提高。',
      },
      {
        title: '升级、密钥与事件响应',
        failure: '补丁发布过慢会扩大损失，过快又可能由单一管理员植入后门。',
        solution: '预先定义只冻结不转账的紧急暂停；升级多签与时间锁分离，发布可复现构建和差异报告。建立密钥轮换、证据保全、用户通知、退款和复盘流程。',
        residual: '严重共识或桥故障仍需人工协调，因此责任人和决策时限必须在上线前公开。',
      },
    ],
    sources: [sources.a3s, sources.a3sRuntime, sources.a3sPower, sources.trustedDataSpacePlan, sources.trustedDataSpaceTech, sources.contracts, sources.agentSecurity, sources.survey],
  },
} as const satisfies Record<ScreenId, SpeakerGuideDetails>;
