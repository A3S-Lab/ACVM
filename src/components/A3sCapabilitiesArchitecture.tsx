import { AsciiFlowControls, type BusinessProcessStage } from './BusinessProcessFlow';
import { LearningPanel } from './LearningPanel';
import { useStepPlayback } from './useStepPlayback';
import { WorkflowFormula, WorkflowTerm } from './WorkflowHint';

const boxFlowStages = [
  { index: '01', label: '构建镜像', actor: 'a3s-code Framework', action: '把智能体逻辑、依赖、策略和能力声明构建为发布包', detail: 'agent.yaml、锁定依赖、入口和 capability refs 一起形成可签名、可复现的 AgentBundle。', input: 'Agent Source + agent.yaml', output: 'AgentBundle + imageRoot', state: 'SOURCE → BUILT', icon: 'terminal', tone: 'violet' },
  { index: '02', label: '加密发布', actor: 'a3s-code Publisher', action: '加密智能体镜像并发布内容根', detail: '镜像仓库只保存密文，ANS 服务卡和 ACVM 任务只引用 imageRoot，不公开智能体代码。', input: 'AgentBundle + ImageKey', output: 'AgentImage.enc + imageRoot', state: 'BUILT → PUBLISHED', icon: 'lock', tone: 'violet' },
  { index: '03', label: '证明环境', actor: 'a3s-box + TEE', action: '核验雾节点硬件、代码度量和随机挑战', detail: '远程证明必须匹配 FogLease、镜像策略和允许的运行时版本，失败时不会释放 ImageKey。', input: 'FogLease + TEE Quote + nonce', output: 'AttestationOK', state: 'PUBLISHED → ATTESTED', icon: 'shield', tone: 'violet' },
  { index: '04', label: 'TEE 内解密', actor: 'a3s-box Runtime', action: '在可信内存释放密钥并启动智能体', detail: '宿主机、调度器和镜像仓库看不到明文；a3s-box 锁定网络、存储、资源和临时卷策略。', input: 'AgentImage.enc + ImageKey', output: 'Running Agent Runtime', state: 'ATTESTED → RUNNING', icon: 'key', tone: 'violet' },
  { index: '05', label: '能力热插拔', actor: 'a3s-use', action: '远程拉取、验签并挂载授权能力', detail: 'a3s-use 只加载 capabilityRoot 中声明的模型、工具和数据连接器版本，并注入本任务的最小权限令牌。', input: 'capabilityRoot + CapabilityTokens', output: 'Mounted Remote Capabilities', state: 'RUNNING → CAPABLE', icon: 'chain', tone: 'green' },
  { index: '06', label: '执行与封存', actor: 'a3s-box Lifecycle', action: '完成任务、签发隐私回执并清零敏感内存', detail: '结果绑定 imageRoot、capabilityRoot、输入输出根和事件链；正常结束销毁临时卷，故障恢复仍沿用原策略。', input: 'Agentic Task + Mounted Capabilities', output: 'Result + πpriv + SEALED', state: 'CAPABLE → SEALED', icon: 'receipt', tone: 'green' },
] as const satisfies readonly BusinessProcessStage[];

