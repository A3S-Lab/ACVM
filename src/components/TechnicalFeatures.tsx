import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks';
import { Icon, type IconName } from './Icons';

const kernelStages: Array<{
  key: string;
  label: string;
  code: string;
  icon: IconName;
  title: string;
  detail: string;
  input: string;
  output: string;
  invariant: string;
}> = [
  {
    key: 'load',
    label: '装载合约',
    code: 'LOAD',
    icon: 'terminal',
    title: '装载 AgenticContract Manifest',
    detail: '固定责任主体、任务目标、允许使用的能力、策略版本、资金上限与最终验收条件。',
    input: '签名 Manifest + 组织凭证',
    output: '不可变执行上下文 ctx#A18',
    invariant: '运行时不能自行扩大目标、预算或工具范围。',
  },
  {
    key: 'trust',
    label: '验证主体',
    code: 'VERIFY',
    icon: 'fingerprint',
    title: '解析组织、Agent 与合约实例的责任链',
    detail: '验证企业 CA / DID、Agent 身份承诺和能力零知识证明，并把本次执行绑定到唯一合约实例。',
    input: 'Identity commitment + πcap',
    output: 'Verified principal + scope',
    invariant: '钱包签名不能替代企业责任身份和能力证明。',
  },
  {
    key: 'discover',
    label: '发现能力',
    code: 'DISCOVER',
    icon: 'key',
    title: '通过 Progressive API 逐级理解工具',
    detail: '先 list，再 describe 和 dry-run；只有参数、成本与副作用明确后，才申请一次性执行权限。',
    input: 'Goal + capability scope',
    output: 'Typed tool plan + dry-run hash',
    invariant: 'Agent 看不到未被当前任务需要的企业 API。',
  },
  {
    key: 'execute',
    label: '隔离执行',
    code: 'EXECUTE',
    icon: 'bolt',
    title: '每次工具调用都穿过零信任执行边界',
    detail: '短期凭据只对当前合约、当前工具和当前参数有效；敏感推理进入 a3s-box，由 a3s-power 在隔离环境完成。',
    input: 'Signed plan + short-lived grant',
    output: 'Tool result + attestation',
    invariant: '网络位置、进程身份和上一次授权都不构成本次信任。',
  },
  {
    key: 'control',
    label: '策略控制',
    code: 'CONTROL',
    icon: 'shield',
    title: 'AnySentry 持续判断，ACVM 强制落实',
    detail: '身份漂移、越权读取、数据回写、异常目标和付款指令都进入策略判断；ALLOW 或 BLOCK 直接改变执行状态。',
    input: 'Runtime signals + Policy v3.8',
    output: 'Signed ALLOW / BLOCK decision',
    invariant: '安全系统不只告警，控制决定必须落实到工具与资金。',
  },
  {
    key: 'commit',
    label: '生成凭证',
    code: 'COMMIT',
    icon: 'chain',
    title: '封装执行凭证并交给联盟节点确认',
    detail: '身份摘要、规则版本、工具回执、隐私证明、安全决定与状态根形成统一凭证，再由链适配器提交账本。',
    input: 'Execution trace commitments',
    output: 'Receipt root + chain finality',
    invariant: '原始业务数据不上链，验证所需的责任与证明不能缺失。',
  },
];

