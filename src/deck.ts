export const screens = [
  ['top', 'ACVM'],
  ['useful-work', '传统区块链缺少链外价值'],
  ['product-snapshot', 'ACVM 把结果验收变成付款条件'],
  ['poi-proof', 'PoI 是结果验收后的结算凭证'],
  ['execution-boundary', '可信链下执行闭环'],
  ['geo-verification', 'GEO 结果验证即服务'],
  ['fog-inference', '雾计算本地可信执行'],
  ['ans', 'ANS 可验证服务发现'],
  ['agent-rental', '智能体按结果提供服务'],
  ['simulation', '社会模拟即服务'],
  ['poi-consensus', 'ACVM 核心算法公式'],
  ['system-architecture', '订单验收、结算与风控闭环'],
  ['a3s-box', 'a3s-box 隔离执行能力'],
  ['a3s-power', 'a3s-power 隐私计算与参数流式推理'],
  ['deployment-modes', 'ChainAdapter 将 ACVM 接入国内区块链'],
  ['native-chain', 'Rust 原生链的 PoI 推理服务'],
] as const;

export type ScreenId = (typeof screens)[number][0];

export const navigation = [
  {
    key: 'principles',
    id: 'useful-work',
    label: '传统区块链缺陷',
    shortLabel: '01 / 缺陷',
    screens: ['useful-work'],
  },
  {
    key: 'value',
    id: 'product-snapshot',
    label: 'ACVM 与 PoI',
    shortLabel: '02 / 产品',
    screens: ['product-snapshot', 'poi-proof', 'execution-boundary'],
  },
  {
    key: 'feasibility',
    id: 'geo-verification',
    label: '服务网络与场景',
    shortLabel: '03 / 场景',
    screens: ['geo-verification', 'fog-inference', 'ans', 'agent-rental', 'simulation'],
  },
  {
    key: 'mechanism',
    id: 'poi-consensus',
    label: '算法与结算',
    shortLabel: '04 / 算法',
    screens: ['poi-consensus', 'system-architecture'],
  },
  {
    key: 'delivery',
    id: 'a3s-box',
    label: '技术附录',
    shortLabel: '05 / 实现',
    screens: ['a3s-box', 'a3s-power', 'deployment-modes'],
  },
  {
    key: 'native',
    id: 'native-chain',
    label: 'ACVM 原生链',
    shortLabel: '06 / 原生链',
    screens: ['native-chain'],
  },
] as const;

export const coverChapter = {
  key: 'cover',
  id: 'top',
  label: '产品封面',
  shortLabel: 'ACVM / PRODUCT',
  screens: ['top'],
} as const;

export function chapterForScreen(id: string) {
  return navigation.find((section) => section.screens.some((screen) => screen === id)) ?? coverChapter;
}

export function screenIndex(id: string) {
  const index = screens.findIndex(([screenId]) => screenId === id);
  if (index < 0) throw new Error(`Unknown product deck screen: ${id}`);
  return index;
}
