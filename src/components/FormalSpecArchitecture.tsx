import type { ReactNode } from 'react';
import { DetailHint, type DetailRow, type ProofDerivation } from './DetailHint';
import { derivations } from './DerivationLibrary';
import { Icon, type IconName } from './Icons';

type Hint = {
  title: string;
  summary: string;
  details: readonly DetailRow[];
};

const hints = {
  worldState: {
    title: 'Σ · ACVM 世界状态',
    summary: '某个区块高度上，ACVM 对身份、合约、任务、回执和证明的完整账本快照。',
    details: [
      { label: '从哪来', value: '由上一状态执行已确认交易后得到，并由共识节点共同保存。' },
      { label: '验证', value: '五个子状态按固定编码计算状态根；任一字段变化都会得到不同的 root(Σ)。' },
    ],
  },
  definition: {
    title: '≡ · 定义为',
    summary: '表示左侧对象在本规范中由右侧结构精确定义，不是一次运行时比较。',
    details: [
      { label: '含义', value: '“Σ 定义为由 A、C、T、R、P 组成的五元组”。' },
      { label: '作用', value: '固定结构后，不同节点才能按同一顺序编码并计算相同状态根。' },
    ],
  },
  actors: {
    title: 'A · Actors 身份状态',
    summary: '保存人、机构、Agent 与节点的身份绑定、验证密钥、角色和撤销状态。',
    details: [
      { label: '写入内容', value: 'DID、机构凭证摘要、设备或 TEE 度量、能力范围与有效期。' },
      { label: '影响', value: 'A 决定谁能部署、调用、执行、验收或参与共识；撤销后后续调用立即失效。' },
    ],
  },
  contracts: {
    title: 'C · Contracts 合约状态',
    summary: '保存 Agentic Contract 业务目录的内容根、版本以及 Worker / Validator 入口。',
    details: [
      { label: '写入内容', value: 'contract.ts、Schema、Worker、Validator 和结算代码共同生成的 Contract Tree Root。' },
      { label: '影响', value: '执行与验收必须引用同一目录根，任务中途替换任何业务文件都会被识别为新版本。' },
    ],
  },
  tasks: {
    title: 'T · Tasks 任务状态',
    summary: '记录每个任务当前走到哪一步，以及等待、重试、超时和完成状态。',
    details: [
      { label: '写入内容', value: 'taskId、输入根、当前任务文件根、阶段、责任方、截止时间和前序状态承诺。' },
      { label: '影响', value: '长任务跨越多个区块时，T 保证暂停、恢复和重试仍属于同一条工作轨迹。' },
    ],
  },
  receipts: {
    title: 'R · Receipts 回执状态',
    summary: '保存 Worker、Validator、工具和安全控制器产生的可验证执行事实。',
    details: [
      { label: '写入内容', value: '输入根、结果根、裁决根、执行者签名、时间、错误码和证明引用。' },
      { label: '影响', value: '状态转换必须引用对应回执；没有有效回执的链下结果不能推进任务。' },
    ],
  },
  proofs: {
    title: 'P · Proofs 证明状态',
    summary: '保存对执行、身份、硬件环境或长期任务连续性的密码学证明。',
    details: [
      { label: '写入内容', value: '证明系统标识、公共输入、验证密钥版本、证明摘要和验证结果。' },
      { label: '影响', value: 'P 让节点验证结论而不重复全部重计算，也不必看到原始隐私数据。' },
    ],
  },
  currentState: {
    title: 'Σₜ · 转换前状态',
    summary: '下标 t 表示当前已最终确认的账本时刻或区块高度。',
    details: [
      { label: '约束', value: '所有验证节点必须从同一个 Σₜ 和同一批有序输入开始执行。' },
      { label: '失败时', value: '若本地状态根不同，节点不能对新状态投票，必须先完成状态同步。' },
    ],
  },
  nextState: {
    title: 'Σₜ₊₁ · 转换后状态',
    summary: '有效意图与回执通过后，由状态转换函数产生的下一份确定性状态。',
    details: [
      { label: '成立条件', value: '权限、回执、证明、重放保护和业务谓词全部通过。' },
      { label: '写入链上', value: '共识确认后，Σₜ₊₁ 的状态根成为下一次执行的唯一基准。' },
    ],
  },
  transition: {
    title: 'Γₐ · Agentic Contract 状态转换函数',
    summary: '按照合约 A 的规则，把当前状态、调用意图和回执映射为候选新状态。',
    details: [
      { label: '输入', value: '当前世界状态 Σ、签名意图 I、执行与验收回执 ρ。' },
      { label: '要求', value: '函数的链上部分必须确定性执行；同样输入在所有节点上必须得到同样输出。' },
    ],
  },
  intent: {
    title: 'I · 签名调用意图',
    summary: '调用方提交的目标、参数、预算、权限范围、期限和验收条件。',
    details: [
      { label: '身份绑定', value: 'I 带调用方签名、nonce 和能力凭证，防止别人替换参数或重复调用。' },
      { label: '影响', value: 'Worker 只能在 I 的边界内执行；Validator 以同一份 I 判断结果是否合格。' },
    ],
  },
  receiptBundle: {
    title: 'ρ · 本次任务回执包',
    summary: '与同一 taskId 绑定的 Worker、Validator、工具与环境证明集合。',
    details: [
      { label: '必须包含', value: '前序状态根、任务文件根、执行者签名、验证结果、证明和防重放字段。' },
      { label: '验证失败', value: 'ρ 中任一必要项缺失、签名错误或版本不匹配，状态保持不变。' },
    ],
  },
  root: {
    title: 'root(Σ) · 世界状态根',
    summary: '对整个 ACVM 世界状态的短密码学承诺，用于区块头、状态同步和审计。',
    details: [
      { label: '计算', value: 'A、C、T、R、P 分别规范编码后，按固定顺序组合并哈希。' },
      { label: '能证明什么', value: '相同 root 表示节点承诺同一状态；配合包含证明可核验某条具体记录。' },
    ],
  },
  hash: {
    title: 'H · 密码学哈希函数',
    summary: '把任意长度的规范编码压缩为固定长度摘要。',
    details: [
      { label: '要求', value: '规范必须固定算法、字段编码和域分离，避免不同实现算出不同结果。' },
      { label: '边界', value: '哈希证明内容未变，不证明内容本身真实；真实性仍由签名、证明和来源核验。' },
    ],
  },
  concatenate: {
    title: '∥ · 按顺序连接',
    summary: '把多个子状态的规范编码按既定顺序拼接后再哈希。',
    details: [
      { label: '顺序', value: '固定为 A、C、T、R、P，不能由实现自行排序。' },
      { label: '防歧义', value: '每段必须带长度或类型标签，避免不同字段组合得到同一字节串。' },
    ],
  },
  agenticContract: {
    title: 'Cₐ · Agentic Contract 定义',
    summary: '一个内容寻址的业务目录，统一包含数据格式、Worker、Validator 和结算逻辑。',
    details: [
      { label: '部署结果', value: '目录内每个业务文件参与 Contract Tree Root 计算，任何内容或路径变化都会产生新版本。' },
      { label: '系统边界', value: '工具、文件系统和网络运行配置由 ACVM / a3s-box 固定，不属于用户提交的合约目录。' },
    ],
  },
  definitionFile: {
    title: 'M · contract.ts 业务定义',
    summary: '声明合约名称、业务入口、验收阈值和结算方式，不包含系统运行配置。',
    details: [
      { label: '可以修改', value: 'Worker / Validator 入口、业务阈值、计价规则和所引用的 Schema。' },
      { label: '不能修改', value: 'a3s-box 的工具能力、文件系统边界、网络规则和轨迹采集方式没有用户配置入口。' },
    ],
  },
  schemaFiles: {
    title: 'S · schemas.ts 文件契约',
    summary: '固定输入、Worker 结果和 Validator 裁决文件的结构与规范编码。',
    details: [
      { label: '运行前', value: '输入文件必须先通过 Schema，失败时不启动 Worker。' },
      { label: '阶段间', value: '每个阶段只接收上一阶段已经验证并绑定到回执根的文件。' },
    ],
  },
  contractTree: {
    title: 'Tree · 内容寻址目录',
    summary: '按规范路径和内容摘要计算整棵业务目录的 Merkle Root。',
    details: [
      { label: '参与计算', value: 'contract.ts、schemas.ts、worker/、validator/ 与 settle.ts。' },
      { label: '不参与计算', value: '平台固定的工具、文件系统和网络运行配置不由合约作者提供。' },
    ],
  },
  treeConcatenate: {
    title: '∥ · 按目录顺序组合',
    summary: '把业务定义、Schema、Worker、Validator 和结算文件按规范路径组合后计算目录根。',
    details: [
      { label: '固定顺序', value: 'M、S、W、V、F 只是公式缩写；实际计算按完整规范路径的字节序排序。' },
      { label: '防歧义', value: '每个叶子都带相对路径、文件长度和内容摘要，不能通过改名或拼接得到同一棵树。' },
    ],
  },
  worker: {
    title: 'Wbox · Worker 工作负载',
    summary: '合约目录中的 worker/ 业务程序，由 a3s-box 在系统固定边界内启动。',
    details: [
      { label: '业务内容', value: 'Worker 入口、领域逻辑以及它所引用的输入与结果 Schema。' },
      { label: '必须留下', value: '输入根、证据文件、结果文件、工具轨迹和签名执行回执。' },
    ],
  },
  validator: {
    title: 'Vbox · Validator 工作负载',
    summary: '独立于 Worker 的验收程序，用同一意图和规则判断结果是否可接受。',
    details: [
      { label: '业务内容', value: '验收谓词、复算逻辑、裁决 Schema、阈值和拒绝原因格式。' },
      { label: '独立性', value: 'Validator 可由不同主体和隔离环境运行，避免 Worker 自己给自己验收。' },
    ],
  },
  finality: {
    title: 'F · settle.ts 结算与终局',
    summary: '读取已绑定的裁决文件，规定何时结算以及任务何时进入最终状态。',
    details: [
      { label: '可能条件', value: 'Validator 阈值、挑战期结束、BFT 最终确认、付款状态或外部审批。' },
      { label: '效果', value: 'F 成立后任务进入不可重复结算状态，并写入最终回执与状态根。' },
    ],
  },
  authorize: {
    title: 'Authorize(I, P) · 授权检查',
    summary: '确认意图 I 的签名、nonce、能力范围和期限都符合策略 P。',
    details: [
      { label: '通过', value: '生成可执行任务并冻结本次授权上下文。' },
      { label: '拒绝', value: '不启动 Worker，不消耗外部资源，只记录拒绝原因。' },
    ],
  },
  runBox: {
    title: 'Run_box(W) · 隔离执行',
    summary: 'a3s-box 按平台固定边界运行 Worker，并把调用意图物化为任务输入文件。',
    details: [
      { label: '输出', value: '结果文件、证据文件、任务文件根、工具轨迹和 Worker Receipt。' },
      { label: '系统控制', value: '工具、文件与网络边界不可由合约代码覆盖；越界会终止任务并生成失败回执。' },
    ],
  },
  verifyBox: {
    title: 'Verify_box(V) · 独立验收',
    summary: '在独立 a3s-box 中运行 Validator，对结果和证据执行固定验收规则。',
    details: [
      { label: '输出', value: '裁决文件、谓词结果、证据引用、任务文件根和 Validator Receipt。' },
      { label: '约束', value: '必须绑定相同 taskId、输入根、Worker 输出根和合约目录根。' },
    ],
  },
  trace: {
    title: 'Trace(R) · 写入工作轨迹',
    summary: '把本次必要回执加入回执状态 R，并更新 Receipt Root。',
    details: [
      { label: '链上保存', value: '任务文件根、回执摘要、签名者、时间、状态码和证明引用；正文文件留在链下。' },
      { label: '审计', value: '任何人可用具体回执和 Merkle 路径核对它是否包含在已确认根中。' },
    ],
  },
  finalize: {
    title: 'Finalize(F) · 终局检查',
    summary: '确认验收阈值、挑战期和共识最终性已经满足。',
    details: [
      { label: '通过', value: '提交新状态、执行结算并阻止相同任务再次终结。' },
      { label: '未通过', value: '任务保持等待或争议状态，不提前释放资金和权限。' },
    ],
  },
  conjunction: {
    title: '∧ · 所有条件同时成立',
    summary: '逻辑“与”，左右两侧以及整条表达式中的每个条件都必须为真。',
    details: [
      { label: '短路规则', value: '任一必要条件失败即可拒绝本次状态转换。' },
      { label: '设计目的', value: '避免只验证结果，却遗漏授权、执行环境、轨迹或终局条件。' },
    ],
  },
  verifyReceipt: {
    title: 'Verify(ρ) · 回执验证器',
    summary: '确定性检查回执包的签名、任务文件根、证明、合约目录根和业务谓词。',
    details: [
      { label: '返回 1', value: '所有必要检查通过，可以计算候选新状态。' },
      { label: '返回 0', value: '至少一项失败，状态不得改变，并记录可追溯的拒绝原因。' },
    ],
  },
  trueValue: {
    title: '1 · 验证通过',
    summary: '布尔真值，表示 Verify 已完成全部必要检查而不是“多数看起来正确”。',
    details: [
      { label: '确定性', value: '同一 ρ 和同一验证规则必须在所有共识节点上返回 1。' },
      { label: '后续', value: '只有返回 1 才允许执行 Γₐ 并对新状态投票。' },
    ],
  },
  falseValue: {
    title: '0 · 验证失败',
    summary: '布尔假值，表示回执缺失、无效或没有满足合约谓词。',
    details: [
      { label: '状态处理', value: 'Σ′ 保持等于 Σ，不能把失败任务伪装成已完成。' },
      { label: '可追溯', value: '拒绝码和相关回执仍可写入审计轨迹，便于重试或发起争议。' },
    ],
  },
  implies: {
    title: '⇒ · 条件蕴含',
    summary: '左侧条件成立时，协议必须执行右侧规则。',
    details: [
      { label: '通过分支', value: 'Verify(ρ)=1 时计算并提交候选新状态。' },
      { label: '失败分支', value: 'Verify(ρ)=0 时执行拒绝规则，保持原状态。' },
    ],
  },
  candidateState: {
    title: 'Σ′ · 候选新状态',
    summary: '本地执行状态转换后得到、尚待共识确认的状态。',
    details: [
      { label: '何时生效', value: '只有节点对同一状态根形成法定人数确认后才成为正式下一状态。' },
      { label: '分叉保护', value: '节点结果不一致时不会提交，必须定位非确定性或状态不同步问题。' },
    ],
  },
  poi: {
    title: 'PoI · Intelligence Proof',
    summary: '对一次“有真实需求、结果被接受、执行可证明且未重放”的有效计算记录。',
    details: [
      { label: '用途', value: '进入有效工作池，用于贡献计分、调度信誉或共识提议权。' },
      { label: '不代表', value: 'PoI 不直接评价模型聪明程度，只证明预先约定的有效工作条件成立。' },
    ],
  },
  signedDemand: {
    title: 'Dsig · 已签名真实需求',
    summary: '由授权用户或机构签名的任务需求，证明计算不是执行者凭空自造。',
    details: [
      { label: '绑定内容', value: '任务目标、预算、验收规则、时间、nonce 和需求方身份。' },
      { label: '防作弊', value: '同一需求不能被拆分或循环提交来重复赚取贡献。' },
    ],
  },
  acceptedResult: {
    title: 'Rok · 已验收结果',
    summary: 'Validator 按冻结的业务谓词确认结果达到交付标准。',
    details: [
      { label: '证据', value: '验收回执、抽样复算、多源数据或门限签名。' },
      { label: '约束', value: '验收规则必须在任务开始前固定，不能看到结果后临时放宽。' },
    ],
  },
  executionProof: {
    title: 'πexec · 执行证明',
    summary: '证明指定代码在指定输入承诺和环境下产生了当前输出承诺。',
    details: [
      { label: '形式', value: '可由 ZK、TEE 远程证明、可复算轨迹或多方签名组合而成。' },
      { label: '绑定', value: '必须绑定 taskId、合约版本、模型/镜像哈希和防重放 nonce。' },
    ],
  },
  antiReplay: {
    title: '¬Replay · 未发生重放',
    summary: '证明当前需求、回执和证明尚未被用于另一笔有效贡献。',
    details: [
      { label: '检查', value: '查询 nonce、taskId、输出承诺和已消费回执集合。' },
      { label: '失败时', value: '重复提交直接拒绝，不增加 PoI 计分，也不再次结算。' },
    ],
  },
  negation: {
    title: '¬ · 逻辑否定',
    summary: '要求后面的 Replay 条件为假，即这份工作记录没有被重复使用。',
    details: [
      { label: '含义', value: '“NOT Replay”或“不是重放”。' },
      { label: '作用', value: '把防重放从可选检查提升为生成 PoI 的必要条件。' },
    ],
  },
  taskId: {
    title: 'taskId · 全局任务标识',
    summary: '把意图、Worker 回执、Validator 回执、证明和最终状态串成同一条轨迹。',
    details: [
      { label: '生成', value: '通常由合约地址、调用方、nonce 和意图摘要确定性派生。' },
      { label: '检查', value: '所有回执必须携带同一 taskId；不匹配的证据不能混入当前任务。' },
    ],
  },
  prevRoot: {
    title: 'prevRoot · 前序状态根',
    summary: 'Worker 开始执行时所依据的已确认状态根。',
    details: [
      { label: '作用', value: '防止任务在过期状态上执行后覆盖较新的链上状态。' },
      { label: '冲突', value: '若链上当前 root 已变化，合约按策略重试、重新验证或拒绝提交。' },
    ],
  },
  outputCommitment: {
    title: 'outputCommitment · 输出承诺',
    summary: '对完整业务输出的哈希或密码学承诺，链上无需保存敏感大文件。',
    details: [
      { label: '打开方式', value: '审计时提交原始输出和随机盐，重新计算承诺并与链上值比较。' },
      { label: '绑定', value: '必须同时绑定 taskId、代码版本和输入承诺，避免移花接木。' },
    ],
  },
  taskTreeRoot: {
    title: 'taskTreeRoot · 任务文件树根',
    summary: '对当前 taskId 下输入、证据、结果、裁决和结算文件的内容寻址承诺。',
    details: [
      { label: '计算', value: '系统按固定路径、规范编码和阶段顺序计算 Merkle Root，合约代码不能自选漏掉某个文件。' },
      { label: '用途', value: 'Worker、Validator 与结算回执逐级引用前一阶段根，任一文件被替换都会断开验证链。' },
    ],
  },
  proofField: {
    title: 'proof · 执行或验收证明',
    summary: '让节点在不重跑全部链下任务的情况下，验证输出和环境满足合约规则。',
    details: [
      { label: '公共输入', value: 'taskId、前序状态根、输出承诺、合约/镜像哈希和 nonce。' },
      { label: '验证', value: '按合约固定的 proofType 和验证密钥执行，版本不匹配直接拒绝。' },
    ],
  },
  bftVrf: {
    title: 'BFT + VRF · 提议与确认',
    summary: 'VRF 从有效参与者中产生可验证抽签结果，BFT 对提议区块和状态根形成最终确认。',
    details: [
      { label: '输入', value: '已验证 PoI、公共随机种子、成员集合和贡献权重。' },
      { label: '边界', value: 'VRF 负责不可预测抽签，BFT 负责一致性；二者都不替代 PoI 的业务验收。' },
    ],
  },
  stateRoot: {
    title: 'stateRoot · 区块后状态根',
    summary: '当前区块所有有效状态转换执行完毕后的世界状态承诺。',
    details: [
      { label: '共识对象', value: '验证节点必须对完全相同的 stateRoot 投票。' },
      { label: '用途', value: '状态同步、轻客户端验证和后续任务的 prevRoot。' },
    ],
  },
  poiRoot: {
    title: 'poiRoot · 有效智能证明根',
    summary: '本区块纳入的 PoI 记录集合的 Merkle Root。',
    details: [
      { label: '包含内容', value: '需求、验收、执行证明和防重放标识的规范摘要。' },
      { label: '用途', value: '核验某次有效工作是否被计入区块，而不把全部证明正文放进区块头。' },
    ],
  },
} as const satisfies Record<string, Hint>;

