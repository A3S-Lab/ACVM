export const screens = [
  ['top', 'ACVM'],
  ['product-snapshot', '结果验收成为付款条件'],
  ['product-thesis', 'ACVM 负责结果裁决'],
  ['geo-poi-boundary', '跨组织结果协作使用 ACVM'],
  ['geo-verification', 'GEO 结果验证即服务'],
  ['data-space', '多方数据按结果分账'],
  ['system-architecture', '一笔订单的五步闭环'],
  ['verification-engine', '技术证明与业务证据并用'],
  ['economy-roles', '结果池与验证成本分开'],
  ['security-boundaries', '真实订单与独立验证抑制作恶'],
  ['product-roadmap', '当前交付：规范与演示'],
  ['simulation', '隐私数据留在本地'],
  ['useful-work', 'AI 网络验证命题'],
  ['execution-boundary', '模型链下执行'],
  ['ans', 'ANS 服务发现'],
  ['agentic-contract', '智能体合约状态机'],
  ['fog-inference', '雾节点本地推理'],
  ['poi-proof', 'PoI 有效条件'],
  ['poi-consensus', 'PoI 加权与法定人数终局'],
  ['deployment-modes', '适配既有基础设施'],
] as const;

export type ScreenId = (typeof screens)[number][0];

export const navigation = [
  {
    key: 'value',
    id: 'product-snapshot',
    label: '产品价值',
    shortLabel: '01 / PRODUCT',
    screens: ['product-snapshot', 'product-thesis'],
  },
  {
    key: 'fit',
    id: 'geo-poi-boundary',
    label: '推荐场景',
    shortLabel: '02 / USE CASE',
    screens: ['geo-poi-boundary', 'geo-verification', 'data-space'],
  },
  {
    key: 'mechanism',
    id: 'system-architecture',
    label: '一笔订单',
    shortLabel: '03 / WORKFLOW',
    screens: ['system-architecture', 'verification-engine'],
  },
  {
    key: 'risk',
    id: 'economy-roles',
    label: '结算与风控',
    shortLabel: '04 / RISK',
    screens: ['economy-roles', 'security-boundaries'],
  },
  {
    key: 'delivery',
    id: 'product-roadmap',
    label: '交付状态',
    shortLabel: '05 / DELIVERY',
    screens: ['product-roadmap'],
  },
  {
    key: 'appendix',
    id: 'simulation',
    label: '技术附录',
    shortLabel: '06 / APPENDIX',
    screens: ['simulation', 'useful-work', 'execution-boundary', 'ans', 'agentic-contract', 'fog-inference', 'poi-proof', 'poi-consensus', 'deployment-modes'],
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
