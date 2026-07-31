import { useId } from 'react';

export const techNotes = {
  'zkTLS / TLSNotary': '像给 HTTPS 响应加一张可验证的收据：证明某个网站或 API 确实返回过这段数据，但不必公开完整响应和登录凭据。',
  'Proof-carrying Execution': '执行结果自己携带证据。接收方不需要相信执行者，只需验证状态承诺、工具回执和证明是否一致。',
  TEE: '芯片提供的隔离加密空间。模型和敏感数据在这个“硬件保险箱”里运行，宿主机也不能直接读取。',
  MPC: '多家机构共同完成一次计算，但任何一家都看不到其他参与方的原始数据。',
  FHE: '直接在密文上计算，计算方不需要先解密；适合极敏感数据，但目前计算成本较高。',
  IVC: '任务每完成一步，就把这一步的正确性证明累加到已有证明中，特别适合运行数月的长期任务。',
  'Recursive ZK': '用一个零知识证明去验证许多子证明，最终把大量执行过程压缩成一个链上可快速验证的证明。',
  Folding: '把新一步计算的约束折叠进一个持续更新的证明状态，避免每个里程碑都从头证明。',
  'DID / VC': '可验证的数字身份和凭证。机构能签发、撤销和核验 Agent 的资质，而不只依赖一个钱包地址。',
  'Selective Disclosure': '只证明“符合条件”，不公开完整凭据。例如证明持有某类牌照，但不暴露内部评分和人员台账。',
  FROST: '一种高效门限签名。只有达到约定数量的授权方共同同意，敏感操作或资金状态转移才能生效。',
  'Light Client': '不运行完整区块链节点，只验证区块头和共识证明，就能确认另一条链上的事实。',
  'Intent-centric': '发布方声明要达成什么以及不能越过哪些边界，由 ACVM 选择执行路径并用证据交付结果。',
  'UCAN / ZCAP': '可委托、可缩小、可过期的能力凭证。Agent 只拿到完成当前步骤所需的最小权限。',
  'Receipt Root': '把大量执行回执组织成 Merkle Root。链上只保存一个短承诺，仍可单独验证任意一条回执。',
  'Remote Attestation': '由可信硬件签名证明：指定代码和模型确实运行在未被篡改的隔离环境中。',
} as const;

export type TechKey = keyof typeof techNotes;

export function TechTerm({
  term,
  label,
}: {
  term: TechKey;
  label?: string;
}) {
  const tooltipId = useId();

  return (
    <span className="tech-term" tabIndex={0} aria-describedby={tooltipId}>
      <span>{label ?? term}</span>
      <i aria-hidden="true">?</i>
      <span className="tech-term-tooltip" role="tooltip" id={tooltipId}>
        <small>PLAIN-LANGUAGE NOTE</small>
        <strong>{term}</strong>
        <p>{techNotes[term]}</p>
      </span>
    </span>
  );
}