type HintKey = keyof typeof hints;

const formalDerivations: Record<HintKey, ProofDerivation> = {
  worldState: derivations.worldState,
  definition: derivations.canonicalEncoding,
  actors: derivations.identityAuthorization,
  contracts: derivations.contractTree,
  tasks: derivations.taskState,
  receipts: derivations.receiptMerkle,
  proofs: derivations.proofSoundness,
  currentState: derivations.deterministicState,
  nextState: derivations.deterministicState,
  transition: derivations.deterministicState,
  intent: derivations.signedIntent,
  receiptBundle: derivations.receiptBundle,
  root: derivations.worldState,
  hash: derivations.hashBinding,
  concatenate: derivations.canonicalEncoding,
  agenticContract: derivations.contractTree,
  definitionFile: derivations.contractTree,
  schemaFiles: derivations.schemaValidation,
  contractTree: derivations.contractTree,
  treeConcatenate: derivations.canonicalEncoding,
  worker: derivations.workerExecution,
  validator: derivations.validatorDecision,
  finality: derivations.bftFinality,
  authorize: derivations.identityAuthorization,
  runBox: derivations.workerExecution,
  verifyBox: derivations.validatorDecision,
  trace: derivations.receiptMerkle,
  finalize: derivations.bftFinality,
  conjunction: derivations.booleanConjunction,
  verifyReceipt: derivations.receiptVerification,
  trueValue: derivations.booleanConjunction,
  falseValue: derivations.booleanConjunction,
  implies: derivations.implication,
  candidateState: derivations.deterministicState,
  poi: derivations.poi,
  signedDemand: derivations.signedIntent,
  acceptedResult: derivations.validatorDecision,
  executionProof: derivations.proofSoundness,
  antiReplay: derivations.antiReplay,
  negation: derivations.implication,
  taskId: derivations.antiReplay,
  prevRoot: derivations.hashChain,
  outputCommitment: derivations.hashBinding,
  taskTreeRoot: derivations.contractTree,
  proofField: derivations.proofSoundness,
  bftVrf: derivations.vrfBft,
  stateRoot: derivations.worldState,
  poiRoot: derivations.receiptMerkle,
};

