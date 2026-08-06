export const screens = [
  ['top', 'ACVM'],
  ['useful-work', '传统 PoW 算力不直接产出业务结果'],
  ['product-snapshot', 'ACVM 运行链上 Agentic Contract'],
  ['poi-proof', 'ValidPoI 证明 AI 任务真实完成'],
  ['native-chain', 'PoI Worker 为链上 ACVM 提供模型推理'],
  ['execution-boundary', '链下隐私计算，链上验证结果'],
  ['geo-verification', 'GEO 按 AI 引用提升效果付费'],
  ['ans', 'ANS 让用户找到可调用的智能体'],
  ['fog-inference', '雾计算按任务选择节点或专家组'],
  ['agent-rental', '一笔智能体服务从发布走到分账'],
  ['simulation', '多家机构共同完成可信社会模拟'],
  ['system-architecture', '订单终局决定分账、退款或处罚'],
  ['poi-consensus', 'ValidPoI 换成公平记账机会'],
  ['a3s-box', 'A3S 把加密智能体安全送入 TEE'],
  ['a3s-power', 'a3s-power 按层加载大模型'],
  ['deployment-modes', 'ACVM 支持原生链与国内链接入'],
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
    label: '原生链与可信执行',
    shortLabel: '03 / 可信执行',
    screens: ['native-chain', 'execution-boundary'],
  },
  {
    key: 'feasibility',
    id: 'geo-verification',
    label: '场景与服务网络',
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
    label: '实现与部署',
    shortLabel: '06 / 部署',
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
