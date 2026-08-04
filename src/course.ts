export const screens = [
  ['top', '课程地图'],
  ['acvm-use-cases', '付费条件变化'],
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
  ['economy-roles', '参与方与收益'],
  ['economy-waterfall', '预算与分账'],
  ['economy-incentives', '保证金与激励'],
  ['ans', '智能体解析'],
  ['composition', '多 Agent 协作'],
  ['chains', '链适配'],
  ['stories', '结果付费网络'],
  ['conclusion', '结果结算边界'],
] as const;

export type ScreenId = (typeof screens)[number][0];

export const navigation = [
  {
    key: 'usecase', id: 'acvm-use-cases', label: '第一章·付费问题', shortLabel: 'CHAPTER 01 / PAYMENT', act: '第一章',
    question: '客户买的是一次调用，还是一个达到标准的结果？',
    screens: ['acvm-use-cases', 'geo-verification', 'simulation'],
  },
  {
    key: 'blockchain', id: 'btc-ledger', label: '第二章·可信状态', shortLabel: 'CHAPTER 02 / TRUSTED STATE', act: '第二章',
    question: '付款条件怎样变成各方不能单独改写的共同事实？',
    screens: [
      'btc-ledger', 'btc-transaction', 'btc-pow', 'btc-consensus',
      'consensus-anatomy', 'consensus-pos', 'consensus-bft', 'consensus-governance',
      'eth-state', 'eth-evm', 'eth-transaction', 'eth-boundary',
    ],
  },
  {
    key: 'gap', id: 'ai-gap', label: '第三章·验证转折', shortLabel: 'CHAPTER 03 / VERIFICATION', act: '第三章',
    question: 'AI 工作不能全网重放，结果凭什么被判定为完成？',
    screens: ['ai-gap', 'acvm-execution-boundary', 'ai-execution', 'ai-verification', 'agentic-bridge', 'trust-infrastructure', 'semantic-correctness'],
  },
  {
    key: 'protocol', id: 'spec-contract', label: '第四章·结果协议', shortLabel: 'CHAPTER 04 / PROTOCOL', act: '第四章',
    question: '怎样把付费结果、验收规则、争议和结算写成协议？',
    screens: [
      'spec-contract', 'code-walkthrough', 'lifecycle', 'runtime', 'onchain',
      'spec-state', 'spec-receipt', 'dispute', 'properties',
    ],
  },
  {
    key: 'evidence', id: 'identity', label: '第五章·证据系统', shortLabel: 'CHAPTER 05 / EVIDENCE', act: '第五章',
    question: '哪些链下证据足以证明结果满足了付费条件？',
    screens: ['identity', 'offchain', 'privacy', 'fog', 'sentry', 'proof', 'intelligence', 'spec-poi'],
  },
  {
    key: 'economy', id: 'economy-roles', label: '第六章·经济模型', shortLabel: 'CHAPTER 06 / ECONOMICS', act: '第六章',
    question: '每个参与方提供什么、获得什么，作弊又会失去什么？',
    screens: ['economy-roles', 'economy-waterfall', 'economy-incentives'],
  },
  {
    key: 'network', id: 'ans', label: '第七章·协作结算', shortLabel: 'CHAPTER 07 / NETWORK', act: '第七章',
    question: '多个 Agent 协作时，结果、预算和付款责任怎样传递？',
    screens: ['ans', 'composition', 'chains', 'stories'],
  },
  {
    key: 'closing', id: 'conclusion', label: '结语', shortLabel: 'EPILOGUE / OUTCOME', act: '结语',
    question: '满足哪些条件后，一个 AI 结果才有资格触发付款？',
    screens: ['conclusion'],
  },
] as const;

export const coverChapter = {
  key: 'cover',
  id: 'top',
  label: '课程封面',
  shortLabel: 'ACVM DECK',
  act: '主线',
  question: '怎样把 AI 服务从按调用量付费，推进到按已验证结果付费？',
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
