import type { ScreenId } from './deck';

export type SpeakerGuideEntry = {
  duration: string;
  focus: string;
  connection: string;
  opening: string;
  beats: readonly [string, string, ...string[]];
  transition: string;
};

export const speakerGuides = {
  top: {
    duration: '1:00',
    focus: 'ACVM 把客户已经需要的模型推理，变成可结算、可记账的有效工作。',
    connection: 'PoI 改变工作证明的来源，智能体合约负责一笔 AI 订单的状态与责任。',
    opening: '今天的 AI 服务按调用量出账，区块链又单独花钱做哈希竞争。ACVM 想把两笔成本合成一笔：先服务客户，再为网络提供有效工作。',
    beats: ['客户先签名结果和验收条件，调用量只用于成本与限额。', 'Agent 完成任务并提交证据，Validator 独立验收；通过后生成 ValidPoI，再释放结果费。', '同一份 PoI 既是结算凭证，也是有效推理贡献；是否进入提议权重按网络阶段控制。'],
    transition: '先从客户最关心的问题开始：什么条件应该触发付款。',
  },
  'product-snapshot': {
    duration: '1:20',
    focus: 'ACVM 把付款条件从“调用成功”改成“结果验收通过”。',
    connection: 'A3S 负责编排与执行，ACVM 负责约定、证据与裁决，底层链负责托管和终局。',
    opening: '接口返回 200，只能证明调用发生了，不能证明客户要的结果已经出现。ACVM 让客户先写清达标条件，达到终局后再放款。',
    beats: ['任务规则锁定目标、门槛、预算、权限和截止时间。', '执行证据绑定产物、观测结果和运行回执，Worker 不能临时换口径。', 'Validator 给出通过、拒绝或挑战裁决；只有通过裁决生成 ValidPoI，底层链才改变资金状态。'],
    transition: 'GEO 是最直观的例子，因为它的业务结果可以被外部观测。',
  },
  'geo-verification': {
    duration: '1:50',
    focus: 'GEO 按独立观测到的引用增量结算，不按生成内容数量结算。',
    connection: '这笔订单天然包含真实需求、模型执行、外部证据和结果裁决。',
    opening: '品牌方买的不是十篇文章，而是生成式搜索里的引用增长。ACVM 在优化前冻结问题集、基线和观察窗口，让优化方不能给自己打分。',
    beats: ['品牌方签名问题集、目标引擎、站点版本、基线和增量门槛。', 'GEO Worker 调用模型与工具完成优化；独立观察节点按同一口径复测。', 'Validator 确认有效增量并等待挑战期结束；ACVM 生成 ValidPoI，底层链据此释放结果费。'],
    transition: '如果原始数据不能公开，流程不变，证据的做法要换。',
  },
  simulation: {
    duration: '1:50',
    focus: '社会模拟让个体数据留在本地，只把可复核的群体统计交给客户。',
    connection: '雾计算、隔离执行和独立复核解决隐私数据无法复制到全网的问题。',
    opening: '社会模拟的难点不是多跑几个 Agent，而是个人轨迹不能外泄，研究方又不能只交一张成绩单。ACVM 固定实验条件，只让统计结果和证明离开隔离域。',
    beats: ['合约先锁定模型版本、样本承诺、随机种子、隐私预算和统计口径。', '雾节点运行模拟，个体轨迹不出域；安全聚合只输出群体指标和置信区间。', 'Validator 复核统计管线与重复实验。协议能证明按约定运行，不能证明模型假设一定符合现实。'],
    transition: '这两个场景都能形成已验证结果，下一页说明为什么业务可以不用 PoI，而 ACVM 不能没有 PoI。',
  },
  'geo-poi-boundary': {
    duration: '1:40',
    focus: 'GEO 业务可以靠传统审计交付；ACVM 必须把验收结果铸成不可重放的 PoI。',
    connection: '把“业务能不能做”与“ACVM 为什么不同”拆开，才能正面回答 PoI 的必要性。',
    opening: '技术评审问 GEO 离开 PoI 能不能做，答案是能：单一机构用签名报告和审计库就能交付。但那不是 ACVM。进入 ACVM 的任务，只有生成 ValidPoI 才能领取结果费。',
    beats: ['无论采用什么系统，GEO 都要冻结问题集、基线、观察窗口和增量门槛。', 'ACVM 把 SignedDemand、执行回执、AcceptedResult 和唯一 taskKey 合成 ValidPoI；它是结果付款的必要凭证。', '开放网络再把同一 PoI 汇总成贡献权重。PoI 始终存在，分阶段接入的是激励和记账权。'],
    transition: '明确 PoI 是核心结果凭证后，再比较其他 AI 网络各自在证明什么。',
  },
  'useful-work': {
    duration: '2:10',
    focus: '同样叫“证明智能”，工程上可能验证评分、执行、经济安全或业务结果，不能混为一谈。',
    connection: 'ACVM 不重复建设模型市场或再质押层，它补的是从签名订单到业务裁决和结果结算的缺口。',
    opening: '比较 PoI 不能先比名字，要先比 predicate，也就是系统最终判断真假的那个条件。Bittensor 和 Allora 聚合质量评分，Gensyn 与 EigenAI验证执行，EigenLayer 提供可罚没安全，ChainOpera 做广义贡献计量。',
    beats: ['Bittensor、Allora 的核心是相对质量和激励分配，结果依赖各自 Validator 或 Reputer 的评分机制。', 'Gensyn Verde 与 EigenAI 能回答声明的模型是否忠实执行，但官方资料也明确：执行忠实不等于业务答案正确。', 'ACVM 接受这些执行证明或经济安全服务，把它们放进事前约定的业务验收，生成能触发结果费的 ValidPoI。'],
    transition: '要形成这种任务级裁决，首先必须解释模型为什么不能像普通链上程序那样由每个节点重跑。',
  },
  'execution-boundary': {
    duration: '1:50',
    focus: '模型在专用 Worker 上执行一次，共识节点验证回执和状态转换。',
    connection: 'ACVM 把非确定的模型与工具留在链下，把确定的验证规则留在共识边界内。',
    opening: '链上虚拟机的可靠来自每个节点重做同一段计算。模型推理依赖 GPU、私有数据和外部服务，既昂贵，也未必能得到逐字相同的输出。',
    beats: ['私有数据不能复制给所有节点；GPU 算子和采样结果可能存在差异。', '发邮件、下订单和调用外部 API 带有副作用，不能由全网重复执行。', 'ACVM 让 Worker 执行一次，节点检查签名、承诺、证明、裁决和状态转换。'],
    transition: '把这两个替换放回一笔订单，就能看清 ACVM 的完整工作流。',
  },
  'system-architecture': {
    duration: '2:10',
    focus: 'AP2 管授权，A3S 管执行，ACVM 管业务裁决与 PoI，底层链或 AVS 管终局与经济安全。',
    connection: '四层通过同一个 taskId、contractRoot 和回执根连接，各层不越权替代下一层。',
    opening: '这不是再造一个全栈协议。AP2 已经定义 Agent 支付授权，A3S 已经具备工作流、生命周期、隔离推理和安全回执；ACVM 只新增结果条件、独立裁决和结果结算。',
    beats: ['AP2 的 Intent 或 Cart Mandate 绑定授权主体和交易意图，ACVM 把 mandateHash 纳入 SignedDemand，并补上业务验收条件。', 'A3S Flow、Runtime、Event、Box、Power、Gateway 和 Sentry 执行任务、保留事件历史并生成可绑定的运行证据。', 'ACVM Validator 把执行证据与业务证据分别检查，形成 verdictRoot 与 ValidPoI；现有链结算，开放网络可再用 AVS 保护验证者集合。'],
    transition: '流程的第一步是发现服务。地址只能定位账户，ANS 还要回答这个 Agent 能做什么。',
  },
  ans: {
    duration: '1:40',
    focus: 'ANS 把可读名称解析成可验证的智能体服务卡。',
    connection: '调用方拿到服务卡并核验后，通过 A2A 签下同一个 taskId 的订单。',
    opening: '钱包地址只能说明签名者是谁，不能说明它会不会做 GEO、多少钱、由谁验收。ANS 把这些信息放进带签名和有效期的服务记录。',
    beats: ['记录包含 DID、A2A 端点、能力版本、价格、有效期和推荐 Validator 集。', '信誉按能力和任务类型分别统计，并显示样本量；低价值任务不能刷高所有能力。', 'ANS 负责发现，不替代信任判断。调用方仍要检查记录签名、凭证撤销和历史回执。'],
    transition: '找到 Agent 以后，双方还需要一份能管住预算、权限和失败的合约。',
  },
  'agentic-contract': {
    duration: '1:40',
    focus: '智能体合约把长任务写成由回执驱动的状态机。',
    connection: '它同时固定 Worker 接口、Validator 接口和结算条件，避免执行后换规则。',
    opening: '普通智能合约擅长一笔交易内的确定性计算。AI 任务会跨越多个区块、调用外部工具，还可能超时或被挑战，所以需要另一种合约对象。',
    beats: ['Schema 定义输入、结果、证据和裁决格式；Worker 与 Validator 各有独立入口。', 'Settlement 写清通过、拒绝、超时、挑战和罚没分别怎样改变资金状态。', '目录生成 contractRoot，任务引用该版本。规则一旦变化，就必须建立新版本。'],
    transition: '合约锁定规则后，模型可以在靠近数据的位置执行。',
  },
  'fog-inference': {
    duration: '1:50',
    focus: '雾计算让数据就近处理，让回执在全网核验。',
    connection: 'ANS 提供候选 Worker，智能体合约给出调度条件，ACVM 记录租约、证明和裁决。',
    opening: '医疗、制造和政务数据通常不能送到一个中心云。ACVM 按地域、延迟、硬件证明和价格选择附近的雾节点，原始数据留在现场。',
    beats: ['数据拥有者只提交输入承诺、模型哈希、预算和隐私规则。', 'a3s-box 隔离工作负载，a3s-power 运行模型；完成后提交结果根和运行证明。', '独立 Validator 检查证明和 SLA，共识节点只验证回执，不重新运行模型。'],
    transition: '有了执行回执还不能付款，下一步要按订单约定把证据变成一项确定裁决。',
  },
  'poi-proof': {
    duration: '1:40',
    focus: 'PoI 只记录真实、有效、可核验且唯一的模型服务。',
    connection: '需求、执行、结果和防重放四项条件都绑定同一个 taskId。',
    opening: '一张 GPU 使用证明只能说明烧过算力，不能说明客户需要这项工作，也不能说明结果可用。ACVM 要求四个条件同时成立。',
    beats: ['SignedDemand 证明订单来自真实需求方，并锁定预算与 nonce。', 'AcceptedResult 证明结果通过验收；执行证明绑定模型、输入、输出和运行环境。', 'taskKey 必须先写入已使用集合，才生成唯一 ValidPoI；结算合约只接受尚未领取过的有效 PoI。'],
    transition: '有效 PoI 进入贡献池后，还不能直接决定谁记账。',
  },
  'poi-consensus': {
    duration: '1:50',
    focus: 'PoI 影响抽签概率，验证节点决定区块是否终局。',
    connection: '归一、封顶和衰减限制大户权重；VRF 与 BFT 分开承担选择和确认。',
    opening: '如果谁做的推理多，谁就直接拥有记账权，系统很快会被大客户或刷单者控制。ACVM 只把 PoI 换成有上限的抽签权重。',
    beats: ['PoI 按任务类型归一，再乘质量系数和时间衰减，并设置单主体上限。', '候选者用 epoch 与 poiRoot 运行 VRF；权重越高，被抽中的概率越大，但结果不能预先挑选。', '获选者只能提议区块。其他节点仍要验证 PoI、交易和状态；达到 BFT 法定人数才终局。'],
    transition: '任务和共识都跑通以后，接下来回答怎样借用现有链落地，而不是先造一条新链。',
  },
  'verification-engine': {
    duration: '1:50',
    focus: '每类证据回答不同问题，业务验收与运行证明不能混为一谈。',
    connection: '智能体合约在执行前选择验证组合，并公开成本与剩余信任。',
    opening: 'TEE 能证明某段程序运行过，却不能证明 GEO 引用真的增长；业务验收能看结果，却未必知道模型有没有被替换。ACVM 把两类证据组合使用。',
    beats: ['可确定的小任务可以独立复算；高成本任务可以乐观提交、抽检并接受挑战。', 'TEE 证明隔离环境，零知识证明验证预定义关系，但都不自动判断开放式业务质量。', 'GEO 依赖冻结观测源和增量门槛；社会模拟还要检查样本、随机过程和统计管线。'],
    transition: '裁决一旦通过，下一步才有资格问：这份结果能不能生成唯一、不可重放的 PoI。',
  },
  'deployment-modes': {
    duration: '2:20',
    focus: 'A3S 与 ACVM 保持链外执行和确定裁决接口，按基础设施类型更换身份、终局和支付适配器。',
    connection: '国内产业链与 EigenLayer 不是同一种网络，页面分别给出接入边界，避免一句“兼容国家区块链网络”带过。',
    opening: '国内没有一个可以统称并用同一接口接入的“国家链”。BSN 是多框架部署与网关基础设施，星火·链网提供 BIF 与 BID，长安链和 FISCO BCOS 是联盟链技术体系。ACVM 用适配器接它们，而不是替换它们。',
    beats: ['国内模式沿用 CA、BID 或 DID、国密与权限治理，只把 taskRoot、verdictRoot 和资金状态上链；原始 Prompt、数据和证据留在 A3S 证据存储。', '人民币托管和支付由现有合规支付系统完成，链上记录授权引用与结算状态，不要求原生代币，也不假设匿名 Validator。', '开放模式可把 ACVM Validator 实现为 EigenLayer AVS Operator Set，使用 quorum、挑战和 slashing；AVS 提供经济安全，业务验收 predicate 仍由 ACVM 定义。'],
    transition: '部署门槛降低以后，剩下的是机制最容易被攻击的地方。',
  },
  'security-boundaries': {
    duration: '1:50',
    focus: '每条主要作弊路径都有独立控制，不能只靠一个信誉分。',
    connection: '安全措施直接进入试点指标：关联订单率、重放率、挑战成功率和 Validator 集中度。',
    opening: 'PoI 最危险的攻击不是破解密码学，而是把自己下给自己的垃圾订单包装成有效工作。ACVM 从需求、执行、验收和权重四个位置同时设限。',
    beats: ['关联身份分析、预算门槛和单主体封顶降低自交易刷单收益。', 'taskKey、输出根和 epoch 防重放；抽样复算、TEE 和业务验收控制伪造。', '随机 Validator 委员会、利益冲突限制、保证金和挑战奖励提高串谋成本。'],
    transition: '这些角色都会产生费用，最后用一笔具体预算把收益和责任分开。',
  },
  'economy-roles': {
    duration: '2:00',
    focus: '结果费、验证成本和违规保证金分账，正常失败不等于作弊。',
    connection: '三种结算结果说明需求方、Worker、证据方、Validator、挑战者和协议各自得到什么。',
    opening: '用一笔 12 万元托管预算举例：10 万是结果费，其余支付证据、验收、链上费用和挑战准备金。三种结果走三条不同的账。',
    beats: ['验收通过：Worker 获得结果费；证据方、Validator 和协议获得已完成工作的费用。', '正常未达标：结果费退回需求方，Worker 不拿结果费但不罚保证金；验证成本照常支付。', '证明造假：结果费退回，Worker 保证金被罚没；有效挑战者和安全储备分得罚没资金。'],
    transition: '经济关系已经可以放进试点，最后明确当前状态和下一项交付。',
  },
  'product-roadmap': {
    duration: '1:30',
    focus: '下一项交付是基于 A3S 跑通一笔从签约、ValidPoI 到已验证付款的真实任务。',
    connection: 'PoI 从第一天生成；先做影子证明，再接真实结算，最后才让累计 PoI 影响提议权。',
    opening: 'ACVM 目前是概念规范和产品演示，不是生产网络。下一步不需要证明所有场景，只需要把一笔真实订单跑到底。',
    beats: ['先在 A3S Flow / Runtime / Box / Power 上实现任务适配器、回执绑定、ACVM 状态机和 shadow PoI。', '选择 GEO 或社会模拟试点，接入真实需求方、Worker、证据源和 Validator，让 ValidPoI 驱动小额结果结算。', '只有开放供给确有需求、攻击成本数据达标后，才把累计 PoI 接入 VRF、BFT 或 EigenLayer AVS 路径。'],
    transition: 'ACVM 的首个交付标准很具体：客户能解释为什么付款，服务方能证明为什么得款，评审能从签名需求重建到终局裁决。',
  },
} as const satisfies Record<ScreenId, SpeakerGuideEntry>;
