export const screens = [
  ['top', '课程地图'],
  ['btc-ledger', '比特币账本'],
  ['btc-transaction', 'UTXO 交易'],
  ['btc-pow', '区块与 PoW'],
  ['btc-consensus', '分叉与确认'],
  ['consensus-anatomy', '共识的五个环节'],
  ['consensus-pos', 'PoS 与 Gasper'],
  ['consensus-bft', 'BFT 与 HotStuff'],
  ['consensus-governance', 'PoA、DPoS 与 PoI'],
  ['eth-state', '全局状态'],
  ['eth-evm', 'EVM 合约'],
  ['eth-transaction', 'Gas 与调用'],
  ['eth-boundary', '确定性边界'],
  ['ai-gap', 'AI 上链难题'],
  ['acvm-execution-boundary', 'ACVM 执行边界'],
  ['ai-execution', '链下执行'],
  ['ai-verification', '结果验证'],
  ['agentic-bridge', '智能体合约'],
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
  ['simulation', '社会模拟'],
  ['chains', '链适配'],
  ['stories', '业务场景'],
] as const;

export const navigation = [
  { id: 'btc-ledger', label: '比特币', screens: ['btc-ledger', 'btc-transaction', 'btc-pow', 'btc-consensus'] },
  { id: 'consensus-anatomy', label: '共识机制', screens: ['consensus-anatomy', 'consensus-pos', 'consensus-bft', 'consensus-governance'] },
  { id: 'eth-state', label: '以太坊', screens: ['eth-state', 'eth-evm', 'eth-transaction', 'eth-boundary'] },
  { id: 'ai-gap', label: 'AI × 区块链', screens: ['ai-gap', 'acvm-execution-boundary', 'ai-execution', 'ai-verification', 'agentic-bridge'] },
  { id: 'spec-contract', label: 'ACVM 合约', screens: ['spec-contract', 'code-walkthrough', 'lifecycle', 'runtime', 'onchain'] },
  { id: 'spec-state', label: '状态验证', screens: ['spec-state', 'spec-receipt', 'dispute', 'properties'] },
  { id: 'identity', label: '身份与证明', screens: ['identity', 'offchain', 'privacy', 'fog', 'sentry', 'proof', 'intelligence', 'spec-poi'] },
  { id: 'ans', label: '智能体网络', screens: ['ans', 'composition', 'simulation', 'chains', 'stories'] },
] as const;

export function screenIndex(id: string) {
  const index = screens.findIndex(([screenId]) => screenId === id);
  if (index < 0) throw new Error(`Unknown course screen: ${id}`);
  return index;
}