export function ExecutionKernel({ active = true }: { active?: boolean }) {
  const reducedMotion = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const current = kernelStages[stage];

  useEffect(() => {
    if (!active || !playing || reducedMotion) return;
    const timer = window.setTimeout(() => setStage((value) => (value + 1) % kernelStages.length), 5200);
    return () => window.clearTimeout(timer);
  }, [active, playing, reducedMotion, stage]);

  useEffect(() => {
    if (!active) return;
    setStage(0);
    setPlaying(true);
  }, [active]);

  const choose = (index: number) => {
    setStage(index);
    setPlaying(false);
  };

  return (
    <div className={`kernel-demo kernel-demo--${current.key}`} style={{ '--kernel-step': stage, '--kernel-scale': (stage + 1) / kernelStages.length, '--kernel-progress': `${((stage + 0.5) / kernelStages.length) * 100}%` } as React.CSSProperties}>
      <header className="kernel-toolbar">
        <div><span><i /> ACVM RUNTIME</span><strong>acvm://org-a3s/campaign-18</strong></div>
        <button type="button" onClick={() => reducedMotion ? choose((stage + 1) % kernelStages.length) : setPlaying((value) => !value)}>
          <Icon name={reducedMotion || !playing ? 'play' : 'pause'} /> {reducedMotion ? '下一步' : playing ? '暂停' : '继续'}
        </button>
      </header>

      <div className="kernel-body">
        <aside className="kernel-manifest" aria-label="AgenticContract Manifest 示例">
          <header><Icon name="terminal" /><span><small>CONTRACT MANIFEST</small><strong>campaign.ac.yaml</strong></span></header>
          <pre><span>principal</span> org:9131…/agent:media{`\n`}<span>goal</span> verify.paid_conversion{`\n`}<span>tools</span> ads.read · crm.verify{`\n`}<span>policy</span> sentry/commercial-v3.8{`\n`}<span>privacy</span> a3s-box/tee{`\n`}<span>settle</span> proof ∧ consensus</pre>
          <div><small>EXECUTION MODEL</small><strong>Goal + Policy + Proof</strong><p>不是把自然语言直接交给链，而是先固定可验证的执行边界。</p></div>
        </aside>

        <section className="kernel-flight" aria-label="ACVM 六阶段执行流水线">
          <div className="kernel-lanes" aria-hidden="true">
            <span>CONTRACT PLANE</span><span>TRUST PLANE</span><span>EXECUTION PLANE</span><span>PROOF PLANE</span>
          </div>
          <div className="kernel-rail" aria-hidden="true"><i /></div>
          <div className="kernel-packet" aria-hidden="true"><Icon name={current.icon} /><span>{current.code}</span></div>
          <nav>
            {kernelStages.map((item, index) => (
              <button type="button" key={item.key} className={index === stage ? 'is-active' : index < stage ? 'is-passed' : ''} onClick={() => choose(index)}>
                <i>{index < stage ? <Icon name="check" /> : <Icon name={item.icon} />}</i>
                <span><small>{item.code}</small><strong>{item.label}</strong></span>
              </button>
            ))}
          </nav>
          <div className="kernel-subsystems" aria-label="执行阶段涉及的 A3S 中间件">
            <span className={stage === 1 ? 'is-active' : ''}><Icon name="fingerprint" /><small>IDENTITY</small><strong>主体与能力证明</strong></span>
            <span className={[2, 3].includes(stage) ? 'is-active' : ''}><Icon name="key" /><small>PROGRESSIVE API</small><strong>发现与最小授权</strong></span>
            <span className={stage === 3 ? 'is-active' : ''}><Icon name="lock" /><small>a3s-box × a3s-power</small><strong>隔离隐私推理</strong></span>
            <span className={stage === 4 ? 'is-active' : ''}><Icon name="shield" /><small>ANYSENTRY</small><strong>观测、判断、控制</strong></span>
          </div>
        </section>

        <aside className="kernel-inspector" aria-live="polite">
          <header><span>{String(stage + 1).padStart(2, '0')}</span><p><small>{current.code}</small><strong>{current.title}</strong></p></header>
          <p>{current.detail}</p>
          <dl>
            <div><dt>INPUT</dt><dd>{current.input}</dd></div>
            <div><dt>OUTPUT</dt><dd>{current.output}</dd></div>
          </dl>
          <div className="kernel-invariant"><Icon name="shield" /><p><small>RUNTIME INVARIANT</small><strong>{current.invariant}</strong></p></div>
        </aside>
      </div>

      <footer className="kernel-specs">
        <span><small>语义</small><strong>目标驱动 + 确定性边界</strong></span>
        <span><small>授权</small><strong>每次调用重新验证</strong></span>
        <span><small>状态</small><strong>事件承诺 + 可恢复执行</strong></span>
        <span><small>输出</small><strong>证明化执行凭证</strong></span>
        <span><small>账本</small><strong>联盟链适配器</strong></span>
      </footer>
    </div>
  );
}

const identityStages = [
  {
    key: 'binding',
    label: '责任身份链',
    title: 'Agent 不是一个钱包地址，而是一条可追责身份链',
    detail: '企业法定身份、Agent 实例、AgenticContract 和临时工具会话逐层绑定。任何执行都能还原由谁发布、代表谁、以什么范围行动。',
    proof: 'Org CA → Agent ID → Contract ID → Session Key',
  },
  {
    key: 'proof',
    label: '能力零知识证明',
    title: '证明“具备能力且获准执行”，不公开内部材料',
    detail: '组织授权、能力注册、运行时度量和策略合规记录作为私有见证，验证方只获得能力证明、任务范围和有效期。',
    proof: 'Verify(πcap, agentCommitment, scope, expiry) = true',
  },
  {
    key: 'session',
    label: '零信任工具会话',
    title: '能力证明通过，也不获得长期、全量 API 权限',
    detail: 'Agent 先发现接口，再描述参数和副作用、执行 dry-run，最后为当前合约签发短期授权；下一次调用重新核验。',
    proof: 'list → describe → dry-run → authorize → execute',
  },
];

