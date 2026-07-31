import { useState } from 'react';
import { Icon, type IconName } from './Icons';

type RuntimeNode = {
  code: string;
  name: string;
  icon: IconName;
  input: string;
  inside: string;
  output: string;
  boundary: string;
};

const runtimeNodes: RuntimeNode[] = [
  {
    code: '01',
    name: 'Contract Loader / IR',
    icon: 'terminal',
    input: '签名 Package、Schema 与版本',
    inside: '校验 Manifest，解析目标、参与方、状态、事件、工具类型和验收谓词，生成可执行 IR。',
    output: '不可变 Contract Instance',
    boundary: '不执行模型推理，也不替代组织身份注册。',
  },
  {
    code: '02',
    name: 'State Machine & Scheduler',
    icon: 'bolt',
    input: '事件、计时器、上一步状态根',
    inside: '推进长期状态机，管理等待、超时、重试、人工审批和检查点；每次转移都绑定输入事件。',
    output: '下一可运行步骤 + State Root',
    boundary: '不负责联盟链共识；它只计算合约状态。',
  },
  {
    code: '03',
    name: 'Progressive Tool Bridge',
    icon: 'key',
    input: '当前目标、能力范围、工具 Schema',
    inside: '按 list → describe → dry-run → execute 发现企业 API，把短期授权绑定到合约、工具、参数和时限。',
    output: 'Typed Result + Signed Tool Receipt',
    boundary: '不持有长期万能密钥，也不允许 Agent 枚举无关 API。',
  },
  {
    code: '04',
    name: 'Policy Enforcement',
    icon: 'shield',
    input: 'Manifest 策略、预算、AnySentry 决定',
    inside: '检查身份、范围、资金、副作用与风险信号，把 ALLOW、APPROVAL 或 BLOCK 落实为状态转移。',
    output: '可追责的控制结果',
    boundary: 'AnySentry 判断风险；ACVM 负责让决定真正生效。',
  },
  {
    code: '05',
    name: 'Receipt / Proof Builder',
    icon: 'receipt',
    input: '状态承诺、工具回执、证明与控制决定',
    inside: '聚合可验证执行事实，构造结算凭证、长期完成证明和链适配器所需的公共输入。',
    output: 'Receipt Root + Proof',
    boundary: '不上链保存原始业务数据、提示词或企业内部台账。',
  },
];

function RuntimeView() {
  const [selected, setSelected] = useState(0);
  const current = runtimeNodes[selected];

  return (
    <div className="acvm-runtime-view">
      <div className="contract-package">
        <header><span>AGENTICCONTRACT PACKAGE</span><strong>发布一次，责任和规则同时固定</strong></header>
        <div>
          <span><Icon name="terminal" /><strong>Manifest</strong><small>目标 · 状态 · 参与方</small></span>
          <span><Icon name="fingerprint" /><strong>Identity / Capability</strong><small>主体绑定 · πcap</small></span>
          <span><Icon name="shield" /><strong>Policy</strong><small>工具 · 数据 · 预算边界</small></span>
          <span><Icon name="check" /><strong>Acceptance Rule</strong><small>验收 · 结算 · 争议分支</small></span>
        </div>
      </div>

      <div className="architecture-downlink"><i /><span>LOAD SIGNED PACKAGE</span><i /></div>

      <div className="runtime-kernel">
        <header>
          <span><i /> ACVM RUNTIME</span>
          <strong>事件驱动、可暂停、可恢复、可证明</strong>
        </header>
        <div className="runtime-node-row">
          {runtimeNodes.map((node, index) => (
            <button
              type="button"
              key={node.code}
              className={selected === index ? 'is-active' : ''}
              onClick={() => setSelected(index)}
              aria-current={selected === index ? 'step' : undefined}
            >
              <span>{node.code}</span>
              <Icon name={node.icon} />
              <strong>{node.name}</strong>
            </button>
          ))}
        </div>
        <div className="runtime-node-detail" aria-live="polite">
          <div><small>INPUT</small><strong>{current.input}</strong></div>
          <div className="is-main"><small>INSIDE</small><p>{current.inside}</p></div>
          <div><small>OUTPUT</small><strong>{current.output}</strong></div>
          <aside><Icon name="lock" /><span><small>职责边界</small>{current.boundary}</span></aside>
        </div>
      </div>

      <div className="runtime-ports">
        <div>
          <small>EXTERNAL EXECUTION</small>
          <span>a3s-box</span><span>a3s-power</span><span>AnySentry</span>
        </div>
        <i><Icon name="arrow" /></i>
        <div>
          <small>ENTERPRISE CAPABILITIES</small>
          <span>Progressive API</span><span>Zero Trust Gateway</span><span>短期凭据</span>
        </div>
        <i><Icon name="arrow" /></i>
        <div>
          <small>FINALITY</small>
          <span>Chain Adapter</span><span>Consensus</span><span>Audit Ledger</span>
        </div>
      </div>
    </div>
  );
}

