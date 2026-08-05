export const screens = [
  ['top', 'ACVM'],
  ['product-thesis', 'ACVM 改变什么'],
  ['product-snapshot', '为什么不按调用量结算'],
  ['geo-verification', 'GEO 结果验证即服务'],
  ['simulation', '社会模拟即服务'],
  ['geo-poi-boundary', 'GEO 一定要用 PoI 吗'],
  ['useful-work', '其他 AI 网络在证明什么'],
  ['execution-boundary', '为什么模型不能链上重跑'],
  ['system-architecture', 'AP2、A3S 与 ACVM 如何协作'],
  ['ans', '调用方如何找到可信 Agent'],
  ['agentic-contract', '谁来管理任务与责任'],
  ['fog-inference', '数据不出域如何完成推理'],
  ['verification-engine', '开放式结果如何验收'],
  ['poi-proof', '什么样的推理才算贡献'],
  ['poi-consensus', 'PoI 如何影响记账权'],
  ['economy-roles', '一笔预算如何分配'],
  ['deployment-modes', '如何接入现有区块链基础设施'],
  ['security-boundaries', '刷单与串谋如何控制'],
  ['product-roadmap', '下一步交付什么'],
] as const;

export type ScreenId = (typeof screens)[number][0];

export const navigation = [
  {
    key: 'value',
    id: 'product-thesis',
    label: '产品与场景',
    shortLabel: '01 / PRODUCT',
    question: 'ACVM 改变什么，又如何在 GEO 和社会模拟中按结果结算？',
    screens: ['product-thesis', 'product-snapshot', 'geo-verification', 'simulation'],
  },
  {
    key: 'principles',
    id: 'geo-poi-boundary',
    label: 'PoI 与边界',
    shortLabel: '02 / WHY',
    question: 'PoI 为什么是 ACVM 的核心，现有工程又留下了什么缺口？',
    screens: ['geo-poi-boundary', 'useful-work', 'execution-boundary'],
  },
  {
    key: 'mechanism',
    id: 'system-architecture',
    label: '一笔订单',
    shortLabel: '03 / WORKFLOW',
    question: 'AP2、A3S 与 ACVM 怎样把一笔订单推进到验收和付款？',
    screens: ['system-architecture', 'ans', 'agentic-contract', 'fog-inference', 'verification-engine', 'poi-proof', 'poi-consensus'],
  },
  {
    key: 'economy',
    id: 'economy-roles',
    label: '钱与责任',
    shortLabel: '04 / ECONOMICS',
    question: '谁出钱、谁分钱，正常失败和造假分别怎么处理？',
    screens: ['economy-roles'],
  },
  {
    key: 'feasibility',
    id: 'deployment-modes',
    label: '部署与安全',
    shortLabel: '05 / FEASIBILITY',
    question: '产品如何接入国家级、产业级或开放区块链基础设施，又怎样控制作弊？',
    screens: ['deployment-modes', 'security-boundaries'],
  },
  {
    key: 'delivery',
    id: 'product-roadmap',
    label: '试点',
    shortLabel: '06 / DELIVERY',
    question: '现在做到哪一步，下一项可验证交付是什么？',
    screens: ['product-roadmap'],
  },
] as const;

export const coverChapter = {
  key: 'cover',
  id: 'top',
  label: '产品封面',
  shortLabel: 'ACVM / PRODUCT',
  question: 'ACVM 用一句话怎么说清楚？',
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
