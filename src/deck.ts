export const screens = [
  ['top', 'ACVM'],
  ['useful-work', '传统 PoW 算力不直接产出业务结果'],
  ['product-snapshot', 'ACVM 运行链上 Agentic Contract'],
  ['poi-proof', 'PoI 证明 AI 任务真实完成'],
  ['native-chain', 'PoI 为链上 ACVM 提供模型推理'],
  ['execution-boundary', '链下 AI 结果经过两道验证'],
  ['geo-verification', 'GEO 按 AI 引用提升效果付费'],
  ['ans', 'ANS 让用户找到可调用的智能体'],
  ['fog-inference', '雾计算按任务选择节点或专家组'],
  ['agent-rental', '企业把智能体发布为可调用服务'],
  ['simulation', '多家机构共同完成可信社会模拟'],
  ['system-architecture', '订单终局决定分账、退款或处罚'],
  ['poi-consensus', '有效贡献换成公平记账机会'],
  ['a3s-box', 'A3S 把加密智能体安全送入 TEE'],
  ['a3s-power', 'a3s-power 按层加载大模型'],
  ['deployment-modes', 'ACVM 接入现有国内区块链'],
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
    label: 'ACVM Runtime 与 PoI',
    shortLabel: '02 / 产品',
    screens: ['product-snapshot', 'poi-proof'],
  },
  {
    key: 'native',
    id: 'native-chain',
    label: '原生 ACVM 链',
    shortLabel: '03 / 原生链',
    screens: ['native-chain', 'execution-boundary'],
  },
  {
    key: 'feasibility',
    id: 'geo-verification',
    label: '服务网络与场景',
    shortLabel: '04 / 场景',
    screens: ['geo-verification', 'ans', 'fog-inference', 'agent-rental', 'simulation'],
  },
  {
    key: 'mechanism',
    id: 'system-architecture',
    label: '结算与共识',
    shortLabel: '05 / 结算',
    screens: ['system-architecture', 'poi-consensus'],
  },
  {
    key: 'delivery',
    id: 'a3s-box',
    label: '技术附录',
    shortLabel: '06 / 实现',
    screens: ['a3s-box', 'a3s-power', 'deployment-modes'],
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
