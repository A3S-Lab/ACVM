export const screens = [
  ['top', '课程地图'],
  ['acvm-use-cases', '两个案件'],
  ['geo-verification', 'GEO 结果验证'],
  ['simulation', '社会模拟服务'],
  ['btc-ledger', '双花与共享历史'],
  ['btc-transaction', 'UTXO 状态转换'],
  ['btc-pow', 'PoW 区块提议'],
  ['btc-consensus', '概率终局'],
  ['consensus-anatomy', '共识的五个环节'],
  ['consensus-pos', 'PoS 与 Gasper'],
  ['consensus-bft', 'BFT 与 HotStuff'],
  ['consensus-governance', 'PoA、DPoS 与 PoI'],
  ['eth-state', '账户与全局状态'],
  ['eth-evm', '确定性合约 VM'],
  ['eth-transaction', 'Gas 与交易生命周期'],
  ['eth-boundary', '预言机边界'],
  ['ai-gap', 'AI 上链难题'],
  ['acvm-execution-boundary', 'ACVM 执行边界'],
  ['ai-execution', '链下执行'],
  ['ai-verification', '结果验证'],
  ['agentic-bridge', '智能体合约'],
  ['trust-infrastructure', '五层信任框架'],
  ['semantic-correctness', '任务语义验证'],
  ['spec-contract', '合约模型'],
  ['code-walkthrough', '代码示例'],
  ['lifecycle', '完整生命周期'],
  ['runtime', '执行流程'],
  ['onchain', '链上执行'],
  ['spec-state', '状态模型'],
  ['spec-receipt', '回执转换'],
  ['dispute', '争议与终局'],
  ['properties', '系统性质'],
  ['identity', '身份与权限'],
  ['offchain', '链下核验'],
  ['privacy', '隐私环境'],
  ['fog', '雾推理网络'],
  ['sentry', '风险控制'],
  ['proof', '长任务证明'],
  ['intelligence', '有效计算'],
  ['spec-poi', '智能证明链'],
  ['ans', '智能体解析'],
  ['composition', '多 Agent 协作'],
  ['chains', '链适配'],
  ['stories', '业务场景'],
  ['conclusion', '核心结论'],
] as const;

export type ScreenId = (typeof screens)[number][0];

export const navigation = [
  {
    key: 'usecase', id: 'acvm-use-cases', label: '第一章·场景', shortLabel: 'CHAPTER 01 / CASES', act: '第一章',
    question: 'Agent 说“做完了”，凭什么付款？',
    screens: ['acvm-use-cases', 'geo-verification', 'simulation'],
  },
  {
    key: 'blockchain', id: 'btc-ledger', label: '第二章·区块底座', shortLabel: 'CHAPTER 02 / BLOCKCHAIN', act: '第二章',
    question: '记录怎样变成可验证、可重放、可终局的共享状态？',
    screens: [
      'btc-ledger', 'btc-transaction', 'btc-pow', 'btc-consensus',
      'consensus-anatomy', 'consensus-pos', 'consensus-bft', 'consensus-governance',
      'eth-state', 'eth-evm', 'eth-transaction', 'eth-boundary',
    ],
  },
  {
    key: 'gap', id: 'ai-gap', label: '第三章·AI 转折', shortLabel: 'CHAPTER 03 / AI GAP', act: '第三章',
    question: 'AI 工作无法全网重放，结果还能怎样进入共识？',
    screens: ['ai-gap', 'acvm-execution-boundary', 'ai-execution', 'ai-verification', 'agentic-bridge', 'trust-infrastructure', 'semantic-correctness'],
  },
  {
    key: 'protocol', id: 'spec-contract', label: '第四章·任务协议', shortLabel: 'CHAPTER 04 / PROTOCOL', act: '第四章',
    question: '怎样冻结任务规则，并让有效证据推动状态和结算？',
    screens: [
      'spec-contract', 'code-walkthrough', 'lifecycle', 'runtime', 'onchain',
      'spec-state', 'spec-receipt', 'dispute', 'properties',
    ],
  },
  {
    key: 'evidence', id: 'identity', label: '第五章·证据工程', shortLabel: 'CHAPTER 05 / EVIDENCE', act: '第五章',
    question: '链下身份、数据和执行如何变成可核验证据？',
    screens: ['identity', 'offchain', 'privacy', 'fog', 'sentry', 'proof', 'intelligence', 'spec-poi'],
  },
  {
    key: 'network', id: 'ans', label: '第六章·协作结算', shortLabel: 'CHAPTER 06 / NETWORK', act: '第六章',
    question: '多个 Agent 如何传递权限、预算和责任？',
    screens: ['ans', 'composition', 'chains', 'stories'],
  },
  {
    key: 'closing', id: 'conclusion', label: '结语', shortLabel: 'EPILOGUE / BOUNDARY', act: '结语',
    question: 'ACVM 最终证明了什么，又没有证明什么？',
    screens: ['conclusion'],
  },
] as const;

export const coverChapter = {
  key: 'cover',
  id: 'top',
  label: '课程封面',
  shortLabel: 'ACVM DECK',
  act: '主线',
  question: 'AI 完成链外工作后，凭什么改变共享状态并获得付款？',
  screens: ['top'],
} as const;

export function chapterForScreen(id: string) {
  return navigation.find((chapter) => chapter.screens.some((screen) => screen === id)) ?? coverChapter;
}

export function screenIndex(id: string) {
  const index = screens.findIndex(([screenId]) => screenId === id);
  if (index < 0) throw new Error(`Unknown course screen: ${id}`);
  return index;
}
