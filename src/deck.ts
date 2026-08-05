export const screens = [
  ['top', 'ACVM'],
  ['product-snapshot', 'ACVM 把结果验收变成付款条件'],
  ['poi-proof', 'PoI 是结果验收后的结算凭证'],
  ['geo-verification', 'GEO 结果验证即服务'],
  ['data-space', '多方数据按结果分账'],
  ['system-architecture', '一笔订单的五步闭环'],
  ['economy-roles', '结果池与验证成本分开'],
  ['security-boundaries', '真实订单与独立验证抑制作恶'],
  ['ans', 'ANS 可验证服务发现'],
  ['agentic-contract', '智能体合约状态机'],
  ['fog-inference', '雾节点本地执行'],
  ['execution-boundary', '模型链下执行'],
  ['deployment-modes', '适配既有基础设施'],
] as const;

export type ScreenId = (typeof screens)[number][0];

export const navigation = [
  {
    key: 'value',
    id: 'product-snapshot',
    label: '产品价值',
    shortLabel: '01 / PRODUCT',
    screens: ['product-snapshot', 'poi-proof'],
  },
  {
    key: 'fit',
    id: 'geo-verification',
    label: '推荐场景',
    shortLabel: '02 / USE CASE',
    screens: ['geo-verification', 'data-space'],
  },
  {
    key: 'mechanism',
    id: 'system-architecture',
    label: '一笔订单',
    shortLabel: '03 / WORKFLOW',
    screens: ['system-architecture'],
  },
  {
    key: 'risk',
    id: 'economy-roles',
    label: '结算与风控',
    shortLabel: '04 / RISK',
    screens: ['economy-roles', 'security-boundaries'],
  },
  {
    key: 'appendix',
    id: 'ans',
    label: '技术附录',
    shortLabel: '05 / APPENDIX',
    screens: ['ans', 'agentic-contract', 'fog-inference', 'execution-boundary', 'deployment-modes'],
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