function FormulaToken({ hint, children, className = '' }: { hint: HintKey; children: ReactNode; className?: string }) {
  const note = hints[hint];
  return (
    <DetailHint
      className={`formula-token ${className}`.trim()}
      category="公式参数"
      label={children}
      title={note.title}
      summary={note.summary}
      details={note.details}
      derivation={formalDerivations[hint]}
    />
  );
}

function FormulaOperator({ hint, children }: { hint: HintKey; children: ReactNode }) {
  return <FormulaToken hint={hint} className="formula-operator">{children}</FormulaToken>;
}

function SpecChrome({ chapter, status }: { chapter: string; status: string }) {
  return (
    <header className="panel-chrome">
      <span><i /><i /><i /></span>
      <code>ACVM FORMAL MODEL / {chapter}</code>
      <strong><i /> {status}</strong>
    </header>
  );
}

function Equation({
  number,
  title,
  explanation,
  children,
}: {
  number: string;
  title: string;
  explanation: string;
  children: ReactNode;
}) {
  return (
    <div className="formal-equation">
      <small className="equation-heading">
        <span>FORMAL DEFINITION</span>
        <DetailHint
          className="equation-guide"
          category="整式解读"
          label="悬停符号"
          title={title}
          summary={explanation}
          details={[{ label: '操作', value: '将鼠标移到带虚线的符号上，可查看数据来源、验证方式和失败影响。' }]}
        />
      </small>
      <strong>{children}</strong>
      <span>({number})</span>
    </div>
  );
}

