import { DetailHint, type ProofDerivation } from './DetailHint';

type TechNote = {
  summary: string;
  mechanism: string;
  boundary: string;
};

export const techNotes = {
  'zkTLS / TLSNotary': {
    summary: '证明某个 HTTPS 网站或 API 确实返回过指定数据，同时隐藏登录凭据和不需要公开的响应字段。',
    mechanism: '把 TLS 会话、请求范围和响应片段做承诺，再由协同公证、可信执行环境或零知识电路生成可独立验证的证明。',
    boundary: '它证明“服务器返回过什么”，不自动证明服务器数据本身真实；时效性还要绑定 nonce、时间戳或区块高度。',
  },
  'Proof-carrying Execution': {
    summary: '执行结果必须同时携带足够证据，接收方验证证据后才接受状态变化。',
    mechanism: '结果、输入承诺、代码版本、工具回执和执行证明绑定到同一任务 ID，再由链上或 Validator 按固定规则验签与验算。',
    boundary: '它只能证明预先定义的程序和验收条件被满足；规则写错、数据源失真仍需要治理与挑战机制处理。',
  },
  TEE: {
    summary: '由处理器提供的隔离执行区，用来保护运行中的模型、密钥和敏感输入。',
    mechanism: '代码和数据在受硬件保护的内存中运行，远程证明把代码度量、硬件身份和本次随机数签进一份 quote。',
    boundary: '安全性依赖硬件厂商、固件和侧信道防护；TEE 不是“绝对可信”，所以仍需版本白名单、撤销和多方复核。',
  },
  MPC: {
    summary: '多方在不互相公开原始数据的前提下，共同计算一个结果。',
    mechanism: '输入被拆成秘密份额，各参与方只处理自己的份额；达到门限后才能恢复结果，单方看不到完整输入。',
    boundary: '通信轮次和参与方数量会显著影响延迟；协议还必须明确掉线、串谋门限和恶意参与者模型。',
  },
  FHE: {
    summary: '直接在密文上执行计算，计算方不需要先看到明文。',
    mechanism: '数据拥有者加密输入，执行者对密文运行受支持的算术电路，最终只有持有解密密钥的一方能恢复结果。',
    boundary: '当前成本通常高于明文计算，适合结构固定、隐私价值高的任务；复杂模型还要处理近似、噪声和电路深度。',
  },
  IVC: {
    summary: '任务每推进一步，就把这一步的正确性累加进同一份持续证明状态。',
    mechanism: '第 n 步验证上一状态承诺和本步转换，再产出第 n+1 步承诺；链上最终只验证聚合后的证明。',
    boundary: '状态转换必须能被电路精确定义；外部人工判断和非确定性工具仍要先变成可验证回执。',
  },
  'Recursive ZK': {
    summary: '让一个零知识证明验证其他证明，把大量步骤压缩成一个固定大小的最终证明。',
    mechanism: '递归电路逐层检查子证明、公共输入和状态连续性，最终证明覆盖整条执行链。',
    boundary: '证明尺寸小不代表生成便宜；电路兼容性、证明系统组合和 prover 资源都需要提前设计。',
  },
  Folding: {
    summary: '把新一步约束折叠进持续更新的证明实例，避免每个里程碑都从头生成完整证明。',
    mechanism: '每一步将旧实例与新约束组合成新的累积实例，任务结束后再生成一次可在链上验证的最终证明。',
    boundary: '折叠本身通常不是最终零知识证明；还需要终结证明，并保证每一步状态承诺连续且规则版本不变。',
  },
  'DID / VC': {
    summary: 'DID 标识责任主体，VC 由可信机构签发可验证的资质、岗位或授权声明。',
    mechanism: '验证方检查签发者签名、主体绑定、有效期和撤销状态，再把验证结果绑定到 Agent 或合约调用。',
    boundary: '密码学只能证明“谁签发了什么”；签发机构是否可信、凭证如何撤销仍属于治理问题。',
  },
  'Selective Disclosure': {
    summary: '只证明完成当前操作所需的属性，不公开整份凭证和无关字段。',
    mechanism: '持有者从签名凭证派生选择性披露证明，例如只证明“牌照有效且未过期”，验证方检查签名与谓词。',
    boundary: '披露最少不等于完全匿名；时间、请求模式和稳定标识仍可能造成关联，需要配合最小化日志。',
  },
  FROST: {
    summary: '高效的 Schnorr 门限签名，达到约定数量的参与方后才产生一份普通可验证签名。',
    mechanism: '密钥被分成份额，各签名方协同生成 nonce 和部分签名，聚合器只在门限满足时合成最终签名。',
    boundary: 'FROST 证明“门限参与方同意签名”，但不替代业务审批规则；nonce 管理和成员变更必须严格处理。',
  },
  'Light Client': {
    summary: '不保存完整账本，只验证区块头、验证者集合和共识证明来确认另一条链上的事实。',
    mechanism: '轻客户端持续同步可信区块头，并用包含证明检查某笔交易或状态是否属于已最终确认的区块。',
    boundary: '安全性取决于正确跟踪验证者集合和最终性规则；跨链消息还要防止长程攻击与错误同步起点。',
  },
  'Content-addressed Tree': {
    summary: '文件的路径与内容共同决定目录根；目录里任何业务文件变化，都会得到新的合约版本。',
    mechanism: '部署端按规范路径排序文件，对内容做哈希，再逐层计算 Merkle Root。节点只接受与链上 Contract Root 完全一致的目录。',
    boundary: '它固定的是业务文件，不开放运行环境配置；工具、文件系统、网络和轨迹采集由 ACVM 与 a3s-box 统一提供。',
  },
  'Task File ABI': {
    summary: 'Worker、Validator 和结算阶段通过固定任务文件交接，不通过可随意变化的进程内对象传值。',
    mechanism: 'ACVM 生成输入文件；Worker 写结果与证据；Validator 只读前序文件并写裁决；系统为每个阶段计算 taskTreeRoot。',
    boundary: '合约作者只能读写协议允许的业务文件，不能修改目录边界、网络策略或工具配置，也不能选择性漏记文件。',
  },
  'Intent-centric': {
    summary: '用户声明目标、约束和验收条件，系统负责选择具体执行路径。',
    mechanism: '签名意图先经过权限与策略检查，再由 Worker 执行、Validator 验收，最终以回执证明没有越过约束。',
    boundary: '没有写进意图的约束就无法自动保护；预算、时限、数据范围和失败处理必须明确。',
  },
  'A2A Protocol': {
    summary: '让不同机构和运行时中的 Agent 用统一消息格式发现能力、协商任务、交换状态并交付结果。',
    mechanism: '调用方先取得 Agent Card 或 ANS 解析记录，再通过 A2A 发送签名 Intent、能力要求、预算、SLA 和回调地址；每次状态变化引用同一 taskId。',
    boundary: 'A2A 解决互操作，不自动保证对方诚实或结果正确；身份、授权、Validator、回执和结算仍需单独验证。',
  },
  'Mechanism Design': {
    summary: '通过奖励、保证金、验证费用和惩罚规则，让 Agent 服务他人比欺骗、拖延或刷量更划算。',
    mechanism: '服务费锁入托管合约，结果通过独立验收后按贡献分配；失败、串谋或伪造会扣减保证金和对应能力域信誉。',
    boundary: '激励规则也可能被钻空子；必须处理女巫身份、自交易、低价值刷单、Validator 串谋和垄断定价。',
  },
  'Information Design': {
    summary: '决定发现和选择 Agent 时公开哪些可信信号，以及怎样避免无关信息、隐私泄漏和信誉误导。',
    mechanism: 'ANS 返回签名能力、版本、有效期、价格、Validator 集和任务类型信誉；原始履历用回执根、选择性披露或证明按需核验。',
    boundary: '公开更多不一定更可信；评分必须区分能力、难度和时间，并防止选择性展示、过期声明和关联隐私泄漏。',
  },
  'UCAN / ZCAP': {
    summary: '可委托、可缩小、可过期的能力凭证，用来限制 Agent 本次能调用哪些资源。',
    mechanism: '每次转授权都只能收窄资源、动作和有效期，验证方沿委托链检查签名、范围与撤销状态。',
    boundary: '能力凭证泄漏时可能被持有者使用，所以要配合短有效期、会话绑定、撤销和最小权限。',
  },
  'Receipt Root': {
    summary: '把大量 Worker、Validator 和工具回执组织成一棵 Merkle 树，并把根写入链上。',
    mechanism: '每条回执先规范化编码并哈希，验证单条记录时提交回执和 Merkle 路径即可重算同一个根。',
    boundary: '根只能证明记录未被替换或遗漏于这棵树，不能单独证明回执内容真实；仍要验证签名、证明和数据来源。',
  },
  'Remote Attestation': {
    summary: '由硬件签名证明指定代码确实运行在预期的隔离环境中。',
    mechanism: '验证方发送 nonce，TEE 返回包含代码度量、平台状态和 nonce 的 quote；通过厂商证书链与白名单核验。',
    boundary: '它证明运行环境和代码版本，不证明业务输出一定正确；还要处理固件漏洞、证书撤销和度量白名单。',
  },
  'Proof of Intelligence': {
    summary: 'PoI 记录被真实需求触发、通过结果验收且带执行证据的有效计算。',
    mechanism: '需求签名、结果验收、执行证明和防重放标识缺一不可，通过后才进入贡献计分和共识流程。',
    boundary: 'PoI 的质量取决于验收谓词和防自交易规则；它不等同于主观意义上的“智能”评分。',
  },
  zkML: {
    summary: '用零知识证明确认固定模型对承诺输入执行了指定推理，同时隐藏模型或原始输入。',
    mechanism: '模型参数和输入先做承诺，推理被编译成可证明电路，验证方检查输出承诺与证明是否匹配。',
    boundary: '量化、算子支持和证明成本会影响可用性；证明的是电路中的模型，不自动保证模型质量或数据真实性。',
  },
  VRF: {
    summary: '可验证随机函数生成不可提前预测、公布后可验证的随机结果。',
    mechanism: '私钥对公共种子计算随机输出和证明，任何人用公钥都能核对输出确由该参与方生成。',
    boundary: '随机性仍依赖种子不可被操纵；候选集合、权重和重抽规则必须由共识协议明确。',
  },
  'BFT / HotStuff': {
    summary: '联盟节点对同一状态转换投票，达到法定人数后形成不可轻易回滚的最终确认。',
    mechanism: '在 3f+1 个节点中通常需要至少 2f+1 票形成 quorum certificate，HotStuff 用连续 QC 推进安全锁定与提交。',
    boundary: '安全与活性依赖故障节点不超过阈值、成员集合正确以及网络最终恢复；它不判断链下任务是否有用。',
  },
} as const satisfies Record<string, TechNote>;

