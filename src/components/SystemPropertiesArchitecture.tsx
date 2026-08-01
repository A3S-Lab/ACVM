import { useMemo, useState } from 'react';
import { DetailHint } from './DetailHint';
import { Icon, type IconName } from './Icons';

type PropertyKey = 'availability' | 'stability' | 'efficiency';

type RangeControlProps = {
  label: string;
  symbol: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  summary: string;
  effect: string;
  onChange: (value: number) => void;
};

type PropertyModel = {
  code: string;
  label: string;
  claim: string;
  formula: string;
  calculation: string;
  result: string;
  valid: boolean;
  steps: readonly (readonly [string, string])[];
  metrics: readonly (readonly [string, string])[];
  assumptions: string;
  failure: string;
};

const propertyTabs: Array<{ id: PropertyKey; code: string; title: string; icon: IconName }> = [
  { id: 'availability', code: 'A', title: '可用性', icon: 'chain' },
  { id: 'stability', code: 'S', title: '稳定性', icon: 'shield' },
  { id: 'efficiency', code: 'E', title: '高效性', icon: 'bolt' },
];

function combination(n: number, k: number) {
  const width = Math.min(k, n - k);
  let value = 1;
  for (let index = 1; index <= width; index += 1) value = (value * (n - width + index)) / index;
  return value;
}

function binomialTail(n: number, threshold: number, probability: number) {
  let value = 0;
  for (let k = threshold; k <= n; k += 1) {
    value += combination(n, k) * (probability ** k) * ((1 - probability) ** (n - k));
  }
  return value;
}

function percent(value: number, digits = 3) {
  return `${(value * 100).toFixed(digits)}%`;
}

function number(value: number, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : '∞';
}

function RangeControl({ label, symbol, value, min, max, step, suffix = '', summary, effect, onChange }: RangeControlProps) {
  return (
    <label className="property-control">
      <span>
        <DetailHint
          className="property-parameter"
          category="计算参数"
          label={<><code>{symbol}</code>{label}</>}
          title={`${symbol} · ${label}`}
          summary={summary}
          details={[
            { label: '取值范围', value: `${min} ～ ${max}${suffix}` },
            { label: '敏感性', value: effect },
          ]}
        />
        <strong>{value}{suffix}</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </label>
  );
}