const stateParts: Array<[HintKey, string, string, string]> = [
  ['actors', 'A', '身份', 'Actors'],
  ['contracts', 'C', '合约', 'Contracts'],
  ['tasks', 'T', '任务', 'Tasks'],
  ['receipts', 'R', '回执', 'Receipts'],
  ['proofs', 'P', '证明', 'Proofs'],
];

export function StateModelArchitecture() {
  return (
    <div className="diagram-panel formal-panel state-model-panel">
      <SpecChrome chapter="02 · WORLD STATE" status="DRAFT SPEC" />
      <div className="formal-panel-body">
        <Equation
          number="ACVM.1"
          title="世界状态五元组"
          explanation="ACVM 把一切可共识的数据拆成五类子状态，并用固定顺序承诺为一个世界状态。"
        >
          <FormulaToken hint="worldState">Σ</FormulaToken>{' '}
          <FormulaOperator hint="definition">≡</FormulaOperator>{' ('}
          <FormulaToken hint="actors">A</FormulaToken>,{' '}
          <FormulaToken hint="contracts">C</FormulaToken>,{' '}
          <FormulaToken hint="tasks">T</FormulaToken>,{' '}
          <FormulaToken hint="receipts">R</FormulaToken>,{' '}
          <FormulaToken hint="proofs">P</FormulaToken>)
        </Equation>
        <div className="state-part-grid" aria-label="ACVM 世界状态的五个组成部分">
          {stateParts.map(([hint, code, title, detail]) => (
            <article key={code}>
              <FormulaToken hint={hint}><b>{code}</b></FormulaToken>
              <strong>{title}</strong>
              <small>{detail}</small>
            </article>
          ))}
        </div>
        <div className="formal-transition">
          <span><small>BEFORE</small><strong><FormulaToken hint="currentState">Σₜ</FormulaToken></strong></span>
          <i>
            <code>
              <FormulaToken hint="transition">Γ<sub>A</sub></FormulaToken>({' '}
              <FormulaToken hint="intent">I</FormulaToken>,{' '}
              <FormulaToken hint="receiptBundle">ρ</FormulaToken>)
            </code>
            <b>有效意图 + 有效回执</b>
          </i>
          <span><small>AFTER</small><strong><FormulaToken hint="nextState">Σₜ₊₁</FormulaToken></strong></span>
        </div>
      </div>
      <footer className="formal-note">
        <span>STATE ROOT</span>
        <strong>
          <FormulaToken hint="root">root(Σ)</FormulaToken> ={' '}
          <FormulaToken hint="hash">H</FormulaToken>({' '}
          <FormulaToken hint="actors">A</FormulaToken>{' '}
          <FormulaOperator hint="concatenate">∥</FormulaOperator>{' '}
          <FormulaToken hint="contracts">C</FormulaToken>{' '}
          <FormulaOperator hint="concatenate">∥</FormulaOperator>{' '}
          <FormulaToken hint="tasks">T</FormulaToken>{' '}
          <FormulaOperator hint="concatenate">∥</FormulaOperator>{' '}
          <FormulaToken hint="receipts">R</FormulaToken>{' '}
          <FormulaOperator hint="concatenate">∥</FormulaOperator>{' '}
          <FormulaToken hint="proofs">P</FormulaToken>)
        </strong>
      </footer>
    </div>
  );
}

