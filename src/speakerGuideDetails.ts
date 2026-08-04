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
  agentSecurity: {
    label: 'OWASP Agentic Applications Top 10',
    url: 'https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/',
  },
} as const satisfies Record<string, GuideSource>;

export const speakerGuideDetails = {
  top: {
    implementation: [
      {
        title: '先建立唯一任务身份',
        mechanism: '需求方签名后生成 taskId：把链标识、contractRoot、需求 nonce、需求方地址和 inputRoot 一起做域隔离哈希。此后 ANS 解析、Worker 回执、Validator 裁决、付款和 PoI 都必须引用它。',
        acceptance: '同一 taskId 只能存在一条合法状态链；任何缺字段、跨链复用或前后状态根不连续的回执都被拒绝。',
      },
      {
        title: '一份裁决，两本账',
        mechanism: 'AcceptedResult 终局后，结算合约释放结果费；同一裁决再派生不可重复使用的 taskKey，写入 PoI 贡献记录。PoI 不是付款凭证，也不能绕过 Validator。',
        acceptance: '付款回执和 PoI 记录必须指向同一 verdictRoot，usedTaskKey 集合保证一笔任务只结算、只计分一次。',
      },
    ],
    challenges: [
      {
        title: '“有用”不是链上天然可知的事实',
        failure: '模型确实运行过，不等于客户要的结果出现了。开放世界任务没有一个通用真值函数。',
        solution: '每类任务预先选择验收策略：确定性任务复算，开放结果采用冻结数据源、多观察者、挑战期和人工仲裁兜底。合约只执行已经签名的策略，不临时改口径。',
        residual: '协议能证明按约定验收，不能证明约定本身一定正确；这一点必须由需求方在签约前承担。',
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
        solution: '要求真实托管成本，分析资金与身份关联，随机分配无利益冲突的 Validator，并对主体、任务类别和 epoch 设置权重上限。',
        residual: '隐蔽关联无法被密码学彻底识别，因此 PoI 只增加提议概率，不能直接决定终局。',
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
  'useful-work': {
    implementation: [
      {
        title: '把业务贡献与最终共识拆开',
        mechanism: 'AcceptedResult 先进入 PoI 池，按任务类别归一、质量加权、时间衰减并按主体封顶。它只形成下一 epoch 的候选权重；VRF 抽签和 BFT 投票另行执行。',
        acceptance: '任何节点都能从终局裁决重算 poiRoot 和候选权重；单个 PoI 无法直接让区块终局。',
      },
      {
        title: '保留稀缺投入',
        mechanism: 'Worker 付出 GPU、数据和服务成本，Validator 与挑战者锁定保证金。攻击者要制造权重，必须同时支付真实任务成本并承担被拒绝、罚没和权重封顶。',
        acceptance: '试点阶段测量制造一单位有效 PoI 的最低成本，并与潜在区块收益比较；攻击成本不足时不开放 PoI 加权。',
      },
    ],
    challenges: [
      {
        title: '不同推理任务不可直接相加',
        failure: '一次昂贵推理、一万次廉价分类和一个高价值 GEO 结果没有天然统一单位。',
        solution: '按任务类别建立独立基准和质量门槛，先在类别内归一，再用治理上限合并；采用对数或平方根函数削弱大户边际权重。',
        residual: '权重函数是经济参数，不是数学真理，必须根据攻击成本与市场数据持续校准。',
      },
    ],
    security: [
      {
        title: 'PoW 的多数算力与概率终局',
        failure: '控制多数算力的攻击者可持续构造更重的分支，重组自己的付款并审查交易；较少确认只能降低、不能消除追赶概率。',
        solution: '传统做法依赖算力分散、确认深度、全节点独立验块和经济激励。ACVM 不继承哈希竞赛，但仍保留“高成本贡献 + 独立验块”的安全目标。',
        residual: 'ACVM 把风险从算力多数转移到任务质量、身份关联和 Validator 串谋，风险没有凭空消失。',
      },
      {
        title: '有用工作被伪装成廉价刷量',
        failure: '攻击者挑最便宜的任务循环调用，以远低于诚实服务价值的成本获得大量权重。',
        solution: '只接收带托管预算和独立验收的任务；类别内归一、主体封顶、时间衰减，并以真实支付和挑战损失约束刷量。',
        residual: '若网络奖励高于刷量总成本，攻击仍有利可图，因此奖励上限必须由测得的攻击成本反推。',
      },
    ],
    sources: [sources.bitcoin, sources.survey],
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
        title: '事件与状态根贯穿整条订单',
        mechanism: '每一步输出结构化事件：ResolvedAgent、TaskFunded、ExecutionSubmitted、VerdictFinalized、PaymentClaimed 和 PoIFinalized。事件都引用 taskId 和前序状态根。',
        acceptance: '索引器可从创世状态重放单笔任务并得到相同终态；缺事件、乱序或根不连续会被状态机拒绝。',
      },
      {
        title: '付款与 PoI 由同一终局事件派生',
        mechanism: 'VerdictFinalized 是唯一分叉点：业务支路更新可领取余额，共识支路写入 usedTaskKey 和 PoI 明细。两者在同一原子交易内提交。',
        acceptance: '不变量要求“存在 PoI 必有终局裁决”“一条终局裁决至多一个付款结果”和“Rejected 不生成 PoI”。',
      },
    ],
    challenges: [
      {
        title: '跨服务一致性',
        failure: 'ANS、调度器、Worker 和索引器各自重试，容易出现“链下显示完成、链上仍在运行”。',
        solution: '链上状态是唯一事实源；链下服务用 outbox/inbox 和事件游标至少一次投递，消费端用 taskId + step 幂等。任何缓存都带 finalizedHeight。',
        residual: '链上最终一致会带来界面延迟，产品必须明确显示 pending、finalized 和 disputed，而不是统一写“成功”。',
      },
    ],
    security: [
      {
        title: '重组后的幽灵任务',
        failure: 'Worker 根据未终局事件开始昂贵推理，随后链重组移除了订单或预算。',
        solution: '小额任务可立即执行但计入风险准备金；大额任务等待配置确认数或 BFT 终局。重组时调度器撤销未租用任务，已执行成本由预先约定的风险池承担。',
        residual: '等待终局与交付速度存在直接权衡，不能用一个确认数覆盖所有链和订单金额。',
      },
      {
        title: '跨模块权限扩散',
        failure: '调度服务被攻破后同时能改 ANS、发任务、验收和放款。',
        solution: '解析、调度、执行、裁决和结算使用独立密钥与角色；服务间使用短期能力令牌，关键动作需不同安全域共同签名。',
        residual: '运维身份仍是高价值目标，需要硬件密钥、轮换和可演练的吊销流程。',
      },
    ],
    sources: [sources.survey, sources.contracts],
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
    sources: [sources.agentSecurity, sources.survey],
  },
  'poi-proof': {
    implementation: [
      {
        title: '四条件共同成立',
        mechanism: 'ValidPoI = SignedDemand ∧ AcceptedResult ∧ ExecutionEvidence ∧ UniqueTaskKey。taskKey 由 taskId、verdictRoot、Worker 和任务类别做域隔离哈希。',
        acceptance: '验证器逐项检查需求签名与托管、终局裁决、执行证据策略和 usedTaskKey；任一失败都不写 PoI。',
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
        title: '从协处理器开始',
        mechanism: 'ACVM 链下运行任务与验证器，现有链合约只负责托管、任务根、裁决根和付款。成熟后再把状态机做成原生执行器；只有开放参与需要明确时才引入应用链共识。',
        acceptance: '第一阶段的成功标准是一笔真实任务可从 SignedDemand 走到 PaymentClaimed 和 FinalizedPoI，而不是先拥有新链。',
      },
      {
        title: '每条链都有终局适配器',
        mechanism: 'adapter 输出 finalizedHeight、finalityType、reorgDepth、challengeWindow 和 dataAvailabilityMode。上层按订单金额与证据类型选择等待策略。',
        acceptance: '故障注入测试覆盖重组、链停机、RPC 分叉、sequencer 审查和桥消息重复，状态机在任何情况下都不重复付款。',
      },
    ],
    challenges: [
      {
        title: '不同链的“确认”不是同一件事',
        failure: 'PoW 是概率终局，BFT 可即时终局，PoS 还涉及检查点，Rollup 又依赖 L1、挑战窗和数据可用性。',
        solution: '产品不暴露统一的“已确认”布尔值，而是明确 pending、safe、finalized、challengeable。金额越大，要求越强的终局等级。',
        residual: '跨链业务的安全上限取决于最弱一环，适配器不能把弱终局包装成强终局。',
      },
    ],
    security: [
      {
        title: 'L1 与 PoS 长程风险',
        failure: '底层链重组、终局延迟或新节点同步到伪造的旧分叉，都会让任务状态和付款根失真。',
        solution: '按链设置确认门槛；PoS 节点从多个独立来源交叉检查近期弱主观检查点；客户端与 RPC 多样化，发现冲突立即冻结大额结算。',
        residual: '底层链发生社会层分叉时，ACVM 也必须等待所选生态完成选链。',
      },
      {
        title: 'Rollup：排序器审查、欺诈证明与数据可用性',
        failure: '中心化排序器拒绝挑战；乐观 Rollup 隐藏数据使欺诈证明无法生成；ZK Rollup 的电路或 prover 集中又形成新风险。',
        solution: '优先选择数据发布到 L1、支持强制包含和用户逃生的 Rollup；等待挑战期或 L1 接受有效性证明。审查电路升级、证明者替代和 DA 模式。',
        residual: 'Validium 等链下 DA 模式加入额外委员会信任；更快结算通常意味着承担更多流动性或桥风险。',
      },
      {
        title: '跨链桥：验证者串谋、合约漏洞与消息回放',
        failure: '外部多签伪造源链消息，桥合约被攻破，或同一裁决在目标链重复执行。',
        solution: '优先轻客户端或底层原生验证桥；消息绑定源链、目标链、合约、nonce 和有效期。设置速率上限、延迟、大额人工复核和熔断，桥失败不允许回退到普通管理员签名。',
        residual: '跨链总会叠加两个链和桥的风险；首个试点应尽量单链结算。',
      },
    ],
    sources: [sources.bridges, sources.zkRollups, sources.dataAvailability, sources.weakSubjectivity],
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
        mechanism: '预算拆成结果费、证据费、验证费、链上费和安全准备金。Accepted 支付已完成工作；正常未达标退结果费但支付诚实验证成本；Fraud 才罚没保证金。',
        acceptance: '会计不变量覆盖三条路径，任何状态下资产都可归属；Worker 的正常失败与可证明作恶使用不同错误码和资金结果。',
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
    sources: [sources.contracts, sources.cometBft, sources.survey],
  },
  'product-roadmap': {
    implementation: [
      {
        title: '用安全门槛推进，而不是按功能列表推进',
        mechanism: '阶段一跑通本地状态机和不变量；阶段二影子结算真实任务但不自动放款；阶段三小额托管并开放挑战；数据稳定后才试 PoI 加权和开放 Validator。',
        acceptance: '每阶段都有退出条件：重复结算为零、证据取回率达标、挑战可用、Validator 有效独立数达标，且完成重组与密钥失守演练。',
      },
      {
        title: '首个试点留下完整审计链',
        mechanism: '选 GEO 或社会模拟的一种，固定一个验证策略和单链结算。记录需求、版本、证据、裁决、付款、争议与成本，不急着覆盖所有模型和链。',
        acceptance: '外部审计者能从 SignedDemand 重建到 FinalizedPoI；客户能解释为何付款，Worker 能解释为何得款或被拒。',
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
    sources: [sources.contracts, sources.agentSecurity, sources.survey, sources.bridges],
  },
} as const satisfies Record<ScreenId, SpeakerGuideDetails>;
