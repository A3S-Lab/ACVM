import { useEffect, useRef, useState } from 'react';
import { DetailHint } from './DetailHint';
import { Icon, type IconName } from './Icons';
import { TechTerm } from './TechTerm';

type FogStage = {
  code: string;
  title: string;
  actor: string;
  detail: string;
  record: string;
  icon: IconName;
};

const stages: FogStage[] = [
  {
    code: '01',
    title: '签名推理意图',
    actor: '数据拥有者 → 链上调度合约',
    detail: '用户只提交模型版本、预算、时限、隐私级别和输出披露范围；原始输入留在本地。',
    record: 'Intent Hash · Model Hash · Privacy Policy · Nonce',
    icon: 'fingerprint',
  },
  {
    code: '02',
    title: '就近选择雾节点',
    actor: 'ACVM 调度合约 → 雾节点市场',
    detail: '按延迟、硬件证明、地域、价格和能力选择可运行 a3s-box / a3s-power 的雾节点。',
    record: 'Lease ID · Node DID · Capability Proof · SLA',
    icon: 'chain',
  },
  {
    code: '03',
    title: '隐私域内完成推理',
    actor: '雾节点 Worker',
    detail: '密封输入进入隔离环境，固定模型完成推理；节点只输出结果承诺，不持久化明文上下文。',
    record: 'Input Commitment · Output Commitment · Runtime Measurement',
    icon: 'brain',
  },
  {
    code: '04',
    title: '独立节点核验结果',
    actor: '雾节点 Validator 委员会',
    detail: 'Validator 检查模型哈希、远程证明、输出约束和 SLA；必要时抽样复算或门限确认。',
    record: 'Validator Receipts · Attestation · Threshold Signature',
    icon: 'shield',
  },
  {
    code: '05',
    title: '证明与轨迹写链',
    actor: 'Validator → 区块链共识节点',
    detail: '链上只接收可验证回执、证明和状态根，共识节点不重复执行完整模型推理。',
    record: 'Receipt Root · Proof · State Root · Finality',
    icon: 'receipt',
  },
  {
    code: '06',
    title: '按授权披露结果',
    actor: 'ACVM 合约 → 数据拥有者',
    detail: '结果只返回给授权主体或指定业务合约；租约、临时密钥和雾节点缓存随后失效。',
    record: 'Disclosure Receipt · Settlement · Key Revocation',
    icon: 'lock',
  },
];

const routePaths = [
  'M105 165 C180 165 210 96 310 96',
  'M372 96 C455 96 475 165 548 165',
  'M592 165 C632 84 730 84 760 165 C730 246 632 246 592 165',
  'M760 165 C815 165 836 165 884 165',
  'M884 178 C790 292 486 292 342 122',
  'M310 112 C220 235 150 235 105 178',
];