const contractParts: Array<[HintKey, string, string, string]> = [
  ['definitionFile', 'M', 'contract.ts', '业务参数 · 入口'],
  ['schemaFiles', 'S', 'schemas.ts', '输入 · 结果 · 裁决'],
  ['worker', 'W', 'worker/', '执行工作负载'],
  ['validator', 'V', 'validator/', '核验工作负载'],
  ['finality', 'F', 'settle.ts', '结算与终局'],
];

export function ContractModelArchitecture() {
  return (
    <div className="diagram-panel formal-panel contract-model-panel">
      <SpecChrome chapter="01 · AGENTIC CONTRACT" status="2 WORKLOADS / 1 CONTRACT" />
      <div className="formal-panel-body">
        <Equation
          number="ACVM.2"
          title="Agentic Contract 目录树"
          explanation="一份可部署合约由五类业务文件组成，整棵目录的内容根就是合约版本。"
        >
          <FormulaToken hint="agenticContract">C<sub>A</sub></FormulaToken>{' '}
          <FormulaOperator hint="definition">≡</FormulaOperator>{' '}
          <FormulaToken hint="contractTree">Tree</FormulaToken>({' '}
          <FormulaToken hint="definitionFile">M</FormulaToken>,{' '}
          <FormulaToken hint="schemaFiles">S</FormulaToken>,{' '}
          <FormulaToken hint="worker">W<sub>box</sub></FormulaToken>,{' '}
          <FormulaToken hint="validator">V<sub>box</sub></FormulaToken>,{' '}
          <FormulaToken hint="finality">F</FormulaToken>)
        </Equation>
        <div className="contract-part-grid" aria-label="Agentic Contract 五元组">
          {contractParts.map(([hint, code, title, detail], index) => (
            <div className="contract-part" key={code}>
              <article>
                <FormulaToken hint={hint}><b>{code}</b></FormulaToken>
                <strong>{title}</strong>
                <small>{detail}</small>
              </article>
              {index < contractParts.length - 1 ? <i aria-hidden="true">→</i> : null}
            </div>
          ))}
        </div>
        <div className="contract-call">
          <span><Icon name="terminal" /><small>CONTRACT TREE</small><strong><FormulaToken hint="contractTree">业务目录根</FormulaToken></strong></span>
          <i>→</i>
          <span className="is-contract"><Icon name="bolt" /><small>A3S-BOX / WORKER</small><strong><FormulaToken hint="runBox">执行任务</FormulaToken></strong></span>
          <i>→</i>
          <span className="is-contract"><Icon name="shield" /><small>A3S-BOX / VALIDATOR</small><strong><FormulaToken hint="verifyBox">独立验收</FormulaToken></strong></span>
          <i>→</i>
          <span><Icon name="receipt" /><small>ON-CHAIN TRACE</small><strong><FormulaToken hint="trace">回执 + 状态根</FormulaToken></strong></span>
        </div>
      </div>
      <footer className="formal-note">
        <span>CONTRACT ROOT</span>
        <strong>
          <FormulaToken hint="contractTree">root(C<sub>A</sub>)</FormulaToken> ={' '}
          <FormulaToken hint="hash">H<sub>tree</sub></FormulaToken>({' '}
          <FormulaToken hint="definitionFile">M</FormulaToken>{' '}
          <FormulaOperator hint="treeConcatenate">∥</FormulaOperator>{' '}
          <FormulaToken hint="schemaFiles">S</FormulaToken>{' '}
          <FormulaOperator hint="treeConcatenate">∥</FormulaOperator>{' '}
          <FormulaToken hint="worker">W</FormulaToken>{' '}
          <FormulaOperator hint="treeConcatenate">∥</FormulaOperator>{' '}
          <FormulaToken hint="validator">V</FormulaToken>{' '}
          <FormulaOperator hint="treeConcatenate">∥</FormulaOperator>{' '}
          <FormulaToken hint="finality">F</FormulaToken>)
        </strong>
      </footer>
    </div>
  );
}

