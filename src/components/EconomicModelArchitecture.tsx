import { useState } from 'react';
import { Icon, type IconName } from './Icons';
import { DataChip, LearningPanel } from './LearningPanel';

const participants = [
  {
    code: 'REQUESTER',
    name: '需求方',
    icon: 'key',
    provides: '签名 Intent、验收规则与托管预算',
    receives: '达标结果；未达标时退回结果奖励',
    risk: '临时取消或恶意拒收要承担保证金',
  },
  {
    code: 'WORKER',
    name: '执行方',
    icon: 'brain',
    provides: '模型、工具、算力、产物与执行回执',
    receives: '结果验收终局后获得结果奖励',
    risk: '正常未达标不获奖励；造假可被罚没',
  },
  {
    code: 'EVIDENCE',
    name: '证据提供方',
    icon: 'eye',
    provides: '独立观测、数据来源与时间证明',
    receives: '按有效证据获得固定服务费',
    risk: '伪造来源或重复证据会被拒绝和罚没',
  },
  {
    code: 'VALIDATOR',
    name: '验收方',
    icon: 'shield',
    provides: '按冻结谓词复核证据并签名裁决',
    receives: '按正确验收工作获得验证费',
    risk: '错判、双签或串谋损失质押与资格',
  },
  {
    code: 'CHALLENGER',
    name: '挑战者',
    icon: 'fingerprint',
    provides: '挑战保证金、反证与复核请求',
    receives: '有效挑战获得罚没资金中的奖励',
    risk: '无效或骚扰式挑战损失保证金',
  },
  {
    code: 'CONSENSUS',
    name: '共识与协议',
    icon: 'chain',
    provides: '排序、托管、挑战窗口与一次性终局',
    receives: 'Gas、证明验证费与协议费',
    risk: '受底层链最终性和治理安全边界约束',
  },
] as const satisfies readonly {
  code: string;
  name: string;
  icon: IconName;
  provides: string;
  receives: string;
  risk: string;
}[];

export function ParticipantEconomyArchitecture() {
  return (
    <LearningPanel code="ECONOMY / CONTRIBUTION → REWARD → RISK" status="SIX ROLES" className="economy-roles-panel">
      <header className="economy-split-rule">
        <span><small>业务奖励</small><strong>只绑定已验证结果</strong></span>
        <i aria-hidden="true">+</i>
        <span><small>基础设施费用</small><strong>支付真实完成的证据与验证工作</strong></span>
      </header>
      <div className="economy-role-grid">
        {participants.map((participant) => (
          <article key={participant.code}>
            <header><Icon name={participant.icon} /><span><small>{participant.code}</small><strong>{participant.name}</strong></span></header>
            <dl>
              <div><dt>投入</dt><dd>{participant.provides}</dd></div>
              <div className="is-reward"><dt>获得</dt><dd>{participant.receives}</dd></div>
              <div className="is-risk"><dt>风险</dt><dd>{participant.risk}</dd></div>
            </dl>
          </article>
        ))}
      </div>
      <footer className="economy-boundary-note"><Icon name="receipt" /><span><strong>结果奖励和验证成本必须分账</strong><small>结果未达标时 Worker 奖励可以为零，但诚实完成的观测、验收和链上验证仍然需要成本。</small></span></footer>
    </LearningPanel>
  );
}

type SettlementScenario = 'accepted' | 'rejected' | 'fraud';

const settlementScenarios = {
  accepted: {
    label: '验收通过',
    status: 'ACCEPTED + FINALIZED',
    summary: '结果满足冻结规则并通过挑战期，结果池按事前公式释放。',
    payouts: [
      ['结果参与方', '¥100,000', 'GEO Worker；或多方数据按 splitRoot 分账', 'is-success'],
      ['证据与验证', '¥15,000', '证据、Validator 与协议成本', ''],
      ['需求方', '¥5,000', '挑战准备金退回', 'is-refund'],
    ],
    note: '业务付款只在 verdict = accepted 且 finalityReached 时发生。',
  },
  rejected: {
    label: '正常未达标',
    status: 'REJECTED · NO FRAUD',
    summary: '参与方如实履约，但结果没有达到门槛；不罚没，也不释放结果池。',
    payouts: [
      ['需求方', '¥105,000', '结果池与准备金退回', 'is-refund'],
      ['证据与验证', '¥15,000', '已完成的协议工作', ''],
      ['结果参与方', '¥0', '未达标，不释放结果费', 'is-zero'],
    ],
    note: '没有达到目标不等于作弊；罚没只针对可证明的违规行为。',
  },
  fraud: {
    label: '发现作弊',
    status: 'FRAUD PROVEN',
    summary: '挑战者证明回执、授权或证据造假，结果池退回，责任方保证金另行罚没。',
    payouts: [
      ['需求方', '¥105,000', '托管结果资金退回', 'is-refund'],
      ['证据与验证', '¥15,000', '已完成的协议工作', ''],
      ['责任方保证金', '−¥20,000', '罚给挑战者与安全储备', 'is-loss'],
    ],
    note: '挑战奖励来自违规保证金，不从需求方的结果预算重复扣款。',
  },
} as const;

