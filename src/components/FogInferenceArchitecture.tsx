import { useEffect, useRef, useState } from 'react';
import { AsciiGlobe } from './AsciiGlobe';
import { Icon, type IconName } from './Icons';

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
    title: '提交推理任务',
    actor: '数据拥有者 → 调度合约',
    detail: '用户签名模型版本、预算、截止时间和披露范围；原始输入不上传。',
    record: 'Intent Hash · Model Hash · Privacy Policy · Nonce',
    icon: 'fingerprint',
  },
  {
    code: '02',
    title: '分配雾节点',
    actor: '调度合约 → 雾节点',
    detail: 'ACVM 按延迟、地域、硬件证明、价格和可用资源选择节点。',
    record: 'Lease ID · Node DID · Capability Proof · SLA',
    icon: 'chain',
  },
  {
    code: '03',
    title: 'Worker 运行模型',
    actor: '雾节点 Worker',
    detail: 'a3s-box 解封输入，a3s-power 加载指定模型；完成后清理明文。',
    record: 'Input Commitment · Output Commitment · Runtime Measurement',
    icon: 'brain',
  },
  {
    code: '04',
    title: 'Validator 验收',
    actor: '独立 Validator 节点',
    detail: 'Validator 检查模型哈希、远程证明、输出约束和 SLA。',
    record: 'Validator Receipts · Attestation · Threshold Signature',
    icon: 'shield',
  },
  {
    code: '05',
    title: '提交链上记录',
    actor: 'Validator → 区块链共识节点',
    detail: '共识节点验证回执、证明和状态根，不重新运行模型。',
    record: 'Receipt Root · Proof · State Root · Finality',
    icon: 'receipt',
  },
  {
    code: '06',
    title: '返回推理结果',
    actor: 'ACVM 合约 → 授权接收方',
    detail: '结果只发给授权接收方；随后关闭租约并撤销临时密钥。',
    record: 'Disclosure Receipt · Settlement · Key Revocation',
    icon: 'lock',
  },
];

const routePaths = [
  'M430 76 C548 18 724 18 842 76',
  'M842 92 C776 198 590 322 444 350',
  'M444 350 C520 286 570 226 654 214 C732 202 786 250 844 350',
  'M654 214 C730 244 788 312 844 350',
  'M844 338 C928 266 928 158 844 92',
  'M832 76 C706 158 560 166 430 88',
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
    <div className={`diagram-panel fog-inference-panel fog-stage-${activeStage + 1} ${playing ? 'is-playing' : 'is-paused'}`} ref={panelRef}>
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
        <code className="fog-record">链上记录：{current.record}</code>
      </section>

      <div className="fog-network" aria-label="区块链协调的雾计算隐私推理网络动画">
        <svg viewBox="0 0 1000 430" preserveAspectRatio="none" aria-hidden="true">
          <text className="fog-boundary-label" x="636" y="27">GLOBAL FOG MESH / DISTRIBUTED PRIVACY DOMAIN</text>
          {routePaths.map((path, index) => (
            <path className={`fog-route ${activeStage === index ? 'is-active' : ''}`} d={path} key={path} />
          ))}
          {playing ? (
            <circle className="fog-packet" r="5" key={activeStage}>
              <animateMotion dur="1.6s" path={routePaths[activeStage]} repeatCount="indefinite" />
            </circle>
          ) : null}
          <path className="fog-ledger-line" d="M281 255H421M301 272H401M321 289H381" />
        </svg>

        <AsciiGlobe running={playing && visible} activeStage={activeStage} />

        <button className={`fog-node fog-node--owner ${activeStage === 0 || activeStage === 5 ? 'is-active' : ''}`} type="button" onClick={() => selectStage(activeStage === 5 ? 5 : 0)} onMouseEnter={() => setActiveStage(activeStage === 5 ? 5 : 0)}>
          <Icon name="fingerprint" /><small>DATA OWNER</small><strong>数据拥有者</strong><span>明文不离开本地</span>
        </button>
        <button className={`fog-node fog-node--chain ${activeStage === 0 || activeStage === 1 || activeStage === 4 || activeStage === 5 ? 'is-active' : ''}`} type="button" onClick={() => selectStage(activeStage === 4 ? 4 : 1)} onMouseEnter={() => setActiveStage(activeStage === 4 ? 4 : 1)}>
          <Icon name="chain" /><small>ACVM CHAIN</small><strong>调度与记账</strong><span>只保存承诺和证明</span>
        </button>
        <button className={`fog-node fog-node--worker ${activeStage === 1 || activeStage === 2 ? 'is-active' : ''}`} type="button" onClick={() => selectStage(2)} onMouseEnter={() => setActiveStage(2)}>
          <Icon name="brain" /><small>FOG WORKERS</small><strong>a3s-power 推理</strong><span>机构 · 企业 · 边缘节点</span>
        </button>
        <button className={`fog-node fog-node--validator ${activeStage === 3 ? 'is-active' : ''}`} type="button" onClick={() => selectStage(3)} onMouseEnter={() => setActiveStage(3)}>
          <Icon name="shield" /><small>FOG VALIDATORS</small><strong>独立 Validator</strong><span>证明 · 抽检 · 门限签名</span>
        </button>
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
        <span>原始数据留在本地；所有节点都能核验回执</span>
        <div><code>TEE</code><code>REMOTE ATTESTATION</code><code>RECEIPT ROOT</code></div>
      </footer>
    </div>
  );
}