const receiptWorkers: Array<[string, string, IconName, HintKey]> = [
  ['INPUT', '任务输入', 'fingerprint', 'taskTreeRoot'],
  ['OUTPUT', '结果与证据', 'bolt', 'outputCommitment'],
  ['VERDICT', '独立裁决', 'shield', 'taskTreeRoot'],
];

const receiptFields: Array<[string, HintKey]> = [
  ['taskId', 'taskId'],
  ['prevRoot', 'prevRoot'],
  ['taskTreeRoot', 'taskTreeRoot'],
  ['proof', 'proofField'],
];

export function ReceiptModelArchitecture() {
  return (
    <div className="diagram-panel formal-panel receipt-model-panel">
      <SpecChrome chapter="03 · RECEIPT TRANSITION" status="VERIFY BEFORE COMMIT" />
      <div className="formal-panel-body">
        <Equation
          number="ACVM.3"
          title="回执驱动的状态转换"
          explanation="先验证回执包中的任务文件根；只有签名、前序根和业务谓词都通过，才生成候选新状态。"
        >
          <FormulaToken hint="verifyReceipt">Verify</FormulaToken>(<FormulaToken hint="receiptBundle">ρ</FormulaToken>) = <FormulaToken hint="trueValue">1</FormulaToken>{' '}
          <br className="mobile-equation-break" />
          <FormulaOperator hint="implies">⇒</FormulaOperator>{' '}
          <FormulaToken hint="candidateState">Σ′</FormulaToken> ={' '}
          <FormulaToken hint="transition">Γ<sub>A</sub></FormulaToken>(<FormulaToken hint="worldState">Σ</FormulaToken>, <FormulaToken hint="intent">I</FormulaToken>, <FormulaToken hint="receiptBundle">ρ</FormulaToken>)
        </Equation>
        <div className="receipt-state-flow" aria-label="意图进入等待状态，外部执行返回回执后恢复链上状态">
          <article><span>01</span><Icon name="receipt" /><strong><FormulaToken hint="intent">提交意图</FormulaToken></strong><small>Intent I</small></article>
          <i>→</i>
          <article className="is-pending"><span>02</span><Icon name="pause" /><strong>等待任务文件</strong><small>Pending</small></article>
          <i>→</i>
          <div className="receipt-worker-stack">
            {receiptWorkers.map(([title, detail, icon, hint]) => (
              <span key={title}><Icon name={icon} /><b><FormulaToken hint={hint}>{title}</FormulaToken></b><small>{detail}</small></span>
            ))}
          </div>
          <i>→</i>
          <article className="is-receipt"><span>03</span><Icon name="shield" /><strong><FormulaToken hint="verifyReceipt">核验文件根</FormulaToken></strong><small>Receipt ρ</small></article>
          <i>→</i>
          <article><span>04</span><Icon name="chain" /><strong><FormulaToken hint="candidateState">提交状态</FormulaToken></strong><small>State Root</small></article>
        </div>
        <div className="receipt-fields">
          {receiptFields.map(([field, hint]) => <FormulaToken hint={hint} className="technical-detail-token" key={field}>{field}</FormulaToken>)}
        </div>
      </div>
      <footer className="formal-note">
        <span>REJECT RULE</span>
        <strong>
          <FormulaToken hint="verifyReceipt">Verify</FormulaToken>(<FormulaToken hint="receiptBundle">ρ</FormulaToken>) = <FormulaToken hint="falseValue">0</FormulaToken>{' '}
          <FormulaOperator hint="implies">⇒</FormulaOperator>{' '}
          <FormulaToken hint="candidateState">Σ′</FormulaToken> = <FormulaToken hint="worldState">Σ</FormulaToken>
        </strong>
      </footer>
    </div>
  );
}

