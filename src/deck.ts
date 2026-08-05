export const screens = [
  ['top', 'ACVM'],
  ['useful-work', '传统区块链缺少链外价值'],
  ['product-snapshot', 'ACVM 把结果验收变成付款条件'],
  ['poi-proof', 'PoI 是结果验收后的结算凭证'],
  ['geo-verification', 'GEO 结果验证即服务'],
  ['data-space', '多方数据按结果分账'],
  ['simulation', '社会模拟即服务'],
  ['poi-consensus', 'ACVM 核心算法公式'],
  ['system-architecture', '一笔订单的五步闭环'],
  ['economy-roles', '结果池与验证成本分开'],
  ['security-boundaries', '真实订单与独立验证抑制作恶'],
  ['ans', 'ANS 可验证服务发现'],
  ['agentic-contract', '智能体合约状态机'],
  ['fog-inference', '雾节点本地执行'],
  ['execution-boundary', '链下 Agentic Contract 可信闭环'],
  ['a3s-box', 'a3s-box 隔离执行能力'],
  ['a3s-power', 'a3s-power 隐私计算与参数流式推理'],
  ['deployment-modes', 'A3S 与国内区块链实现 ACVM'],
] as const;

export type ScreenId = (typeof screens)[number][0];

export const navigation = [
  {
    key: 'principles',
    id: 'useful-work',
    label: '传统区块链缺陷',
    shortLabel: '01 / WHY',
    screens: ['useful-work'],
  },
  {
    key: 'value',
    id: 'product-snapshot',
    label: 'ACVM 与 PoI',
    shortLabel: '02 / PRODUCT',
    screens: ['product-snapshot', 'poi-proof'],
  },
  {
    key: 'feasibility',
    id: 'geo-verification',
    label: '推荐场景',
    shortLabel: '03 / USE CASE',
    screens: ['geo-verification', 'data-space', 'simulation'],
  },
  {
    key: 'mechanism',
    id: 'poi-consensus',
    label: '算法与订单',
    shortLabel: '04 / MECHANISM',
    screens: ['poi-consensus', 'system-architecture'],
  },
  {
    key: 'economy',
    id: 'economy-roles',
    label: '结算与风控',
    shortLabel: '05 / RISK',
    screens: ['economy-roles', 'security-boundaries'],
  },
  {
    key: 'delivery',
    id: 'ans',
    label: '技术附录',
    shortLabel: '06 / APPENDIX',
    screens: ['ans', 'agentic-contract', 'fog-inference', 'execution-boundary', 'a3s-box', 'a3s-power', 'deployment-modes'],
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
