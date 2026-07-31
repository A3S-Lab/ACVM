import { useState } from 'react';
import { Icon } from './Icons';
import { TechTerm } from './TechTerm';

type DeployMode = 'coprocessor' | 'native' | 'appchain';

const deploymentModes: Array<{
  key: DeployMode;
  label: string;
  fit: string;
  title: string;
  detail: string;
  path: [string, string, string, string];
  replaces: string;
  keeps: string;
}> = [
  {
    key: 'coprocessor',
    label: '链外协处理器',
    fit: '适配任意现有链',
    title: 'ACVM 作为可验证执行协处理器',
    detail: '链上合约负责触发与锁定规则；ACVM 在企业网络中运行长期任务，再把 Receipt Root、证明和终局请求交回链上验证合约。',
    path: ['链上触发器', 'ACVM Runtime', 'Proof Verifier', '联盟链终局'],
    replaces: '替代 Oracle 上报一个 result=true 的黑盒方式',
    keeps: '保留原链共识、权限治理、账本和现有业务合约',
  },
  {
    key: 'native',
    label: '原生执行器',
    fit: '可控联盟链内核',
    title: 'ACVM 成为联盟链的 Agentic Contract 执行器',
    detail: '支持扩展执行引擎的网络将 Agentic Contract 交易路由到 ACVM；节点验证确定性状态根与证明，EVM/WASM 继续处理普通确定性合约。',
    path: ['交易路由', 'ACVM Executor', 'State / Proof Check', '共识提交'],
    replaces: '替代复杂链外任务原本勉强塞入 EVM 的执行语义',
    keeps: '不替换共识、P2P、成员管理、国密体系与账本存储',
  },
  {
    key: 'appchain',
    label: 'ACVM 应用链',
    fit: '大规模 Agentic Contract',
    title: '专用执行网络承载 Agentic Contract',
    detail: 'ACVM 节点组成专用执行与证明网络，负责调度、递归证明聚合和争议重放；状态根通过轻客户端证明锚定到多个机构联盟链。',
    path: ['业务联盟', 'ACVM Network', 'Recursive Proof', 'Light-client Anchor'],
    replaces: '替代每条业务链各自重复建设 Agent 运行时',
    keeps: '各行业链仍拥有自己的成员准入、数据边界与最终审计权',
  },
];

const targets = [
  ['BSN', '跨底层框架的部署与运维环境'],
  ['FISCO BCOS', '企业 CA、权限治理与国密链路'],
  ['长安链', '国产联盟链与可插拔执行环境'],
  ['Fabric', '通道、组织 MSP 与企业账本'],
  ['企业 EVM', '保留 Solidity 资产与业务合约'],
] as const;

export function ChainArchitecture() {
  const [mode, setMode] = useState<DeployMode>('coprocessor');
  const current = deploymentModes.find((item) => item.key === mode)!;

  return (
    <div className="chain-architecture">
      <div className="chain-mode-tabs" role="tablist" aria-label="ACVM 多链部署方式">
        {deploymentModes.map((item) => (
          <button
            type="button"
            role="tab"
            key={item.key}
            aria-selected={mode === item.key}
            className={mode === item.key ? 'is-active' : ''}
            onClick={() => setMode(item.key)}
          >
            <strong>{item.label}</strong>
            <small>{item.fit}</small>
          </button>
        ))}
      </div>

      <div className="chain-mode-canvas" aria-live="polite">
        <header>
          <span>DEPLOYMENT MODE</span>
          <h3>{current.title}</h3>
          <p>{current.detail}</p>
        </header>
        <div className="deployment-path">
          {current.path.map((node, index) => (
            <span key={node} className={index === 1 ? 'is-acvm' : index === current.path.length - 1 ? 'is-ledger' : ''}>
              <i>{index === 1 ? 'AC' : index + 1}</i>
              <strong>{node}</strong>
              {index < current.path.length - 1 ? <em><Icon name="arrow" /></em> : null}
            </span>
          ))}
        </div>
        <footer>
          <div><Icon name="bolt" /><span><small>ACVM 替换什么</small><strong>{current.replaces}</strong></span></div>
          <div><Icon name="chain" /><span><small>区块链保留什么</small><strong>{current.keeps}</strong></span></div>
        </footer>
      </div>

      <div className="adapter-layer">
        <header><span>CHAIN ADAPTER ABI</span><strong>统一执行语义，映射不同链的身份、交易、证明与终局</strong></header>
        <div>
          <section>
            <small>IDENTITY ADAPTER</small>
            <strong className="adapter-term-list"><TechTerm term="DID / VC" /><TechTerm term="FROST" /></strong>
            <p>选择性披露主体资格，高风险动作使用门限签名</p>
          </section>
          <section>
            <small>EVENT ADAPTER</small>
            <strong className="adapter-term-list"><TechTerm term="Intent-centric" /></strong>
            <p>把业务意图和链上交易映射为 Trigger、Event、Callback 与执行回执</p>
          </section>
          <section>
            <small>PROOF ADAPTER</small>
            <strong className="adapter-term-list"><TechTerm term="IVC" /><TechTerm term="Remote Attestation" /><TechTerm term="Receipt Root" /></strong>
            <p>按链能力选择递归证明、预编译或验证合约</p>
          </section>
          <section>
            <small>FINALITY ADAPTER</small>
            <strong className="adapter-term-list"><TechTerm term="Light Client" /></strong>
            <p>验证跨链共识证明、写入高度与不可逆业务终局</p>
          </section>
        </div>
      </div>

      <div className="chain-targets" aria-label="国内及企业链部署环境">
        {targets.map(([name, detail]) => (
          <span key={name}>
            <i><Icon name="chain" /></i>
            <strong>{name}</strong>
            <small>{detail}</small>
          </span>
        ))}
      </div>
    </div>
  );
}