export function A3sBoxCapabilitiesArchitecture() {
  const { rootRef, activeStep, isPlaying, selectStep, togglePlayback } = useStepPlayback(boxFlowStages.length, 3000);
  const current = boxFlowStages[activeStep];

  return (
    <div className="box-ascii-shell" ref={rootRef}>
      <LearningPanel code="A3S / 加密智能体执行终端" status="a3s-code 构建 · a3s-box 解密 · a3s-use 热插拔" className="a3s-box-capability box-ascii-panel principle-panel">
        <AsciiFlowControls stages={boxFlowStages} activeStep={activeStep} isPlaying={isPlaying} onSelect={selectStep} onToggle={togglePlayback} ariaLabel="a3s-code 构建并加密智能体，a3s-box 完成 TEE 证明与解密，a3s-use 热插拔远程能力，最后执行并封存证据的六步流程" />
        <div className={`box-ascii-terminal ascii-workflow-canvas is-stage-${activeStep + 1}`} key={current.index}>
          <header><code>$ a3s-box run task-2048 --image 0xIMG --caps 0xCAP --tee required</code><span>NODE SH-07</span></header>
          <div className="box-ascii-log" aria-label="从 a3s-code 构建到 a3s-box 在 TEE 内解密、a3s-use 热插拔能力并封存证据的运行日志">
            <span className="is-line-1"><b>[01 构建]</b><code><WorkflowTerm term="a3sCode" label="a3s-code" /> build agent.yaml + src + capabilities.lock</code><em><WorkflowTerm term="imageRoot" /> ✓</em></span>
            <span className="is-line-2"><b>[02 加密]</b><code>seal AgentBundle → <WorkflowTerm term="AgentImage" /></code><em>密文 ✓</em></span>
            <span className="is-line-3"><b>[03 证明]</b><code>verify TEE quote + runtimeRoot + FogLease + nonce</code><em><WorkflowTerm term="Attestation" label="证明" /> ✓</em></span>
            <span className="is-line-4"><b>[04 解密]</b><code>release ImageKey → decrypt inside trusted memory</code><em>运行时 ✓</em></span>
            <span className="is-line-5"><b>[05 挂载]</b><code><WorkflowTerm term="a3sUse" label="a3s-use" /> mount model.infer + crm.read + tools</code><em><WorkflowTerm term="capabilityRoot" /> ✓</em></span>
            <span className="is-line-6"><b>[06 运行]</b><code>task → resultRoot + πpriv → zeroize keys / volume</code><em>已封存 ✓</em></span>
          </div>
          <div className="box-ascii-boundary">
            <section className="ascii-workflow-node">
              <small>[ a3s-box / <WorkflowTerm term="TEE" /> / <WorkflowTerm term="taskId" label="task-2048" /> ]</small>
              <strong><WorkflowTerm term="AgentImage" label="Encrypted Agent" /> → Agent Runtime</strong>
              <code><WorkflowTerm term="a3sUse" label="a3s-use" />: model.infer@v8 · crm.read@v3 · tool.search@v5</code>
            </section>
            <div><span>镜像密钥</span><i>──▶</i><b>[AttestationOK 后释放]</b><span>能力令牌</span><i>──▶</i><b>[按 taskId 与 scope 注入]</b></div>
          </div>
          <footer><code>状态 / {current.state} / {current.output}</code></footer>
        </div>
        <footer className="business-process-footer"><span><small>当前事件</small><code>{current.label} → {current.output}</code></span><strong>宿主机看不到镜像、密钥、输入和远程能力令牌明文</strong></footer>
      </LearningPanel>
    </div>
  );
}

const powerFlowStages = [
  { index: '01', label: '证明可信环境', actor: 'a3s-power + TEE', action: '先完成远程证明，再建立加密会话', detail: '调用方核对 SEV-SNP 或 TDX 硬件状态和运行程序摘要，确认环境可信后才发送密钥。', input: '任务策略 + attestation nonce', output: '已核验安全会话', state: 'UNTRUSTED → ATTESTED', icon: 'shield', tone: 'violet' },
  { index: '02', label: '保护输入', actor: 'TEE 内部执行器', action: '在受保护内存中解密任务输入', detail: '原始数据和模型密钥只在可信边界内短暂可见，宿主机和外部调度器不能读取。', input: '加密输入 + 密封密钥', output: 'TEE 内受保护张量', state: 'ATTESTED → READY', icon: 'lock', tone: 'violet' },
  { index: '03', label: '载入当前层', actor: '参数流式加载器', action: '只把当前层或 MoE 命中专家参数载入可信内存', detail: 'Dense 模型加载正在计算的一层；MoE 模型只加载路由器选中的 Top-k 专家分片，其余参数继续加密存放。', input: '加密 Layer n / Active Experts', output: '可信内存中的当前参数', state: 'READY → LAYER_LOADED', icon: 'brain', tone: 'violet' },
  { index: '04', label: '计算并释放', actor: '流式推理执行器', action: '完成 Layer n 计算后立即清零并载入下一层', detail: '激活值继续向下传递，参数按层进入和释放，使峰值可信内存接近单层规模。', input: '激活值 n−1 + Layer n', output: '激活值 n + 已释放 Layer n', state: 'LAYER_LOADED → NEXT_LAYER', icon: 'spark', tone: 'green' },
  { index: '05', label: '输出与收尾', actor: 'a3s-power', action: '加密输出结果、签发执行回执并清零敏感内存', detail: '回执绑定模型版本、执行策略、输入摘要和输出摘要，供 ACVM 后续验收。', input: '最终激活值 + 执行事件链', output: '加密结果 + ExecReceipt', state: 'NEXT_LAYER → SEALED', icon: 'receipt', tone: 'green' },
] as const satisfies readonly BusinessProcessStage[];

