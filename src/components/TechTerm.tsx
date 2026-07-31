import { DetailHint } from './DetailHint';

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
  'Intent-centric': {
    summary: '用户声明目标、约束和验收条件，系统负责选择具体执行路径。',
    mechanism: '签名意图先经过权限与策略检查，再由 Worker 执行、Validator 验收，最终以回执证明没有越过约束。',
    boundary: '没有写进意图的约束就无法自动保护；预算、时限、数据范围和失败处理必须明确。',
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
        { label: '怎么工作', value: note.mechanism },
        { label: '注意边界', value: note.boundary },
      ]}
    />
  );
}