export function SystemPropertiesArchitecture() {
  const [active, setActive] = useState<PropertyKey>('availability');
  const [faults, setFaults] = useState(2);
  const [nodeAvailability, setNodeAvailability] = useState(98);
  const [workerAvailabilityRate, setWorkerAvailabilityRate] = useState(97);
  const [proofStoreAvailabilityRate, setProofStoreAvailabilityRate] = useState(99.9);
  const [workerReplicas, setWorkerReplicas] = useState(3);
  const [arrivalRate, setArrivalRate] = useState(60);
  const [workerCount, setWorkerCount] = useState(8);
  const [serviceRate, setServiceRate] = useState(12);
  const [executionNodes, setExecutionNodes] = useState(21);
  const [taskCost, setTaskCost] = useState(5000);
  const [proofOverhead, setProofOverhead] = useState(40);
  const [verifyCost, setVerifyCost] = useState(8);
  const [validatorCount, setValidatorCount] = useState(3);

  const nodeCount = 3 * faults + 1;
  const quorum = 2 * faults + 1;
  const p = nodeAvailability / 100;
  const workerP = workerAvailabilityRate / 100;

  const models = useMemo<Record<PropertyKey, PropertyModel>>(() => {
    const quorumAvailability = binomialTail(nodeCount, quorum, p);
    const workerAvailability = 1 - ((1 - workerP) ** workerReplicas);
    const proofStoreAvailability = proofStoreAvailabilityRate / 100;
    const taskAvailability = quorumAvailability * workerAvailability * proofStoreAvailability;
    const availabilitySlo = 0.99;

    const capacity = workerCount * serviceRate;
    const utilization = arrivalRate / capacity;
    const stable = utilization < 1;
    const responseApprox = stable ? 1 / (capacity - arrivalRate) : Number.POSITIVE_INFINITY;
    const queueApprox = stable ? arrivalRate * responseApprox : Number.POSITIVE_INFINITY;
    const intersection = faults + 1;

    const validatorCost = taskCost * 0.15;
    const proofCost = taskCost * (proofOverhead / 100);
    const traditionalCost = executionNodes * taskCost;
    const acvmCost = taskCost + proofCost + validatorCount * validatorCost + executionNodes * verifyCost;
    const saving = 1 - acvmCost / traditionalCost;
    const receiptCount = 1024;
    const merklePathBytes = 32 * Math.ceil(Math.log2(receiptCount));

    return {
      availability: {
        code: 'A / QUORUM AVAILABILITY',
        label: taskAvailability >= availabilitySlo ? '达到 99% 目标' : '低于 99% 目标',
        claim: '只要共识法定人数、至少一个 Worker 和证明存储同时可达，任务路径就仍可推进。',
        formula: 'Aq = Σₖ₌Qᴺ C(N,k)·pᵏ·(1−p)ᴺ⁻ᵏ;  Atask ≈ Aq·Aw·As',
        calculation: `N=${nodeCount}, Q=${quorum}, pn=${p.toFixed(3)}, pw=${workerP.toFixed(3)}; Aq=${percent(quorumAvailability)}; Aw=1−(1−pw)^${workerReplicas}=${percent(workerAvailability)}`,
        result: percent(taskAvailability),
        valid: taskAvailability >= availabilitySlo,
        steps: [
          [`N=3f+1=${nodeCount}; Q=2f+1=${quorum}`, '先从拜占庭容错条件得到节点总数和可提交法定人数。'],
          [`Aq=Σₖ₌${quorum}^${nodeCount} Binomial(k;${nodeCount},${p.toFixed(2)})=${percent(quorumAvailability)}`, '把“在线节点数不少于 Q”写成二项分布尾概率。'],
          [`Atask≈Aq·Aw·As=${percent(taskAvailability)}`, '在独立故障域假设下，把共识、Worker 池和证明存储视为串联系统。'],
        ],
        metrics: [['共识可用', percent(quorumAvailability)], ['Worker 可用', percent(workerAvailability)], ['证明存储', percent(proofStoreAvailability)], ['目标 SLO', '≥ 99.000%'], ['不可用概率', percent(1 - taskAvailability, 5)]],
        assumptions: '共识节点、Worker 和证明存储的故障近似独立；各概率在目标观测窗口内稳定；三类资源不共享同一故障域。',
        failure: '机房、云厂商或软件版本造成的共同故障会破坏独立性，实际可用性必须用分故障域数据重算。',
      },
      stability: {
        code: 'S / SAFETY + QUEUE STABILITY',
        label: stable ? '稳定区间' : '已进入积压区',
        claim: '稳定性同时要求状态不会分叉、结算不会重复，而且长期任务到达率低于可服务能力。',
        formula: 'Safety: |Q₁∩Q₂|≥f+1;  Queue: ρ=λ/(cμ)<1;  Idempotence: Spentₜ⊆Spentₜ₊₁',
        calculation: `ρ=${arrivalRate}/(${workerCount}×${serviceRate})=${number(utilization, 3)}; margin=cμ−λ=${capacity - arrivalRate} task/s`,
        result: stable ? `ρ ${number(utilization, 3)} < 1` : `ρ ${number(utilization, 3)} ≥ 1`,
        valid: stable,
        steps: [
          [`|Q₁∩Q₂|≥${intersection}`, `两个 ${quorum} 票法定人数至少重叠 ${intersection} 个节点，其中至少一个诚实节点不会确认冲突锁。`],
          ['Spent(taskId): 0→1, never 1→0', '结算状态单调增长，重试只能读取已结算结果，不能再次转账。'],
          [`ρ=λ/(cμ)=${number(utilization, 3)}`, stable ? 'ρ<1，平均服务能力高于到达率，理想池化队列存在稳态。' : 'ρ≥1，输入长期快于处理能力，队列期望长度会无界增长。'],
        ],
        metrics: [['到达率 λ', `${arrivalRate} task/s`], ['总服务率 cμ', `${capacity} task/s`], ['容量余量', `${capacity - arrivalRate} task/s`], ['W≈1/(cμ−λ)', stable ? `${number(responseApprox * 1000, 1)} ms` : '∞'], ['L=λW', number(queueApprox, 2)]],
        assumptions: '队列近似平稳、任务可在 Worker 间分配、平均服务率有限；BFT 故障不超过 f 且诚实节点遵守锁定规则。',
        failure: 'ρ≥1 时扩容、限流或降级是必要条件；公式不能用短时平均值掩盖突发流量和长尾任务。',
      },
      efficiency: {
        code: 'E / VERIFY INSTEAD OF RE-EXECUTE',
        label: '计算节省模型',
        claim: '高效性来自把 N 次重计算改成 1 次 Worker 计算、少量独立验收和 N 次便宜验证。',
        formula: 'CEVM=N·Cexec;  CACVM=Cexec+Cprove+q·Cval+N·Cverify;  η=1−CACVM/CEVM',
        calculation: `CEVM=${executionNodes}×${taskCost}=${traditionalCost.toLocaleString()} node·ms; CACVM=${taskCost}+${proofCost}+${validatorCount}×${validatorCost}+${executionNodes}×${verifyCost}=${acvmCost.toLocaleString()} node·ms`,
        result: percent(saving, 1),
        valid: saving > 0,
        steps: [
          [`CEVM=${traditionalCost.toLocaleString()} node·ms`, '传统全复制执行要求每个共识节点承担完整任务成本。'],
          [`CACVM=${acvmCost.toLocaleString()} node·ms`, 'ACVM 计入一次主任务、证明生成、独立验收和所有共识节点的证明验证，没有省略证明开销。'],
          [`η=1−CACVM/CEVM=${percent(saving, 1)}`, '两种方案在相同任务语义下比较总节点计算量。'],
        ],
        metrics: [['完整执行次数', `N → 1`], ['证明生成 Cprove', `${proofCost.toLocaleString()} node·ms`], ['Validator 单次成本', `15% × Cexec = ${validatorCost.toLocaleString()}`], ['证明验证总成本', `${executionNodes * verifyCost} node·ms`], ['链上回执根', '32 B / batch'], ['1024 条包含路径', `${merklePathBytes} B = O(log m)`]],
        assumptions: '计算统一折算为等效 node·ms；Worker 结果可由显著更便宜的证明或验收验证；Validator 单次成本暂按 0.15×Cexec 建模；任务语义和安全强度相同。',
        failure: '若 Cverify 接近 Cexec、Validator 需要完整复算或 Cprove 过高，节省会下降甚至为负，必须用实际基准替换参数。',
      },
    };
  }, [arrivalRate, executionNodes, faults, nodeAvailability, p, proofOverhead, proofStoreAvailabilityRate, quorum, nodeCount, serviceRate, taskCost, validatorCount, verifyCost, workerAvailabilityRate, workerCount, workerP, workerReplicas]);

  const model = models[active];

  return (
    <div className={`diagram-panel system-properties-panel property-${active}`}>
      <header className="panel-chrome">
        <span><i /><i /><i /></span>
        <code>ACVM / FIRST-PRINCIPLES SYSTEM PROPERTIES</code>
        <strong><i /> LIVE MODEL</strong>
      </header>

      <nav className="property-tabs" aria-label="选择要推导的系统性质">
        {propertyTabs.map((tab) => (
          <button type="button" className={active === tab.id ? 'is-active' : ''} onClick={() => setActive(tab.id)} aria-pressed={active === tab.id} key={tab.id}>
            <Icon name={tab.icon} /><span><small>{tab.code}</small><strong>{tab.title}</strong></span>
          </button>
        ))}
      </nav>

      <div className="property-body">
        <section className="property-controls" aria-label="公式参数">
          <header><small>MODEL INPUT</small><strong>拖动参数，结果会重算</strong></header>
          {active === 'availability' ? (
            <>
              <RangeControl label="容错节点数" symbol="f" value={faults} min={1} max={6} step={1} summary="系统允许同时出现的拜占庭或离线节点上限。" effect="f 每增加 1，BFT 节点数增加 3，法定人数增加 2。" onChange={setFaults} />
              <RangeControl label="共识节点响应率" symbol="pn" value={nodeAvailability} min={90} max={99.9} step={0.1} suffix="%" summary="一个共识节点在目标观测窗口内在线、持有正确状态并按协议返回有效投票的概率。" effect="二项尾概率对 pn 非线性敏感；接近法定人数边界时下降很快。" onChange={setNodeAvailability} />
              <RangeControl label="Worker 响应率" symbol="pw" value={workerAvailabilityRate} min={80} max={99.9} step={0.1} suffix="%" summary="一个 Worker 副本在观测窗口内能接单并完成执行的概率。" effect="与副本数 w 共同决定 Aw=1−(1−pw)^w；同故障域副本不能按独立事件计算。" onChange={setWorkerAvailabilityRate} />
              <RangeControl label="Worker 副本" symbol="w" value={workerReplicas} min={1} max={10} step={1} summary="可承接同一类工作负载的独立 Worker 数量。" effect="独立副本下 Aw=1−(1−pw)^w，但同故障域副本不会带来同等收益。" onChange={setWorkerReplicas} />
              <RangeControl label="证明存储可用率" symbol="As" value={proofStoreAvailabilityRate} min={95} max={99.99} step={0.01} suffix="%" summary="验证节点在目标窗口内可取回证明正文或数据可用性份额的概率。" effect="证明取不回时即使根仍在链上，也无法完成新节点复核和争议挑战。" onChange={setProofStoreAvailabilityRate} />
            </>
          ) : null}
          {active === 'stability' ? (
            <>
              <RangeControl label="任务到达率" symbol="λ" value={arrivalRate} min={10} max={220} step={5} suffix="/s" summary="单位时间进入系统的平均任务数量。" effect="λ 接近总服务率 cμ 时，等待时间与队列长度会急剧增加。" onChange={setArrivalRate} />
              <RangeControl label="Worker 数量" symbol="c" value={workerCount} min={1} max={24} step={1} summary="可并行服务该任务类的 Worker 数量。" effect="理想池化下总服务率与 c 近似线性增长。" onChange={setWorkerCount} />
              <RangeControl label="单 Worker 速率" symbol="μ" value={serviceRate} min={2} max={30} step={1} suffix="/s" summary="单个 Worker 每秒完成任务的长期平均值。" effect="μ 必须包含失败、重试和长尾任务，不能只用最快样本。" onChange={setServiceRate} />
              <RangeControl label="拜占庭容错" symbol="f" value={faults} min={1} max={6} step={1} summary="用于计算共识法定人数交集的故障上限。" effect="N=3f+1、Q=2f+1 时，任意两个 Q 至少重叠 f+1 个节点。" onChange={setFaults} />
            </>
          ) : null}
          {active === 'efficiency' ? (
            <>
              <RangeControl label="共识节点" symbol="N" value={executionNodes} min={4} max={64} step={1} summary="传统复制执行中需要重复运行任务的节点数。" effect="CEVM 随 N 线性增长；ACVM 的 N 项只承担证明验证。" onChange={setExecutionNodes} />
              <RangeControl label="完整执行成本" symbol="Cexec" value={taskCost} min={500} max={20000} step={500} suffix="ms" summary="一次完整业务计算的节点时间；传统复制执行中每个共识节点都要支付。" effect="业务计算越重，而证明验证保持便宜，验证代替重算的收益越大。" onChange={setTaskCost} />
              <RangeControl label="证明开销" symbol="Cprove/Cexec" value={proofOverhead} min={0} max={300} step={5} suffix="%" summary="Worker 为执行轨迹生成密码学证明所增加的成本比例。" effect="证明系统越重，ACVM 的盈亏平衡点越靠近更大的节点数和更重的任务。" onChange={setProofOverhead} />
              <RangeControl label="验证成本" symbol="Cverify" value={verifyCost} min={1} max={250} step={1} suffix="ms" summary="一个共识节点验证证明和回执根的时间模型。" effect="当 Cverify 接近 Cexec 时，ACVM 的计算优势会消失。" onChange={setVerifyCost} />
              <RangeControl label="独立 Validator" symbol="q" value={validatorCount} min={1} max={12} step={1} summary="执行轻量验收或抽检的独立 Validator 数量。" effect="q 提高抗串谋能力，也线性增加验收计算成本。" onChange={setValidatorCount} />
            </>
          ) : null}
        </section>

        <section className="property-proof" aria-live="polite">
          <header>
            <span><small>{model.code}</small><strong>{model.claim}</strong></span>
            <b className={model.valid ? 'is-valid' : 'is-invalid'}><i />{model.label}<em>{model.result}</em></b>
          </header>
          <code className="property-formula">{model.formula}</code>
          <code className="property-calculation">{model.calculation}</code>
          <ol>
            {model.steps.map(([expression, explanation], index) => (
              <li key={expression}><span>{String(index + 1).padStart(2, '0')}</span><div><code>{expression}</code><p>{explanation}</p></div></li>
            ))}
          </ol>
          <dl>
            {model.metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
          <footer><p><b>成立前提</b>{model.assumptions}</p><p><b>失效边界</b>{model.failure}</p></footer>
        </section>
      </div>

      <footer className="property-status">
        <span><i /> FORMULA MODEL / NOT A BENCHMARK</span>
        <code>ASSUMPTIONS → DERIVATION → NUMERIC SUBSTITUTION → VALIDITY BOUNDARY</code>
      </footer>
    </div>
  );
}