export function A3sPowerCapabilitiesArchitecture() {
  const { rootRef, activeStep, isPlaying, selectStep, togglePlayback } = useStepPlayback(powerFlowStages.length, 3200);
  const current = powerFlowStages[activeStep];

  return (
    <div className="power-ascii-shell" ref={rootRef}>
      <LearningPanel code="a3s-power / 参数按层流入可信内存" status="a3s-use 挂载模型能力 · TEE 内隐私推理" className="a3s-power-capability power-ascii-panel principle-panel">
        <AsciiFlowControls stages={powerFlowStages} activeStep={activeStep} isPlaying={isPlaying} onSelect={selectStep} onToggle={togglePlayback} ariaLabel="a3s-power 从可信环境证明到保护输入、逐层加载模型参数、计算释放和输出回执的五步流程" />
        <div className={`power-ascii-pipeline ascii-workflow-canvas is-stage-${activeStep + 1}`} key={current.index}>
          <header><code>┌─ <WorkflowTerm term="a3sUse" label="a3s-use:model.infer@v8" /> / <WorkflowTerm term="TEE" /> attestation ✓ / <WorkflowTerm term="modelRoot" /> 0xA3S ──┐</code></header>
          <div className="power-ascii-memory">
            <section className="is-store ascii-workflow-node">
              <small>[ 加密模型存储 ]</small>
              {['Layer 17', 'Layer 18', 'Layer 19', 'Layer 20'].map((layer, index) => <span className={index === 1 ? 'is-current' : ''} key={layer}><b>{layer}</b><i>ENC</i></span>)}
            </section>
            <div className="power-ascii-loader"><code>按需解密</code><i aria-hidden="true">────◆────▶</i><code>完成即清零</code><i aria-hidden="true">◀── ZEROIZE ──</i></div>
            <section className="is-tee ascii-workflow-node">
              <small>[ <WorkflowTerm term="TEE" /> 可信内存 / 单层槽位 ]</small>
              <strong>Layer 18</strong>
              <WorkflowFormula formula="Activation₁₇ × W₁₈ → Activation₁₈" title="单层前向计算" summary="当前激活值只与正在使用的 Layer 18 参数相乘；计算完成后参数立即清零，激活值继续传给下一层。" />
              <b>{activeStep === 3 ? 'COMPUTE → RELEASE' : activeStep >= 4 ? 'RELEASED' : 'READY'}</b>
            </section>
            <div className="power-ascii-activation"><code>Activation₁₇</code><i>──▶</i><code>Activation₁₈</code><i>──▶</i><code>下一层</code></div>
          </div>
          <div className="power-ascii-result"><span className="ascii-workflow-node">[加密输入]</span><i>── <WorkflowTerm term="TEE" /> ──▶</i><strong className="ascii-workflow-node">[加密结果 + <WorkflowTerm term="ExecReceipt" />]</strong><WorkflowFormula formula="PeakTrustedMemory ≈ OneLayer" title="可信内存峰值" summary="模型参数按层进入和释放，可信内存峰值接近单层参数、激活值和运行时开销之和，而不是完整模型大小。" /></div>
          <footer><code>└─ 当前 / {current.label} / {current.state} / {current.output} ───────┘</code></footer>
        </div>
        <footer className="business-process-footer"><span><small>当前产出</small><code>{current.output}</code></span><strong>流式加载的是模型参数层，不是 Token SSE</strong></footer>
      </LearningPanel>
    </div>
  );
}
