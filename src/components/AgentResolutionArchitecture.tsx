const leftServices = [
  { x: 225, y: 84, label: 'GEO' },
  { x: 346, y: 215, label: '诊断' },
  { x: 225, y: 346, label: '模拟' },
  { x: 104, y: 215, label: '雾计算' },
] as const;

const rightServices = leftServices.map((service) => ({ ...service, x: service.x + 450 }));

const meshEdges = leftServices.flatMap((from, fromIndex) =>
  leftServices.slice(fromIndex + 1).map((to, edgeIndex) => ({
    from,
    to,
    key: `${fromIndex}-${fromIndex + edgeIndex + 1}`,
  })),
);

export function AgentResolutionArchitecture() {
  return (
    <div className="diagram-panel ans-panel ans-panel-simple principle-panel ans-principle-panel">
      <header className="panel-chrome">
        <span><i /><i /><i /></span>
        <code>ANS / 签名服务发现</code>
        <strong><i /> 实时核验服务记录</strong>
      </header>

      <div className="principle-canvas ans-principle-canvas">
        <svg className="principle-svg ans-principle-svg" viewBox="0 0 900 430" role="img" aria-labelledby="ans-principle-title ans-principle-desc">
          <title id="ans-principle-title">ANS 服务发现原理</title>
          <desc id="ans-principle-desc">左侧服务逐一互联，右侧服务通过签名 ANS 记录完成统一发现、身份核验和能力解析。</desc>

          <path className="ans-divider" d="M450 24V406" />
          <text className="principle-section-title" x="225" y="28" textAnchor="middle">点对点直连</text>
          <text className="principle-section-title" x="675" y="28" textAnchor="middle">签名服务目录</text>

          <circle className="ans-orbit" cx="225" cy="215" r="139" />
          <g className="ans-mesh" aria-hidden="true">
            {meshEdges.map(({ from, to, key }) => (
              <line className="ans-mesh-line" x1={from.x} y1={from.y} x2={to.x} y2={to.y} key={key} />
            ))}
          </g>
          <g className="ans-service-nodes is-legacy">
            {leftServices.map((service) => (
              <g transform={`translate(${service.x} ${service.y})`} key={service.label}>
                <circle r="9" />
                <text className="principle-node-label" textAnchor="middle" y="-17">{service.label}</text>
              </g>
            ))}
          </g>
          <text className="principle-metric" x="225" y="403" textAnchor="middle">4 个服务需要 6 条定制连接</text>

          <circle className="ans-orbit" cx="675" cy="215" r="139" />
          <g className="ans-hub-links" aria-hidden="true">
            {rightServices.map((service, index) => (
              <path className={`ans-hub-line is-route-${index + 1}`} d={`M${service.x} ${service.y}Q675 ${service.y} 675 215`} key={service.label} />
            ))}
          </g>
          <g className="ans-service-nodes is-resolved">
            {rightServices.map((service) => (
              <g transform={`translate(${service.x} ${service.y})`} key={service.label}>
                <circle r="9" />
                <text className="principle-node-label" textAnchor="middle" y="-17">{service.label}</text>
              </g>
            ))}
          </g>

          <g className="ans-core" transform="translate(675 215)">
            <rect x="-65" y="-44" width="130" height="88" rx="5" />
            <text className="principle-kicker" textAnchor="middle" y="-18">签名服务卡</text>
            <text className="principle-core-title" textAnchor="middle" y="8">ANS</text>
            <text className="principle-detail" textAnchor="middle" y="29">身份 · 能力 · 地址</text>
          </g>
          <text className="principle-metric is-good" x="675" y="403" textAnchor="middle">一个目录入口 · 调用前核验</text>
        </svg>
      </div>

      <footer className="principle-statusbar ans-principle-statusbar">
        <code>名称 → 身份 → 能力 → 服务地址</code>
        <span>签名 · 有效期 · 撤销状态</span>
      </footer>
    </div>
  );
}