export function FogInferenceArchitecture() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const current = stages[activeStage];

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return undefined;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setActiveStage((stage) => (stage + 1) % stages.length), 2100);
    return () => window.clearInterval(timer);
  }, [playing, visible]);

  const selectStage = (index: number) => {
    setActiveStage(index);
    setPlaying(false);
  };

  return (
    <div className={`diagram-panel fog-inference-panel fog-stage-${activeStage + 1}`} ref={panelRef}>
      <header className="panel-chrome">
        <span><i /><i /><i /></span>
        <code>BLOCKCHAIN FOG INFERENCE NETWORK</code>
        <button
          type="button"
          className="fog-play-control"
          aria-label={playing ? '暂停雾计算网络动画' : '继续播放雾计算网络动画'}
          onClick={() => setPlaying((value) => !value)}
        >
          <Icon name={playing ? 'pause' : 'play'} />{playing ? 'PAUSE' : 'PLAY'}
        </button>
      </header>

      <section className="fog-current" aria-live="polite">
        <span><small>STEP</small>{current.code}</span>
        <div><small>{current.actor}</small><strong><Icon name={current.icon} />{current.title}</strong><p>{current.detail}</p></div>
        <DetailHint
          className="fog-record-hint"
          category="本步链上字段"
          label={<code>{current.record}</code>}
          title={`${current.code} · ${current.title}`}
          summary="这些字段共同绑定本步参与方、规则版本、执行结果与前后状态，缺少必要字段时不能进入下一阶段。"
          details={[
            { label: '可追溯', value: '字段与同一 taskId、合约版本和前序状态根关联，可沿回执链还原完整过程。' },
            { label: '隐私边界', value: '链上保存哈希、证明与状态，不保存原始输入、模型正文和完整推理上下文。' },
          ]}
        />
      </section>

      <div className="fog-network" aria-label="区块链协调的雾计算隐私推理网络动画">
        <svg viewBox="0 0 1000 330" preserveAspectRatio="none" aria-hidden="true">
          <rect className="fog-trust-boundary" x="514" y="28" width="278" height="274" rx="22" />
          <text className="fog-boundary-label" x="531" y="51">DISTRIBUTED FOG PRIVACY DOMAIN</text>
          {routePaths.map((path, index) => (
            <path className={`fog-route ${activeStage === index ? 'is-active' : ''}`} d={path} key={path} />
          ))}
          <circle className="fog-packet" r="5" key={activeStage}>
            <animateMotion dur="1.6s" path={routePaths[activeStage]} repeatCount="indefinite" />
          </circle>
          <path className="fog-ledger-line" d="M281 255H421M301 272H401M321 289H381" />
          <circle className="fog-orbit" cx="652" cy="165" r="96" />
          <path className="fog-mesh" d="M592 101 712 101 746 165 712 229 592 229 558 165ZM592 101 712 229M712 101 592 229M558 165H746" />
        </svg>

        <button className={`fog-node fog-node--owner ${activeStage === 0 || activeStage === 5 ? 'is-active' : ''}`} type="button" onClick={() => selectStage(activeStage === 5 ? 5 : 0)} onMouseEnter={() => selectStage(activeStage === 5 ? 5 : 0)}>
          <Icon name="fingerprint" /><small>DATA OWNER</small><strong>数据拥有者</strong><span>明文不离开本地</span>
        </button>
        <button className={`fog-node fog-node--chain ${activeStage === 0 || activeStage === 1 || activeStage === 4 || activeStage === 5 ? 'is-active' : ''}`} type="button" onClick={() => selectStage(activeStage === 4 ? 4 : 1)} onMouseEnter={() => selectStage(activeStage === 4 ? 4 : 1)}>
          <Icon name="chain" /><small>ACVM CHAIN</small><strong>调度与记账</strong><span>只保存承诺和证明</span>
        </button>
        <button className={`fog-node fog-node--worker ${activeStage === 1 || activeStage === 2 ? 'is-active' : ''}`} type="button" onClick={() => selectStage(2)} onMouseEnter={() => selectStage(2)}>
          <Icon name="brain" /><small>FOG WORKERS</small><strong>a3s-power 推理</strong><span>机构 · 企业 · 边缘节点</span>
        </button>
        <button className={`fog-node fog-node--validator ${activeStage === 3 ? 'is-active' : ''}`} type="button" onClick={() => selectStage(3)} onMouseEnter={() => selectStage(3)}>
          <Icon name="shield" /><small>FOG VALIDATORS</small><strong>独立核验委员会</strong><span>证明 · 抽检 · 门限签名</span>
        </button>
        <div className="fog-mini-nodes" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      </div>

      <nav className="fog-stage-nav" aria-label="选择雾计算隐私推理步骤">
        {stages.map((stage, index) => (
          <button
            type="button"
            className={activeStage === index ? 'is-active' : ''}
            aria-pressed={activeStage === index}
            onClick={() => selectStage(index)}
            key={stage.code}
          >
            <span>{stage.code}</span><strong>{stage.title}</strong>
          </button>
        ))}
      </nav>

      <footer className="fog-terms">
        <span>原始数据不写链、不广播、不过雾节点持久层</span>
        <div><TechTerm term="TEE" /><TechTerm term="Remote Attestation" /><TechTerm term="Receipt Root" /></div>
      </footer>
    </div>
  );
}