export function SettlementWaterfallArchitecture() {
  const [scenario, setScenario] = useState<SettlementScenario>('accepted');
  const active = settlementScenarios[scenario];

  return (
    <LearningPanel code="ILLUSTRATIVE ESCROW / NOT PRICING" status={active.status} className="settlement-waterfall-panel is-simple">
      <div className="settlement-budget-summary" aria-label="示例托管预算十二万元">
        <span><small>条件结果池</small><strong>¥100,000</strong></span>
        <i aria-hidden="true">+</i>
        <span><small>证据、验证、协议与准备金</small><strong>¥20,000</strong></span>
      </div>
      <div className="settlement-scenario-tabs" role="tablist" aria-label="选择结算结果">
        {(Object.keys(settlementScenarios) as SettlementScenario[]).map((key) => (
          <button type="button" role="tab" aria-selected={scenario === key} className={scenario === key ? 'is-active' : ''} onClick={() => setScenario(key)} key={key}>
            <small>{key === 'accepted' ? '01' : key === 'rejected' ? '02' : '03'}</small><strong>{settlementScenarios[key].label}</strong>
          </button>
        ))}
      </div>
      <section className="settlement-result">
        <header><span><small>CURRENT OUTCOME</small><strong>{active.label}</strong></span><p>{active.summary}</p></header>
        <div className="settlement-payout-list">
          {active.payouts.map(([actor, amount, reason, className]) => (
            <article className={className} key={actor}><span><strong>{actor}</strong><small>{reason}</small></span><b>{amount}</b></article>
          ))}
        </div>
      </section>
      <footer className="settlement-rule"><Icon name="shield" /><strong>{active.note}</strong></footer>
    </LearningPanel>
  );
}

export function IncentiveSecurityArchitecture() {
  const [detectionProbability, setDetectionProbability] = useState(65);
  const [slashExposure, setSlashExposure] = useState(80);
  const cheatingGain = 40;
  const cheatingUtility = cheatingGain - (detectionProbability / 100) * slashExposure;
  const safe = cheatingUtility < 0;

  return (
    <LearningPanel code="INCENTIVE COMPATIBILITY / EXPECTED CHEATING PAYOFF" status={safe ? 'HONESTY DOMINATES' : 'CHEATING PROFITABLE'} className={`incentive-security-panel ${safe ? 'is-safe' : 'is-unsafe'}`}>
      <header className="incentive-equation">
        <span><small>作弊的预期收益</small><strong>U<sub>cheat</sub> = G − p<sub>detect</sub> × L</strong></span>
        <i>=</i>
        <b>{cheatingGain} − {(detectionProbability / 100).toFixed(2)} × {slashExposure}</b>
        <em>{cheatingUtility >= 0 ? '+' : ''}{cheatingUtility.toFixed(1)}k</em>
      </header>
      <div className="incentive-controls">
        <label>
          <span><small>p<sub>detect</sub></small><strong>发现作弊的概率</strong><b>{detectionProbability}%</b></span>
          <input type="range" min="10" max="95" step="5" value={detectionProbability} onChange={(event) => setDetectionProbability(Number(event.target.value))} />
        </label>
        <label>
          <span><small>L</small><strong>保证金 + 追回 + 未来收入损失</strong><b>¥{slashExposure}k</b></span>
          <input type="range" min="20" max="120" step="10" value={slashExposure} onChange={(event) => setSlashExposure(Number(event.target.value))} />
        </label>
      </div>
      <div className="incentive-mechanisms">
        <article><Icon name="key" /><span><small>REQUESTER</small><strong>预算先托管</strong><p>防止结果通过后拒付；随意取消承担费用。</p></span></article>
        <article><Icon name="brain" /><span><small>WORKER</small><strong>结果奖励 + 保证金</strong><p>诚实失败不罚没，伪造回执才失去质押。</p></span></article>
        <article><Icon name="shield" /><span><small>VALIDATOR</small><strong>独立抽样 + 正确性付费</strong><p>错判与双签可证明，费用不能按“通过票”支付。</p></span></article>
        <article><Icon name="fingerprint" /><span><small>CHALLENGER</small><strong>有效反证有奖励</strong><p>挑战也要押金，避免用低成本异议阻塞结算。</p></span></article>
      </div>
      <footer className="incentive-verdict">
        <DataChip tone={safe ? 'green' : 'red'}>{safe ? '参数可抑制作假' : '参数不足'}</DataChip>
        <strong>{safe ? '作弊的期望收益为负，结果付费才有可信基础。' : '提高抽检概率或罚没敞口，否则作弊仍然划算。'}</strong>
        <small>示例只展示机制关系；实际参数必须按可获利上限、串谋成本和误判率校准。</small>
      </footer>
    </LearningPanel>
  );
}
