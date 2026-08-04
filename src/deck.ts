export const screens = [
  ['top', 'ACVM 产品定位'],
  ['product-snapshot', '为什么不按调用量结算'],
  ['geo-verification', 'GEO 结果验证即服务'],
  ['simulation', '社会模拟即服务'],
  ['useful-work', '共识一定要烧哈希吗'],
  ['execution-boundary', '为什么模型不能链上重跑'],
  ['system-architecture', '一单 AI 服务如何跑完'],
  ['ans', '调用方如何找到可信 Agent'],
  ['agentic-contract', '谁来管理任务与责任'],
  ['fog-inference', '数据不出域如何完成推理'],
  ['verification-engine', '开放式结果如何验收'],
  ['poi-proof', '什么样的推理才算贡献'],
  ['poi-consensus', 'PoI 如何影响记账权'],
  ['deployment-modes', '是否必须先建一条新链'],
  ['security-boundaries', '刷单与串谋如何控制'],
  ['economy-roles', '一笔预算如何分配'],
  ['product-roadmap', '下一步交付什么'],
] as const;

export type ScreenId = (typeof screens)[number][0];

export const navigation = [
  {
    key: 'value',
    id: 'product-snapshot',
    label: '产品场景',
    shortLabel: '01 / PRODUCT',
    question: '客户为什么要从按调用量付费改成按结果付费？',
    bridge: '先看付款条件，再看 GEO 和社会模拟两笔具体业务。',
    screens: ['product-snapshot', 'geo-verification', 'simulation'],
  },
  {
    key: 'principles',
    id: 'useful-work',
    label: '为什么需要',
    shortLabel: '02 / WHY',
    question: '为什么现有的工作证明和链上执行方式接不住 AI 服务？',
    bridge: '业务已经看得见，接着解释为什么要换工作来源和执行方式。',
    screens: ['useful-work', 'execution-boundary'],
  },
  {
    key: 'mechanism',
    id: 'system-architecture',
    label: '任务怎么跑',
    shortLabel: '03 / WORKFLOW',
    question: '一笔真实 AI 订单怎样从找服务走到执行、验收、付款和记账？',
    bridge: '沿着同一个 taskId 看：每个模块只解决订单中的一个问题。',
    screens: ['system-architecture', 'ans', 'agentic-contract', 'fog-inference', 'verification-engine', 'poi-proof', 'poi-consensus'],
  },
  {
    key: 'feasibility',
    id: 'deployment-modes',
    label: '部署与安全',
    shortLabel: '04 / FEASIBILITY',
    question: '产品如何接入现有链，又怎样把最现实的作弊风险关进边界？',
    bridge: '订单已经跑通，接着回答上线前的两个问题：怎么接、怎么防。',
    screens: ['deployment-modes', 'security-boundaries'],
  },
  {
    key: 'economy',
    id: 'economy-roles',
    label: '钱与责任',
    shortLabel: '05 / ECONOMICS',
    question: '谁出钱、谁分钱，正常失败和造假分别怎么处理？',
    bridge: '把一笔预算拆开看，角色、收益和风险就不会混在一起。',
    screens: ['economy-roles'],
  },
  {
    key: 'delivery',
    id: 'product-roadmap',
    label: '试点',
    shortLabel: '06 / DELIVERY',
    question: '现在做到哪一步，下一项可验证交付是什么？',
    bridge: '最后不讲远景，只讲当前状态和下一笔真实任务。',
    screens: ['product-roadmap'],
  },
] as const;

export const coverChapter = {
  key: 'cover',
  id: 'top',
  label: '产品封面',
  shortLabel: 'ACVM / PRODUCT',
  question: '怎样让客户只为已验证结果付费，同时让这份推理成为网络有效工作？',
  bridge: '先看一笔真实 AI 订单为什么值得付钱。',
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