const identityLinks = [
  {
    code: 'ORG',
    title: '企业或个人责任主体',
    detail: '企业 CA / 国密证书 / DID / 法定授权',
    output: 'principal commitment',
  },
  {
    code: 'AGENT',
    title: '唯一 Agent 实例',
    detail: '主体签发的 Agent Key + 设备或 TEE 度量',
    output: 'agent instance id',
  },
  {
    code: 'AC',
    title: 'AgenticContract 实例',
    detail: 'Manifest Hash + 发布者签名 + 版本与撤销状态',
    output: 'contract instance id',
  },
  {
    code: 'SESSION',
    title: '一次工具会话',
    detail: '绑定 tool、args hash、scope、expiry 的短期授权',
    output: 'ephemeral grant',
  },
];

function IdentityView() {
  return (
    <div className="identity-architecture">
      <div className="identity-chain">
        <header>
          <span>RESPONSIBILITY CHAIN</span>
          <strong>唯一身份不是一个钱包地址，而是一条可撤销的责任绑定。</strong>
        </header>
        <div>
          {identityLinks.map((link, index) => (
            <section key={link.code}>
              <i>{link.code}</i>
              <strong>{link.title}</strong>
              <p>{link.detail}</p>
              <small>{link.output}</small>
              {index < identityLinks.length - 1 ? <em><Icon name="arrow" /></em> : null}
            </section>
          ))}
        </div>
        <footer>
          <Icon name="fingerprint" />
          <p><strong>ACVM 每次调用都重新验证整条绑定</strong><span>主体有效 · Agent 未撤销 · 合约版本一致 · 会话未过期 · 请求参数未被替换</span></p>
        </footer>
      </div>

      <div className="capability-proof">
        <header><span>ZERO-KNOWLEDGE CAPABILITY PROOF</span><strong>证明“有资格”，不公开资格底牌。</strong></header>
        <div className="zk-proof-flow">
          <section className="is-private">
            <small>PRIVATE WITNESS</small>
            <strong>企业内部凭据</strong>
            <ul>
              <li>岗位、牌照与签发链</li>
              <li>模型评测与能力分数</li>
              <li>工具授权台账与撤销记录</li>
            </ul>
          </section>
          <i><Icon name="arrow" /></i>
          <section className="is-circuit">
            <small>ZK CIRCUIT</small>
            <strong>只验证约束</strong>
            <ul>
              <li>签发者可信且凭据未撤销</li>
              <li>能力等级达到合约阈值</li>
              <li>请求范围是授权范围子集</li>
            </ul>
          </section>
          <i><Icon name="arrow" /></i>
          <section className="is-public">
            <small>PUBLIC OUTPUT</small>
            <strong>πcap</strong>
            <ul>
              <li>主体承诺与能力类别</li>
              <li>Scope Hash 与有效窗口</li>
              <li>proof = valid / invalid</li>
            </ul>
          </section>
        </div>
        <footer>
          <span><Icon name="eye" /> 验证方能看到</span>
          <strong>主体、能力类别、范围、有效期和证明</strong>
          <span><Icon name="lock" /> 验证方看不到</span>
          <strong>内部评分、模型细节、人员台账与原始凭据</strong>
        </footer>
      </div>
    </div>
  );
}

export function AcvmArchitecture() {
  const [view, setView] = useState<'runtime' | 'identity'>('runtime');

  return (
    <div className="acvm-architecture">
      <div className="architecture-tabs" role="tablist" aria-label="ACVM 架构视图">
        <button type="button" role="tab" aria-selected={view === 'runtime'} className={view === 'runtime' ? 'is-active' : ''} onClick={() => setView('runtime')}>
          <Icon name="terminal" /> 执行内核
        </button>
        <button type="button" role="tab" aria-selected={view === 'identity'} className={view === 'identity' ? 'is-active' : ''} onClick={() => setView('identity')}>
          <Icon name="fingerprint" /> 身份与能力证明
        </button>
      </div>
      {view === 'runtime' ? <RuntimeView /> : <IdentityView />}
    </div>
  );
}
