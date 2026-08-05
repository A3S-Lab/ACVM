export const screens = [
  ['top', 'ACVM'],
  ['useful-work', '传统 PoW 算力没有直接服务业务'],
  ['product-snapshot', 'ACVM 先验收结果，再付款'],
  ['poi-proof', 'PoI 证明 AI 任务真实完成'],
  ['execution-boundary', '链下 AI 结果通过两道验证'],
  ['geo-verification', 'GEO 按引用提升效果付费'],
  ['fog-inference', '雾计算让数据留在本地'],
  ['ans', 'ANS 找到可信智能体服务'],
  ['agent-rental', '智能体按完成效果收费'],
  ['simulation', '多家机构共同完成社会模拟'],
  ['poi-consensus', '有效贡献换成记账机会'],
  ['system-architecture', '订单的付款、退款和处罚'],
  ['a3s-box', 'a3s-box 独立运行空间'],
  ['a3s-power', 'a3s-power 小内存隐私推理'],
  ['deployment-modes', 'ACVM 接入国内区块链'],
  ['native-chain', 'Rust 原生链接入 AI 推理'],
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