export type TechKey = keyof typeof techNotes;

function proof(
  formula: string,
  symbols: readonly (readonly [string, string])[],
  steps: readonly (readonly [string, string])[],
  verifier: string,
  validity: string,
  assumptions: string,
): ProofDerivation {
  return {
    formula,
    symbols: symbols.map(([label, value]) => ({ label, value })),
    steps: steps.map(([expression, explanation]) => ({ expression, explanation })),
    verifier,
    validity,
    assumptions,
  };
}

const techProofs = {
  'zkTLS / TLSNotary': proof(
    'πTLS ← Prove(T, req, resp, n);  Verify(vkTLS, pub, πTLS) = 1',
    [['T', '完成证书校验与密钥协商的 TLS transcript'], ['pub', '域名、请求承诺、披露字段承诺、时间与 nonce'], ['n', '验证方给出的单次随机数']],
    [['CT = H(domain ∥ certChain ∥ T)', '先把会话绑定到指定域名、证书链和握手记录。'], ['CR = H(jsonPath ∥ value ∥ salt)', '只承诺需要披露的响应字段，其他字段保持隐藏。'], ['πTLS = Prove(MAC/TLS consistency, CT, CR, n)', '证明响应确实属于同一条受认证 TLS 会话，且不是旧响应重放。']],
    'CertValid(domain,t) ∧ Fresh(n) ∧ Verify(vkTLS, pub, πTLS)=1',
    '三个条件同时为真，才能接受“该 HTTPS 端点在该时刻返回过这个字段”。',
    '信任浏览器/公证协议实现、证书体系和哈希抗碰撞；公式不证明数据源在现实世界中诚实。',
  ),
  'Proof-carrying Execution': proof(
    'Accept(O,π) ⇔ Auth(I) ∧ Verify(vk, H(I)∥H(O)∥codeHash∥n, π) ∧ Fresh(n)',
    [['I', '签名任务意图与约束'], ['O', 'Worker 输出或任务文件根'], ['π', '执行、环境或验收证明'], ['n', '防重放 nonce']],
    [['CI = H(Canon(I))', '把调用方、预算、期限和输入规范编码为固定承诺。'], ['CO = H(Canon(O))', '把完整输出压缩成可在链上引用的承诺。'], ['Verify(vk, CI∥CO∥codeHash∥n, π)', '验证证明是否同时绑定这次输入、这份输出和这版代码。']],
    'Auth(I)=1 ∧ ProofOK=1 ∧ CO=ObservedOutputRoot ∧ n∉Spent',
    '有效证明必须让授权、执行关系、输出绑定和防重放全部成立；任一项失败都不推进状态。',
    '验证密钥与代码版本已正确治理，哈希函数抗碰撞，证明系统满足可靠性。',
  ),
  TEE: proof(
    'Quote = SignAK(H(code)∥H(model)∥H(input)∥outputRoot∥n∥TCB)',
    [['AK', '设备证明密钥'], ['TCB', '处理器、固件和隔离环境安全版本'], ['n', '验证方挑战随机数']],
    [['m = H(code)∥H(model)', '先固定实际加载的代码与模型度量。'], ['q = SignAK(m∥H(input)∥outputRoot∥n∥TCB)', '硬件把本次输入、输出、随机挑战和平台状态签在一起。'], ['ChainVerify(AK, vendorRoot)', '验证 AK 证书链确实来自被接受的硬件平台。']],
    'ChainOK ∧ TCB∈Allowlist ∧ Fresh(n) ∧ SigVerify(AK,q)=1',
    '只有证书链、平台版本、随机挑战和签名全部通过，才能证明指定度量在该隔离环境中运行过。',
    '厂商根证书、固件撤销列表与侧信道风险被单独治理；TEE 不证明业务算法本身正确。',
  ),
  MPC: proof(
    'f(0)=s, shareᵢ=f(i);  s=Σᵢ∈Q λᵢ·shareᵢ  (|Q|≥t)',
    [['s', '需要隐藏的输入秘密'], ['t', '恢复或协作计算所需门限'], ['Q', '实际参与本次计算的份额集合']],
    [['f(x)=s+a₁x+…+aₜ₋₁xᵗ⁻¹', '随机多项式把秘密放在常数项。'], ['shareᵢ=f(i)', '每方只得到一个点，少于 t 个点无法确定 f(0)。'], ['Σ λᵢshareᵢ=f(0)', '达到门限后用拉格朗日插值恢复结果或完成等价的份额计算。']],
    '|Q|≥t ∧ TranscriptConsistent ∧ MAC/commitment checks pass',
    '门限足够且每轮份额一致性检查通过时，输出等于约定函数的结果；少于门限不会泄露秘密。',
    '参与方串谋少于隐私门限，恶意安全版本正确实现认证份额与一致性广播。',
  ),
  FHE: proof(
    'Decsk(Evalevk(f, Encpk(x))) = f(x)',
    [['x', '未公开的原始输入'], ['f', '编译为同态算术电路的函数'], ['evk', '公开求值密钥'], ['sk', '仅数据拥有者持有的解密密钥']],
    [['c = Encpk(x)', '数据拥有者先把输入编码并加密。'], ['c′ = Evalevk(f,c)', '计算方只在密文上执行加法和乘法门。'], ['y = Decsk(c′)', '只有密钥持有者恢复结果，并检查结果承诺。']],
    'Noise(c′) < q/2 ∧ Circuit(f) supported ∧ Decsk(c′)=f(x)',
    '噪声未越界且电路编码正确时满足正确性等式；语义安全保证计算方不能从密文恢复 x。',
    '底层 RLWE/LWE 假设成立，参数满足安全级别，近似编码误差在业务容差内。',
  ),
  IVC: proof(
    'πᵢ₊₁ ← ProveStep(πᵢ,zᵢ,δᵢ);  Verify(z₀,zₙ,πₙ)=1',
    [['zᵢ', '第 i 步状态承诺'], ['δᵢ', '本步输入、动作和回执'], ['πᵢ', '覆盖前 i 步的累积证明']],
    [['R(zᵢ,δᵢ,zᵢ₊₁)=1', '每一步先证明状态转换符合冻结规则。'], ['VerifyStep(πᵢ)=1', '新一步必须验证此前所有步骤的累积证明。'], ['πᵢ₊₁=Compress(πᵢ,Rᵢ)', '把旧证明与本步约束压成新的常数大小状态。']],
    'Verify(z₀,zₙ,ruleHash,n,πₙ)=1',
    '最终验证通过意味着存在一条从 z₀ 到 zₙ、每一步都满足 R 且顺序连续的执行链。',
    '状态转换电路完备且可靠，ruleHash 在任务期间不变，公共输入无歧义。',
  ),
  'Recursive ZK': proof(
    'πₙ = Prove(Rₙ(zₙ₋₁,zₙ) ∧ Verify(vkₙ₋₁,πₙ₋₁)=1)',
    [['πₙ₋₁', '覆盖前 n−1 步的子证明'], ['Rₙ', '第 n 步状态转换关系'], ['vkₙ₋₁', '验证子证明的密钥']],
    [['circuitₙ verifies πₙ₋₁', '递归电路把“验证前一证明”本身放进约束。'], ['circuitₙ enforces Rₙ', '同一电路再检查本步输入、输出和规则。'], ['Prove(circuitₙ) → πₙ', '生成的新证明同时覆盖历史链与当前一步。']],
    'Verify(vkₙ, public(z₀,zₙ,ruleHash), πₙ)=1',
    '验证一份 πₙ 即等价于验证整个递归链，但只公开起点、终点和规则承诺。',
    '递归友好曲线/域匹配正确，所有验证密钥被版本化且证明系统满足知识可靠性。',
  ),
  Folding: proof(
    'u′ = u₁ + r·u₂;  E′ = E₁ + r·E₂ + cross(r)',
    [['u₁,u₂', '两个 relaxed-R1CS 实例'], ['r', '由 Fiat–Shamir transcript 导出的随机挑战'], ['E', '允许累积后再统一证明为零的误差项']],
    [['r=H(transcript,u₁,u₂)', '先用不可预测挑战防止证明者提前构造抵消错误。'], ['Fold(u₁,u₂,r)→u′', '线性组合两个实例与见证承诺。'], ['Finalize(u′)→π', '任务结束时证明累积误差满足终结关系。']],
    'VerifyFold(transcript,u′) ∧ VerifyFinal(u′,π)=1',
    '随机折叠和终结证明同时通过时，除可忽略概率外，所有被折叠步骤都满足原约束。',
    '随机预言机模型适用，承诺方案绑定，终结证明覆盖完整累积实例。',
  ),
  'DID / VC': proof(
    'VCok = SigVerify(pkissuer, H(claims∥subject∥exp), σ) ∧ ¬Revoked(id,t)',
    [['σ', '签发机构对凭证内容的数字签名'], ['subject', '凭证持有者或其密钥承诺'], ['exp', '有效期'], ['Revoked', '撤销状态查询']],
    [['m=Canon(claims,subject,exp)', '先规范化字段，避免不同编码产生不同语义。'], ['SigVerify(pkissuer,H(m),σ)', '确认声明确由受信签发者签出且未被篡改。'], ['Check(exp,t) ∧ CheckRevocation(id,t)', '在本次调用时间重新检查过期和撤销状态。']],
    'IssuerTrusted ∧ HolderBound ∧ SigOK ∧ t<exp ∧ Revoked=0',
    '五项同时成立才证明“当前主体此刻持有这项有效资质”。',
    '签发者治理可信、DID 文档解析结果有最终性、私钥未泄漏。',
  ),
  'Selective Disclosure': proof(
    'πsd = ZKPoK{σ,mhidden : Verify(pk,σ,mshown,mhidden)=1 ∧ P(m)=1}',
    [['mshown', '本次必须公开的最少字段'], ['mhidden', '保持隐藏的其余凭证字段'], ['P', '年龄、资质或额度等谓词']],
    [['Commit(mhidden;r)', '先承诺隐藏字段而不公开值。'], ['Prove signature relation', '证明公开与隐藏字段共同属于一份有效签名凭证。'], ['Prove P(m)=1', '在零知识中证明所需谓词，而不是披露原始属性。']],
    'VerifyZK(pkissuer,mshown,P,nonce,πsd)=1 ∧ Fresh(nonce)',
    '验证通过只推出签名和谓词成立，不泄露未披露字段。',
    '证明系统零知识且可靠，随机 nonce 防关联重放，公开字段本身不形成额外身份关联。',
  ),
  FROST: proof(
    'c=H(R∥Y∥m);  z=Σᵢ∈Q zᵢ;  gᶻ = R·Yᶜ',
    [['Y', '门限组公钥'], ['R', '各签名者 nonce 承诺的聚合值'], ['zᵢ', '成员 i 的部分 Schnorr 响应'], ['Q', '达到门限的签名集合']],
    [['R=∏Rᵢ', '参与方先提交一次性 nonce 承诺。'], ['zᵢ=rᵢ+c·λᵢsᵢ', '每方用密钥份额与拉格朗日系数生成部分签名。'], ['z=Σzᵢ', '聚合后得到普通 Schnorr 签名，可由组公钥直接验证。']],
    '|Q|≥t ∧ every partial proof valid ∧ gᶻ=R·Yᶜ',
    '门限成员参与且最终 Schnorr 等式成立时，签名代表该门限组对消息 m 的共同授权。',
    'nonce 不复用、DKG/密钥份额正确、恶意参与方识别与成员变更流程可靠。',
  ),
  'Light Client': proof(
    'Valid(x) = Finalized(h) ∧ MerkleVerify(H(x),path,h.stateRoot)=1',
    [['h', '已验证共识最终性的区块头'], ['x', '目标交易或状态项'], ['path', '从叶子到状态根的 Merkle 路径']],
    [['VerifyValidatorSet(h)', '先验证该高度对应的正确验证者集合。'], ['VerifyQC(h,2f+1)', '再验证区块头获得法定人数最终确认。'], ['FoldPath(H(x),path)=h.stateRoot', '最后逐层重算根，证明 x 确实属于该状态。']],
    'HeaderChainOK ∧ QCOK ∧ MerkleRootMatch',
    '三项通过时，轻客户端无需完整账本也能接受 x 属于已最终确认状态。',
    '初始信任锚正确，验证者集合更新规则安全，不发生超过容错阈值的长程攻击。',
  ),
  'Content-addressed Tree': proof(
    'leafᵢ=H("file"∥pathᵢ∥lenᵢ∥H(bytesᵢ));  root=Merkle(sort(leafᵢ))',
    [['pathᵢ', '从合约根开始的规范相对路径'], ['bytesᵢ', '文件原始字节'], ['root', '整棵业务目录的 Contract Root']],
    [['Normalize(pathᵢ)', '拒绝 ..、路径别名和平台相关分隔符。'], ['leafᵢ=H(domain∥pathᵢ∥lenᵢ∥H(bytesᵢ))', '路径、长度和内容共同进入带域分离的叶子哈希。'], ['root=Merkle(sorted leaves)', '按规范路径排序并两两哈希，得到唯一目录根。']],
    'RecomputeRoot(tree)=onChainContractRoot',
    '根相同意味着在哈希抗碰撞前提下，文件路径集合与每个文件内容都未变化。',
    '哈希抗碰撞，规范化规则唯一，部署端与验证端使用同一目录编码规范。',
  ),
  'Task File ABI': proof(
    'Tₖ = H("task-stage"∥Tₖ₋₁∥stageₖ∥Merkle(Fₖ))',
    [['Tₖ', '第 k 阶段任务文件根'], ['Fₖ', '本阶段新增或确认的规范文件集合'], ['stageₖ', 'Worker、Validator 或 Settlement 阶段标签']],
    [['T₀=H(taskId∥inputRoot)', '调用意图先物化成不可修改的输入文件根。'], ['T₁=H(T₀∥WORKER∥outputRoot∥evidenceRoot)', 'Worker 输出和证据接到同一条根链。'], ['T₂=H(T₁∥VALIDATOR∥verdictRoot)', 'Validator 只读前序根并追加裁决根。']],
    'Receiptₖ.prevTreeRoot=Tₖ₋₁ ∧ Receiptₖ.treeRoot=Tₖ ∧ SigOK',
    '每一阶段都引用前一根且签名有效时，任务文件形成不可抽换、不可乱序的连续轨迹。',
    '系统完整截获协议允许的文件写入，规范编码确定，阶段隔离不能被业务代码绕过。',
  ),
  'Intent-centric': proof(
    'taskId = H(contractRoot∥caller∥nonce∥H(Canon(I)));  Auth(I)=SigVerify(pkcaller,H(I),σ)',
    [['I', '目标、输入、预算、期限和验收谓词'], ['nonce', '调用方单调递增或唯一随机数'], ['taskId', '整个生命周期的确定性标识']],
    [['CI=H(Canon(I))', '先把目标与约束压成不可替换承诺。'], ['Auth=SigVerify(pkcaller,CI,σ)', '证明意图由授权调用方确认。'], ['taskId=H(contractRoot∥caller∥nonce∥CI)', '把合约版本、主体与本次意图绑定成唯一任务。']],
    'Auth(I)=1 ∧ nonce∉Used ∧ PolicyPredicate(I)=1',
    '签名、唯一性和业务谓词通过后才能创建任务；执行路径可变化，但不能越过 I。',
    '调用方密钥安全，规范编码唯一，策略检查确定性且在任务开始前固定。',
  ),
  'A2A Protocol': proof(
    'hᵢ = H(hᵢ₋₁∥taskId∥seqᵢ∥typeᵢ∥payloadRootᵢ);  σᵢ=Signskᵢ(hᵢ)',
    [['seqᵢ', '严格递增的消息序号'], ['payloadRootᵢ', '本次 A2A 载荷的内容根'], ['hᵢ', '覆盖此前消息的链式 transcript 根']],
    [['Resolve(name)→DID,endpoint,key', '先从 ANS 得到带版本和有效期的服务身份。'], ['hᵢ=H(hᵢ₋₁∥messageᵢ)', '每条消息引用前一摘要，防止删改与乱序。'], ['Verify(keyᵢ,hᵢ,σᵢ)', '接收方验证消息确由当前协作者签发。']],
    'ANSRecordValid ∧ seqᵢ=seqᵢ₋₁+1 ∧ SigOK ∧ taskId constant',
    '名称解析、顺序、签名和任务绑定全部成立时，协作 transcript 可完整追溯。',
    '端点可达不代表服务诚实；结果仍需 Validator、回执与结算规则独立验证。',
  ),
  'Mechanism Design': proof(
    'Uhonest = p·R − C;  Ucheat = q·R − Ccheat − (1−q)·D;  require Uhonest ≥ Ucheat',
    [['p', '诚实结果通过验收的概率'], ['q', '作弊结果逃过验收的概率'], ['R', '通过后奖励'], ['D', '失败或作弊被发现后的保证金损失']],
    [['Estimate p,q,C,Ccheat', '先从任务难度与验证强度估计参与者成本和通过概率。'], ['Choose R for participation', '令 pR−C≥0，使诚实服务有参与动力。'], ['Choose D for incentive compatibility', '令 pR−C≥qR−Ccheat−(1−q)D，使作弊不更划算。']],
    'Participation: Uhonest≥0;  Incentive compatibility: Uhonest≥Ucheat',
    '两条不等式成立时，理性参与者选择诚实服务是弱占优或至少最优回应。',
    '参与者近似理性，q 可估计，身份成本足以限制女巫攻击，串谋收益已计入 Ccheat。',
  ),
  'Information Design': proof(
    'Posterior P(q|s)=P(s|q)P(q)/P(s);  truthful score S(p,y)=y·ln p+(1−y)·ln(1−p)',
    [['q', 'Agent 的真实服务质量'], ['s', '公开的回执、信誉与价格信号'], ['p', 'Agent 报告的成功概率'], ['y', '任务最终是否通过验收']],
    [['Update posterior with signed signals', '选择方只用可验证、带时间与任务难度的信号更新判断。'], ['Apply proper scoring rule', '用严格适当评分规则，使报告真实概率最大化期望得分。'], ['Discount stale/correlated evidence', '对过期、同源或可自交易信号降权，避免重复计算信息。']],
    'E[S(p,y)] is maximized at p=P(y=1|information)',
    '严格适当评分规则下，诚实报告自身成功概率在期望上最优；签名回执保证信号可追溯。',
    '验收结果 y 相对客观，关联样本被识别，任务难度校准正确。',
  ),
  'UCAN / ZCAP': proof(
    'ValidChain = ∧ᵢ SigVerify(pkᵢ,capᵢ,σᵢ) ∧ capᵢ₊₁⊆capᵢ ∧ expᵢ₊₁≤expᵢ',
    [['capᵢ', '第 i 次委托的资源、动作与条件集合'], ['⊆', '后续能力只能收窄，不能扩大'], ['expᵢ', '本级能力过期时间']],
    [['Verify root grant', '先验证根能力来自资源控制者。'], ['Verify each signature', '沿委托链逐级确认授权主体。'], ['Check attenuation and expiry', '每一级资源、动作、条件和有效期都只能更严格。']],
    'RootTrusted ∧ all signatures valid ∧ monotone attenuation ∧ now<min(expᵢ) ∧ not revoked',
    '整条链满足单调收窄、未过期和未撤销时，本次动作才在最终能力范围内。',
    '能力令牌保密、撤销信息及时、资源标识与动作语义规范化。',
  ),
  'Receipt Root': proof(
    'h₀=H("receipt"∥Canon(ρ));  hⱼ₊₁=H(sideⱼ∥hⱼ∥siblingⱼ);  hₖ=rootR',
    [['ρ', '一条规范化 Worker、Validator 或系统回执'], ['siblingⱼ', 'Merkle 路径第 j 层兄弟节点'], ['rootR', '链上确认的 Receipt Root']],
    [['h₀=H(domain∥Canon(ρ))', '先对回执做域分离和规范编码。'], ['Fold path', '按左右位置逐层与兄弟哈希组合。'], ['Compare hₖ with rootR', '最终值必须与链上根完全相同。']],
    'MerkleVerify(H(Canon(ρ)), path, rootR)=1 ∧ SigVerify(signer,ρ)=1',
    '路径验证证明回执被包含；签名验证再证明回执由对应责任主体生成。',
    '哈希抗碰撞、路径方向编码正确；包含性不自动证明回执描述的现实事件真实。',
  ),
  'Remote Attestation': proof(
    'q=SignAK(measurement∥TCB∥reportData∥nonce);  VerifyQuote(q)=1',
    [['measurement', '代码、配置或模型加载后的度量'], ['reportData', 'taskId、输入/输出根等应用绑定数据'], ['nonce', '验证方本次挑战']],
    [['Check endorsement chain', '验证 AK 来自受信厂商和真实平台。'], ['Check measurement and TCB', '度量必须在允许列表，固件版本未被撤销。'], ['Check reportData and nonce', 'Quote 必须绑定当前任务与新鲜挑战，不能挪用旧证明。']],
    'VendorChainOK ∧ measurement∈Allowlist ∧ TCB≥min ∧ nonce=current ∧ SigOK',
    '全部成立时，可确认这份 reportData 由指定隔离环境在本次挑战中签出。',
    '信任硬件根、厂商撤销服务和侧信道缓解措施；不推出业务输出必然正确。',
  ),
  'Proof of Intelligence': proof(
    'ValidPoI = Dsig ∧ Rok ∧ VerifyExec(πexec)=1 ∧ (taskId∉Spent)',
    [['Dsig', '真实需求方签名'], ['Rok', '按冻结规则验收通过'], ['πexec', '执行或环境证明'], ['Spent', '已计分/已结算任务集合']],
    [['Verify demand signature', '排除执行者自造的无需求计算。'], ['Verify accepted result', '确认 Validator 按事前规则接受结果。'], ['Verify execution and anti-replay', '证明计算与任务绑定，并且未被重复计分。']],
    'SigOK ∧ VerdictOK ∧ ProofOK ∧ Fresh(taskId)',
    '四个布尔条件取逻辑与，任何一项为 0 都不会进入有效 PoI 池。',
    '验收谓词能代表业务价值，身份/自交易治理有效，执行证明系统可靠。',
  ),
  zkML: proof(
    'πML = Prove{M,x : H(M)=CM ∧ H(x)=Cx ∧ CircuitM(x)=y};  Verify(vk,CM,Cx,Cy,πML)=1',
    [['CM', '模型参数或模型文件承诺'], ['Cx', '私密输入承诺'], ['Cy', '输出承诺'], ['CircuitM', '模型推理的算术电路']],
    [['Compile M to circuit', '把受支持算子、量化和舍入规则固定为约束。'], ['Commit model/input/output', '用承诺绑定实际模型、输入和输出。'], ['Generate proof of all gates', '证明每个电路门与最终输出都满足约束。']],
    'Verify(vk,CM,Cx,Cy,πML)=1 ∧ Open(Cy)=y',
    '验证通过说明存在与承诺匹配的模型和输入，使固定电路输出 y；模型与输入无需公开。',
    '电路正确表达目标模型，量化误差已定义，可信设置/透明证明假设与参数安全。',
  ),
  VRF: proof(
    '(y,π)=VRF.Eval(sk,seed);  VRF.Verify(pk,seed,y,π)=1;  selected ⇔ y/2ˡ < w/W',
    [['seed', '上一最终区块等不可事前操纵的公共种子'], ['y', '伪随机输出'], ['w/W', '候选人权重占总权重比例'], ['π', '输出正确性的唯一性证明']],
    [['Evaluate with secret key', '候选人在不知道别人输出的情况下计算 y 与证明。'], ['Verify uniqueness proof', '任何人用公钥验证 y 确由该 seed 唯一导出。'], ['Compare normalized y to threshold', '输出落入权重阈值区间时被选中。']],
    'VRF.Verify=1 ∧ seed finalized ∧ y/2ˡ<w/W',
    '证明有效且阈值命中时，选择结果公开可验、事前不可预测，并与权重成比例。',
    'seed 无偏或难以操纵，密钥未泄露，权重快照在抽签前已固定。',
  ),
  'BFT / HotStuff': proof(
    'N=3f+1, |Q|=2f+1;  |Q₁∩Q₂| ≥ (2f+1)+(2f+1)−(3f+1)=f+1',
    [['N', '共识验证节点总数'], ['f', '最多可容忍的拜占庭节点数'], ['Q', '形成 Quorum Certificate 的投票集合']],
    [['Require 2f+1 votes', '任何 QC 都必须获得超过三分之二节点签名。'], ['Intersect two quorums', '两个 2f+1 集合至少重叠 f+1 个节点。'], ['At least one overlap node honest', '最多 f 个恶意节点，所以交集里至少有一个诚实节点不会对冲突锁重复投票。']],
    'N≥3f+1 ∧ |Q|≥2f+1 ∧ signatures valid ∧ locking rule obeyed',
    '这些条件下两个冲突区块不能同时获得可提交 QC，从而证明安全性；网络恢复后再由活性规则推进。',
    '认证信道、成员集合一致、故障数不超过 f；异步期间只保证安全，不保证立即出块。',
  ),
} as const satisfies Record<TechKey, ProofDerivation>;

export function TechTerm({
  term,
  label,
}: {
  term: TechKey;
  label?: string;
}) {
  const note = techNotes[term];

  return (
    <DetailHint
      className="tech-term"
      category="技术细节"
      label={<><span>{label ?? term}</span><i aria-hidden="true">?</i></>}
      title={term}
      summary={note.summary}
      details={[
        { label: '机制', value: note.mechanism },
        { label: '注意边界', value: note.boundary },
      ]}
      derivation={techProofs[term]}
    />
  );
}