export function IdentityCapability({ active = true }: { active?: boolean }) {
  const reducedMotion = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const current = identityStages[stage];

  useEffect(() => {
    if (!active || !playing || reducedMotion) return;
    const timer = window.setTimeout(() => setStage((value) => (value + 1) % identityStages.length), 6400);
    return () => window.clearTimeout(timer);
  }, [active, playing, reducedMotion, stage]);

  useEffect(() => {
    if (!active) return;
    setStage(0);
    setPlaying(true);
  }, [active]);

  const choose = (index: number) => {
    setStage(index);
    setPlaying(false);
  };

  return (
    <div className={`identity-demo identity-demo--${current.key}`}>
      <header className="identity-toolbar">
        <nav aria-label="身份与能力证明章节">
          {identityStages.map((item, index) => <button type="button" key={item.key} className={index === stage ? 'is-active' : ''} onClick={() => choose(index)}><span>0{index + 1}</span>{item.label}</button>)}
        </nav>
        <button type="button" onClick={() => reducedMotion ? choose((stage + 1) % identityStages.length) : setPlaying((value) => !value)}><Icon name={reducedMotion || !playing ? 'play' : 'pause'} />{reducedMotion ? '下一章' : playing ? '暂停' : '继续'}</button>
      </header>

      <div className="identity-body">
        <section className="identity-map" aria-label="唯一可信身份责任链">
          <header><span>01 / IDENTITY BINDING</span><strong>唯一可信身份不是单一编号，而是责任绑定</strong></header>
          <div className="identity-chain">
            <div><i><Icon name="fingerprint" /></i><span><small>LEGAL ENTITY</small><strong>企业 CA / 国密证书</strong><em>org:9131…</em></span></div>
            <b><Icon name="arrow" /></b>
            <div><i><Icon name="brain" /></i><span><small>AGENT INSTANCE</small><strong>采购 Agent</strong><em>agent:procurement</em></span></div>
            <b><Icon name="arrow" /></b>
            <div><i><Icon name="terminal" /></i><span><small>CONTRACT INSTANCE</small><strong>质量验收 AC</strong><em>ac:MF71-06</em></span></div>
            <b><Icon name="arrow" /></b>
            <div><i><Icon name="key" /></i><span><small>EPHEMERAL SESSION</small><strong>单任务会话</strong><em>ttl:300s</em></span></div>
          </div>
          <p><Icon name="chain" /> 企业责任主体始终在链上凭证中可还原；临时会话失效后不能被复用。</p>
        </section>

        <section className="capability-circuit" aria-label="能力零知识证明电路">
          <header><span>02 / ZK CAPABILITY</span><strong>私有见证进入证明电路，验证方只看必要结论</strong></header>
          <div className="circuit-flow">
            <div className="private-witness">
              <small>PRIVATE WITNESS</small>
              <span>组织授权记录</span><span>能力注册成员</span><span>运行时度量</span><span>策略合规历史</span>
            </div>
            <i><Icon name="arrow" /></i>
            <div className="proof-circuit"><span><i /><i /><i /></span><Icon name="lock" /><strong>Capability Circuit</strong><small>witness never leaves domain</small></div>
            <i><Icon name="arrow" /></i>
            <div className="public-proof"><Icon name="spark" /><small>PUBLIC PROOF</small><strong>π<sub>cap</sub></strong><span>Agent 承诺 · scope · expiry</span></div>
            <i><Icon name="arrow" /></i>
            <div className="proof-verifier"><Icon name="check" /><small>VERIFIER</small><strong>TRUE</strong><span>不读取内部材料</span></div>
          </div>
        </section>

        <section className="api-session" aria-label="渐进式 API 与零信任工具会话">
          <header><span>03 / ZERO-TRUST SESSION</span><strong>证明能力之后，仍按调用逐步授权</strong></header>
          <div className="api-handshake">
            {['list', 'describe', 'dry-run', 'authorize', 'execute'].map((item, index) => <span key={item} style={{ '--api-step': index } as React.CSSProperties}><i>{index + 1}</i><strong>{item}</strong><small>{['发现名称', '读取参数', '验证副作用', '签发短期凭据', '执行并回执'][index]}</small></span>)}
            <div className="api-session-packet"><Icon name="key" /><em>scope:batch/MF71-06 · ttl:300s</em></div>
          </div>
        </section>

        <aside className="identity-inspector" aria-live="polite">
          <span>0{stage + 1}</span>
          <div><small>{current.label}</small><h3>{current.title}</h3><p>{current.detail}</p><code>{current.proof}</code></div>
        </aside>
      </div>

      <footer className="identity-standards">
        <span><small>身份入口</small><strong>企业 CA · 国密证书 · DID</strong></span>
        <span><small>证明接口</small><strong>可插拔 ZK / TEE Attestation</strong></span>
        <span><small>公开输入</small><strong>身份承诺 · 任务范围 · 有效期</strong></span>
        <span><small>密码适配</small><strong>算法套件与链环境解耦</strong></span>
      </footer>
    </div>
  );
}
