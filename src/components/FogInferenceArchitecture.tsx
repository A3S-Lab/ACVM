export function FogInferenceArchitecture() {
  return (
    <div className="diagram-panel fog-inference-panel fog-panel-simple principle-panel fog-principle-panel">
      <header className="panel-chrome">
        <span><i /><i /><i /></span>
        <code>雾计算 / a3s-box 本地隐私边界</code>
        <strong><i /> 原始数据不离场</strong>
      </header>

      <div className="principle-canvas fog-principle-canvas">
        <svg className="principle-svg fog-principle-svg" viewBox="0 0 900 430" role="img" aria-labelledby="fog-principle-title fog-principle-desc">
          <title id="fog-principle-title">雾计算本地可信执行原理</title>
          <desc id="fog-principle-desc">原始图像、传感器和日志留在本地数据域，a3s-box 通过 MicroVM、网络策略和临时数据卷建立隔离执行边界，外部仅接收执行回执和业务结果。</desc>

          <g className="principle-grid" aria-hidden="true">
            <path d="M35 108H865M35 215H865M35 322H865" />
            <path d="M225 35V395M450 35V395M675 35V395" />
          </g>

          <g className="fog-local-domain">
            <rect className="fog-domain-boundary" x="42" y="52" width="286" height="326" rx="6" />
            <text className="principle-section-title" x="64" y="82">本地数据域</text>
            <text className="principle-detail" x="64" y="103">工厂 A / 现场节点</text>

            <g className="fog-input-node is-input-1" transform="translate(76 170)">
              <rect width="148" height="92" rx="4" />
              <text className="principle-kicker" x="18" y="29">原始数据</text>
              <text className="principle-title" x="18" y="55">只在现场使用</text>
              <text className="principle-detail" x="18" y="76">图像 · 传感器 · 日志</text>
            </g>

            <path className="fog-local-route is-route-1" d="M224 216H354" />
          </g>

          <g className="fog-worker" transform="translate(354 83)">
            <rect className="fog-worker-frame" width="228" height="264" rx="6" />
            <text className="principle-section-title" x="20" y="29">a3s-box 隔离雾节点</text>
            <text className="principle-detail" x="20" y="49">每项任务一个 MicroVM</text>

            <rect className="fog-worker-layer is-layer-1" x="22" y="76" width="184" height="42" rx="3" />
            <text className="principle-kicker" x="38" y="101">网络白名单</text>
            <rect className="fog-worker-layer is-layer-2" x="22" y="128" width="184" height="42" rx="3" />
            <text className="principle-kicker" x="38" y="153">模型与工具只读</text>
            <rect className="fog-worker-layer is-layer-3" x="22" y="180" width="184" height="42" rx="3" />
            <text className="principle-kicker" x="38" y="205">临时数据卷，结束即销毁</text>

            <circle className="fog-worker-port" cx="0" cy="132" r="5" />
            <circle className="fog-worker-port is-output" cx="228" cy="132" r="5" />
          </g>

          <path className="fog-receipt-route" d="M582 215H646" />
          <text className="principle-kicker fog-route-label" x="614" y="199" textAnchor="middle">只输出结果与回执</text>

          <g className="fog-verification" transform="translate(646 94)">
            <rect width="212" height="242" rx="6" />
            <text className="principle-section-title" x="20" y="30">外部验收</text>

            <text className="principle-kicker" x="20" y="72">执行回执</text>
            <text className="principle-title" x="20" y="96">ExecReceipt</text>
            <text className="principle-detail" x="20" y="118">证明按约运行</text>

            <path d="M20 139H192" />

            <text className="principle-kicker" x="20" y="169">业务结果</text>
            <text className="principle-title" x="20" y="193">AcceptedResult</text>
            <text className="principle-detail" x="20" y="215">证明结果达标</text>
          </g>

          <text className="principle-metric is-good" x="185" y="407" textAnchor="middle">原始数据不出域</text>
          <text className="principle-metric" x="752" y="407" textAnchor="middle">外部看结果，不看原始数据</text>
        </svg>
      </div>

      <footer className="principle-statusbar fog-principle-statusbar">
        <code>任务结束后销毁临时数据卷</code>
        <span>网络受限 · 模型只读 · 回执可核验</span>
      </footer>
    </div>
  );
}