const poiInputs: Array<[string, string, IconName, HintKey]> = [
  ['需求签名', 'Demand', 'fingerprint', 'signedDemand'],
  ['结果验收', 'Result', 'check', 'acceptedResult'],
  ['执行证明', 'Proof', 'shield', 'executionProof'],
  ['防重放', 'Nonce', 'key', 'antiReplay'],
];

export function IntelligenceChainArchitecture() {
  return (
    <div className="diagram-panel formal-panel intelligence-chain-panel">
      <SpecChrome chapter="04 · INTELLIGENCE-PROOF CHAIN" status="USEFUL WORK ONLY" />
      <div className="formal-panel-body">
        <Equation
          number="ACVM.4"
          title="有效智能证明条件"
          explanation="PoI 要求四项可独立核验的有效工作条件同时成立；它不评价模型的通用智能水平。"
        >
          <FormulaToken hint="poi">PoI</FormulaToken>{' '}
          <FormulaOperator hint="definition">≡</FormulaOperator>{' '}
          <FormulaToken hint="signedDemand">D<sub>sig</sub></FormulaToken>{' '}
          <FormulaOperator hint="conjunction">∧</FormulaOperator>{' '}
          <FormulaToken hint="acceptedResult">R<sub>ok</sub></FormulaToken>{' '}
          <br className="mobile-equation-break" />
          <FormulaOperator hint="conjunction">∧</FormulaOperator>{' '}
          <FormulaToken hint="executionProof">π<sub>exec</sub></FormulaToken>{' '}
          <FormulaOperator hint="conjunction">∧</FormulaOperator>{' '}
          <FormulaOperator hint="negation">¬</FormulaOperator><FormulaToken hint="antiReplay">Replay</FormulaToken>
        </Equation>
        <div className="poi-proof-row" aria-label="智能证明由需求、结果、执行证明和防重放记录共同组成">
          {poiInputs.map(([title, detail, icon, hint], index) => (
            <div className="poi-proof-part" key={title}>
              <article><Icon name={icon} /><strong><FormulaToken hint={hint}>{title}</FormulaToken></strong><small>{detail}</small></article>
              {index < poiInputs.length - 1 ? <i><FormulaOperator hint="conjunction">∧</FormulaOperator></i> : null}
            </div>
          ))}
        </div>
        <div className="poi-chain-flow">
          <section><small>VALID POI POOL</small><strong><FormulaToken hint="poi">有效工作池</FormulaToken></strong><span>机构 · 企业 · 个人</span></section>
          <i>→</i>
          <section><small><FormulaToken hint="bftVrf">BFT + VRF</FormulaToken></small><strong>提议与确认</strong><span>PoI 提供候选权重，BFT 完成确认</span></section>
          <i>→</i>
          <section className="is-block"><small>BLOCK N+1</small><strong>智能证明区块</strong><span><FormulaToken hint="stateRoot">stateRoot</FormulaToken> · <FormulaToken hint="poiRoot">poiRoot</FormulaToken></span></section>
        </div>
      </div>
      <footer className="formal-note"><span>DESIGN RULE</span><strong>无需求、无验收或无执行证据，不计入 PoI</strong></footer>
    </div>
  );
}
