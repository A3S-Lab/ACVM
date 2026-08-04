export const screens = [
  ['top', 'ACVM 产品定位'],
  ['product-snapshot', '一页看懂 ACVM'],
  ['geo-verification', 'GEO 结果验证即服务'],
  ['simulation', '社会模拟即服务'],
  ['useful-work', '为什么要替换哈希工作量'],
  ['execution-boundary', '为什么智能体需要新虚拟机'],
  ['system-architecture', 'ACVM 双引擎架构'],
  ['poi-proof', '模型推理如何生成 PoI'],
  ['poi-consensus', 'PoI 如何影响记账权'],
  ['agentic-evolution', '从智能合约到智能体合约'],
  ['agentic-contract', 'Agentic Contract 由什么组成'],
  ['task-lifecycle', '一笔任务如何完成闭环'],
  ['verification-engine', '结果如何验证'],
  ['private-evidence', '隐私证据如何进入协议'],
  ['deployment-modes', '如何接入现有区块链'],
  ['security-boundaries', '五类攻击怎样控制'],
  ['economy-roles', '参与方各得什么'],
  ['useful-compute-economy', '两条价值流如何分配'],
  ['product-roadmap', '从概念到真实试点'],
  ['pilot-cta', '如何启动一个试点'],
] as const;

export type ScreenId = (typeof screens)[number][0];

export const navigation = [
  {
    key: 'value',
    id: 'product-snapshot',
    label: '产品与场景',
    shortLabel: '01 / PRODUCT',
    question: 'ACVM 替换了什么，又先为谁创造价值？',
    bridge: '先用一张产品图和两个真实场景，把 ACVM 的价值说清楚。',
    screens: ['product-snapshot', 'geo-verification', 'simulation'],
  },
  {
    key: 'principles',
    id: 'useful-work',
    label: '第一性原理',
    shortLabel: '02 / WHY',
    question: '现有共识工作与现有虚拟机，为什么都不适合 AI 服务网络？',
    bridge: '场景已经成立；现在回到共识与执行各自真正要解决的问题。',
    screens: ['useful-work', 'execution-boundary'],
  },
  {
    key: 'mechanism',
    id: 'system-architecture',
    label: '核心机制',
    shortLabel: '03 / MECHANISM',
    question: 'PoI 与 Agentic Contract 怎样组成一套可运行系统？',
    bridge: '两个结构性问题明确后，把替换方案接成完整产品架构。',
    screens: ['system-architecture', 'poi-proof', 'poi-consensus', 'agentic-evolution', 'agentic-contract', 'task-lifecycle'],
  },
  {
    key: 'feasibility',
    id: 'verification-engine',
    label: '技术可行性',
    shortLabel: '04 / FEASIBILITY',
    question: '模型结果不能全网重跑时，系统如何验证、保护隐私并控制作弊？',
    bridge: '机制闭环已经出现；下一步逐项检查它能否安全实现。',
    screens: ['verification-engine', 'private-evidence', 'deployment-modes', 'security-boundaries'],
  },
  {
    key: 'economy',
    id: 'economy-roles',
    label: '经济模型',
    shortLabel: '05 / ECONOMICS',
    question: '客户付费、有效计算贡献和网络奖励怎样避免混账？',
    bridge: '技术上可以验证之后，还要让每个角色有收益、坏行为有代价。',
    screens: ['economy-roles', 'useful-compute-economy'],
  },
  {
    key: 'delivery',
    id: 'product-roadmap',
    label: '落地路径',
    shortLabel: '06 / DELIVERY',
    question: '当前概念怎样被验证成一款可部署产品？',
    bridge: '产品逻辑、技术边界和经济关系明确后，最后只谈可验证的交付顺序。',
    screens: ['product-roadmap', 'pilot-cta'],
  },
] as const;

export const coverChapter = {
  key: 'cover',
  id: 'top',
  label: '产品封面',
  shortLabel: 'ACVM / PRODUCT',
  question: '怎样把无意义的哈希竞争，换成可验证的模型推理服务？',
  bridge: '从两种被浪费的能力出发。',
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
