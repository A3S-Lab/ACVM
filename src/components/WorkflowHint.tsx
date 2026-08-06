import type { ReactNode } from 'react';
import { DetailHint, type DetailRow } from './DetailHint';

const workflowNotes = {
  a3sCode: ['a3s-code · 智能体构建框架', '把智能体逻辑、依赖、运行策略和能力声明构建为可签名、可复现的发布包。', '构建产物只声明允许使用的能力，不把生产密钥或敏感数据写入镜像。'],
  a3sUse: ['a3s-use · 能力热插拔系统', '运行时按 capabilityRoot 拉取、验签并挂载远程模型、工具或数据连接器。', '每次任务只加载授权版本和最小权限令牌；能力可撤销或升级，不必重建智能体主体。'],
  AgentImage: ['AgentImage.enc · 加密智能体镜像', '包含智能体代码与固定依赖的加密镜像，宿主机和调度器无法读取明文。', '镜像密钥只在 TEE 远程证明通过后释放，并在可信内存中短暂使用。'],
  imageRoot: ['imageRoot · 智能体镜像承诺', '对加密智能体镜像及其版本元数据计算的内容根。', 'a3s-box 拉取的镜像必须与 ANS 服务卡和 ACVM 任务中的 imageRoot 一致。'],
  capabilityRoot: ['capabilityRoot · 能力清单承诺', '对能力名称、版本、提供方、权限范围和接口摘要计算的内容根。', 'a3s-use 远程加载的每项能力都必须出现在该清单中并通过签名与授权校验。'],
  FogLease: ['FogLease · 雾节点执行租约', '把选中节点、TEE 类型、资源、位置、时限和任务策略绑定为一次执行授权。', '租约只对当前 taskId 有效，远程证明或策略不匹配时不得下发镜像密钥。'],
  MoE: ['MoE · 混合专家模型', '路由器只为当前输入激活少量专家网络，不必让全部专家同时参与计算。', '跨节点专家并行依赖低时延链路；广域传输开销过大时应回退到同域专家组或单节点执行。'],
  ExpertGroupLease: ['ExpertGroupLease · 专家组执行租约', '把路由节点、Top-k 专家节点、TEE 证明、网络预算和超时规则绑定为一次分离式推理授权。', '每个专家回执都引用同一 taskId、routeRoot 和 modelRoot，缺少任一必需专家时不能形成完整结果。'],
  taskId: ['taskId · 唯一任务编号', '贯穿下单、执行、验收、结算和 PoI 计量的唯一编号。', '同一 taskId 的结果只能进入一次终局结算。'],
  taskKey: ['taskKey · 防重放键', '把任务、输出和 nonce 组合成唯一消费键。', '键已进入 Spent 集合时，结果不能再次结算或生成 PoI。'],
  ANS: ['ANS · 智能体名称服务', '用去中心化身份发布、发现和核验智能体服务。', '解析结果包含身份、能力、端点、价格、有效期和签名。'],
  DID: ['DID · 去中心化唯一身份', '不依赖单一平台账号的可验证身份标识。', '密钥可以轮换，已验证履历仍绑定同一责任主体。'],
  SignedServiceCard: ['SignedServiceCard · 签名服务卡', '由智能体所有者签名的服务声明。', '调用方先验签，再使用其中的能力、接口、价格和有效期。'],
  AcceptedResult: ['AcceptedResult · 已验收结果', '独立 Validator 按事前冻结的规则确认结果达标。', '只有 AcceptedResult 可以推进付款、分账和有效 PoI 计量。'],
  splitRoot: ['splitRoot · 分账承诺', '对贡献方名单、比例和顺序计算出的不可篡改承诺。', '结算时重新计算分账表，必须与订单中的 splitRoot 完全一致。'],
  ExecReceipt: ['ExecReceipt · 执行回执', '把任务、模型、输入输出承诺、环境和关键执行事件绑定在一起。', '它证明按约执行过，不单独证明业务结果一定达标。'],
  MicroVM: ['MicroVM · 轻量虚拟机', '为单项任务启动的独立内核与资源边界。', '网络、文件、工具、密钥和临时卷都按任务策略限制。'],
  WorkloadSpec: ['WorkloadSpec · 运行规格', '任务开始前锁定的镜像、资源、网络、存储和工具策略。', '启动、故障恢复和清理必须沿用同一版本。'],
  TEE: ['TEE · 可信执行环境', '由硬件保护的隔离内存，用于运行敏感模型、密钥和输入。', 'TEE 证明环境和代码版本，业务结果仍需独立验收。'],
  Attestation: ['Remote Attestation · 远程证明', '硬件对代码度量、平台状态和本次随机挑战签名。', '验证方通过厂商证书链和白名单确认环境没有被替换。'],
  MPC: ['MPC · 安全多方计算', '多方在不公开各自原始数据的前提下共同计算结果。', '跨机构只交换秘密份额或加密统计，不交换原始记录。'],
  VRF: ['VRF · 可验证随机函数', '产生事前不可预测、事后可验证的随机输出。', 'PoI 权重只影响抽中概率，任何人都能核验抽签证明。'],
  BFT: ['BFT · 拜占庭容错终局', '验证节点达到固定法定人数后确认同一状态。', 'PoI 负责候选权重，BFT 仍负责区块安全和不可逆终局。'],
  QC: ['QC · 法定人数证书', '达到阈值的 Validator 对同一结果或区块签名形成的聚合证明。', 'QC 证明足够多的有效成员同意同一命题。'],
  PoI: ['PoI · 智能证明', '把真实任务、可信执行、结果验收和防重放组合成可验证贡献。', '只有通过全部条件的记录才成为 ValidPoI。'],
  ValidPoI: ['ValidPoI · 有效智能证明', '真实需求、执行可信、结果达标和防重放同时成立的计算记录。', '用于结算、信誉和有界共识贡献，不等同于主观智能评分。'],
  ChainAdapter: ['ChainAdapter · 链语义适配器', '把 ACVM 的身份、事件、证明和终局语义映射到目标链。', '适配器不修改 ACVM 的业务验收规则。'],
  Driver: ['Driver · 目标链连接器', '调用具体区块链 SDK、提交交易并跟踪回执的实现。', '长安链、FISCO BCOS、星火链网或 BSN 各实现一个 Driver。'],
  modelRoot: ['modelRoot · 模型承诺', '对模型文件或参数版本计算出的内容根。', '执行回执中的模型版本必须与任务冻结的 modelRoot 一致。'],
  inputRoot: ['inputRoot · 输入承诺', '对本次任务完整输入计算出的内容根。', '链上只保存承诺，敏感原文可以留在机构本地。'],
  policyRoot: ['policyRoot · 策略承诺', '对权限、网络、工具和验收规则计算出的内容根。', '运行环境和 Validator 必须使用同一策略版本。'],
  AgenticContract: ['Agentic Contract · 智能体合约', '能暂停等待链下 AI 结果，并在验收后恢复执行的状态合约。', '区块继续生成，模型推理不会阻塞整个共识过程。'],
  GEO: ['GEO · 生成式引擎优化', '提升品牌或内容被生成式 AI 检索、引用和推荐的效果。', 'ACVM 按独立复测确认的引用增量结算，而不是按工作量结算。'],
} as const;

export type WorkflowTermKey = keyof typeof workflowNotes;

export function WorkflowTerm({ term, label }: { term: WorkflowTermKey; label?: ReactNode }) {
  const [title, summary, boundary] = workflowNotes[term];
  return (
    <DetailHint
      className="workflow-term"
      category="术语说明"
      label={label ?? term}
      title={title}
      summary={summary}
      details={[{ label: '使用边界', value: boundary }]}
    />
  );
}

export function WorkflowFormula({
  formula,
  title,
  summary,
  details = [],
}: {
  formula: ReactNode;
  title: string;
  summary: string;
  details?: readonly DetailRow[];
}) {
  return (
    <DetailHint
      className="workflow-formula"
      category="公式说明"
      label={<code>{formula}</code>}
      title={title}
      summary={summary}
      details={details}
    />
  );
}
