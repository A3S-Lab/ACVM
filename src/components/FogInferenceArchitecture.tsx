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
    title: '提交推理任务',
    actor: '数据拥有者 → 调度合约',
    detail: '用户签名模型版本、预算、截止时间和披露范围。原始输入不上传。',
    record: 'Intent Hash · Model Hash · Privacy Policy · Nonce',
    icon: 'fingerprint',
  },
  {
    code: '02',
    title: '分配雾节点',
    actor: '调度合约 → 雾节点',
    detail: '调度合约按延迟、地域、硬件证明、价格和可用资源选择节点。',
    record: 'Lease ID · Node DID · Capability Proof · SLA',
    icon: 'chain',
  },
  {
    code: '03',
    title: 'Worker 运行模型',
    actor: '雾节点 Worker',
    detail: 'a3s-box 解封输入，a3s-power 加载指定模型。完成后删除明文上下文。',
    record: 'Input Commitment · Output Commitment · Runtime Measurement',
    icon: 'brain',
  },
  {
    code: '04',
    title: 'Validator 验收',
    actor: '独立 Validator 节点',
    detail: 'Validator 检查模型哈希、远程证明、输出约束和 SLA。不通过则返回拒绝回执。',
    record: 'Validator Receipts · Attestation · Threshold Signature',
    icon: 'shield',
  },
  {
    code: '05',
    title: '提交链上记录',
    actor: 'Validator → 区块链共识节点',
    detail: '共识节点验证回执、证明和状态根，不重新执行模型。',
    record: 'Receipt Root · Proof · State Root · Finality',
    icon: 'receipt',
  },
  {
    code: '06',
    title: '返回推理结果',
    actor: 'ACVM 合约 → 授权接收方',
    detail: '结果只发给授权接收方。随后关闭租约、撤销临时密钥并清理节点缓存。',
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
          summary="链上用这些字段把本步骤接到同一个 taskId。必要字段缺失时，状态不会推进。"
          details={[
            { label: '查记录', value: '用 taskId、合约版本和前序状态根可以按顺序查到每一份回执。' },
            { label: '不写链', value: '原始输入、模型文件和完整推理上下文不会写入区块。' },
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
          <Icon name="shield" /><small>FOG VALIDATORS</small><strong>独立 Validator</strong><span>证明 · 抽检 · 门限签名</span>
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
        <span>链上不保存原始输入；雾节点不持久化明文</span>
        <div><TechTerm term="TEE" /><TechTerm term="Remote Attestation" /><TechTerm term="Receipt Root" /></div>
      </footer>
    </div>
  );
}
