import { useEffect, useRef, useState, type CSSProperties } from 'react';

type LineNote = {
  title: string;
  body: string;
};

type CodeStep = {
  id: string;
  layer: string;
  filename: string;
  title: string;
  body: string;
  result: string;
  focus: [number, number];
  code: string;
  notes: Record<number, LineNote>;
};

const steps: CodeStep[] = [
  {
    id: 'manifest',
    layer: 'L01 / CONTRACT',
    filename: 'contract.ts',
    title: '先冻结合约边界',
    body: '部署前把 Worker、Validator、验收阈值和结算单价写进同一版本。两份工作负载不能临时替换。',
    result: '输出：contractRoot · workerDigest · validatorDigest',
    focus: [4, 14],
    code: `export const contract = {
  name: 'geo-outcome',
  version: 1,
  workloads: {
    worker: {
      entry: './worker.ts',
      image: 'sha256:7f31…9c20',
    },
    validator: {
      entry: './validator.ts',
      image: 'sha256:23ab…e190',
    },
  },
  predicate: { minDays: 30, minLiftPp: 8 },
  settlement: { unit: 'CNY', perLiftPp: 10_000 },
} as const;`,
    notes: {
      2: { title: 'name', body: '链上合约实例引用的稳定名称；版本变化不会覆盖旧实例。' },
      3: { title: 'version', body: 'Worker、Validator 和结算规则共同升级，避免只换执行端。' },
      4: { title: 'workloads', body: '一次部署必须给出两个独立工作负载：负责干活的 Worker 和负责验收的 Validator。' },
      6: { title: 'worker.entry', body: 'a3s-box 启动 Worker 时执行的 TypeScript 入口。' },
      7: { title: 'worker.image', body: '镜像摘要写入合约根，实际运行镜像与摘要不一致时拒绝回执。' },
      10: { title: 'validator.entry', body: 'Validator 使用另一入口和权限集合，不能复用 Worker 会话。' },
      11: { title: 'validator.image', body: '独立镜像摘要阻止执行方在验收时偷偷替换规则。' },
      14: { title: 'predicate', body: 'GEO 结果至少观察 30 天，引用份额增量至少达到 8 个百分点。' },
      15: { title: 'settlement', body: '只对通过 Validator 的有效增量计价；这里每增加 1pp 结算一万元。' },
    },
  },
  {
    id: 'worker',
    layer: 'L02 / WORKER',
    filename: 'worker.ts',
    title: 'Worker 负责执行',
    body: 'a3s-code 会话被绑定到指定工作区和权限。完整事件流与运行快照保留下来，供后续验收和追责。',
    result: '输出：resultCommitment · runId · traceRoot',
    focus: [7, 18],
    code: `import {
  Agent, FileSessionStore, LocalWorkspaceBackend,
  type SessionOptions,
} from '@a3s-lab/code';

const options: SessionOptions = {
  planningMode: 'disabled',
  workspaceBackend: new LocalWorkspaceBackend('/workspace'),
  sessionStore: new FileSessionStore('/receipts/worker'),
  autoSave: true,
  permissionPolicy: {
    allow: ['read*', 'write*', 'edit*', 'code_*'],
    deny: ['bash*', 'git*'], defaultDecision: 'deny',
  },
};

export async function run(workOrder: string) {
  const agent = await Agent.create('worker.acl');
  const session = await agent.sessionAsync('/workspace', options);
  const events: unknown[] = [];
  for await (const event of await session.stream(workOrder))
    events.push(event);
  await session.save();
  return { events, runs: await session.runs() };
}`,
    notes: {
      3: { title: 'SessionOptions', body: 'TypeScript 类型会在构建时检查会话配置字段，减少部署后才发现拼写错误。' },
      7: { title: 'planningMode', body: '本例关闭自动规划，执行步骤由已签名的 workOrder 和 Agent 配置约束。' },
      8: { title: 'LocalWorkspaceBackend', body: '所有文件工具都被限制在 /workspace，不能越过本次工作负载边界。' },
      9: { title: 'FileSessionStore', body: '运行事件、Trace、Artifact 和验证材料落到独立持久化目录。' },
      10: { title: 'autoSave', body: '每次运行完成后自动保存快照；显式 save 仍作为提交屏障。' },
      12: { title: 'allow', body: 'Worker 只看到完成 GEO 内容修改所需的文件与代码工具。' },
      13: { title: 'deny / defaultDecision', body: 'Shell、Git 和未匹配工具默认拒绝，权限不会因为模型请求而扩大。' },
      18: { title: 'Agent.create', body: '从 worker.acl 创建执行 Agent；模型、提供方和运行策略由 ACL 配置。' },
      19: { title: 'sessionAsync', body: '异步创建工作区会话，不阻塞 Node.js 事件循环。' },
      21: { title: 'session.stream', body: '每个文本、工具和状态事件都能被宿主收集，而不是只保留最后一句回答。' },
      23: { title: 'session.save', body: '等待事件流清理完毕后提交当前 SessionSnapshot，形成可追溯运行边界。' },
      24: { title: 'session.runs', body: '返回持久化的 Run 快照，回执会引用其中的 runId 和状态。' },
    },
  },
  {
    id: 'validator',
    layer: 'L03 / VALIDATOR',
    filename: 'validator.ts',
    title: 'Validator 独立验收',
    body: 'Validator 使用单独 ACL、只读证据目录和默认拒绝策略。它核验结果，不替 Worker 补做任务。',
    result: '输出：passed · measuredLiftPp · evidenceRoot',
    focus: [6, 18],
    code: `import {
  Agent, FileSessionStore, LocalWorkspaceBackend,
  type SessionOptions,
} from '@a3s-lab/code';

const options: SessionOptions = {
  planningMode: 'disabled',
  workspaceBackend: new LocalWorkspaceBackend('/evidence'),
  sessionStore: new FileSessionStore('/receipts/validator'),
  permissionPolicy: {
    allow: ['read*', 'ls*', 'glob*', 'grep*', 'code_*'],
    deny: ['write*', 'edit*', 'patch*', 'bash*', 'git*'],
    defaultDecision: 'deny',
  },
};

export async function validate(evidenceRoot: string) {
  const agent = await Agent.create('validator.acl');
  const session = await agent.sessionAsync('/evidence', options);
  const result = await session.send(
    'Verify GEO evidence root ' + evidenceRoot +
    '; return passed, measuredLiftPp and exclusions.',
  );
  await session.save();
  return { result, traces: session.traceEvents() };
}`,
    notes: {
      7: { title: 'planningMode', body: '验收流程按固定提示和谓词运行，避免 Validator 自行改变判断目标。' },
      8: { title: '/evidence', body: 'Validator 只挂载证据目录，不接触 Worker 的可写工作区。' },
      9: { title: 'validator store', body: '验收轨迹与 Worker 轨迹分开保存，方便比较双方版本和时间线。' },
      11: { title: 'read-only allowlist', body: 'Validator 可以读取、枚举、搜索和检查代码，但没有修改证据的工具。' },
      12: { title: 'write denylist', body: '即使模型尝试修改文件、执行 Shell 或操作 Git，也会在工具入口被拒绝。' },
      13: { title: 'defaultDecision', body: '所有清单外工具都拒绝，新增工具不会自动获得权限。' },
      18: { title: '独立 ACL', body: 'validator.acl 与 worker.acl 分开配置，可使用不同模型、机构和密钥。' },
      20: { title: 'session.send', body: '等待完整验收结果；输入只引用已承诺的 evidenceRoot，避免换一套证据。' },
      25: { title: 'traceEvents', body: '返回本次核验的紧凑 Trace，最终与验证结论一起进入回执。' },
    },
  },
  {
    id: 'receipt',
    layer: 'L04 / RECEIPT',
    filename: 'receipt.ts',
    title: '把双方轨迹变成回执',
    body: '宿主把 Worker Run、Validator 结论和合约版本规范化后哈希。a3s-box 再为工作负载回执签名，ACVM 只接受匹配的状态转换。',
    result: '链上：taskId · receiptHash · settlement = ¥116,000',
    focus: [5, 17],
    code: `import { createHash } from 'node:crypto';

type RunEvidence = { runId: string; root: string };

export function buildReceipt(
  taskId: string,
  worker: RunEvidence,
  validator: RunEvidence,
  measuredLiftPp: number,
) {
  const settlement = measuredLiftPp * 10_000;
  const body = {
    taskId, contractVersion: 1,
    worker, validator, measuredLiftPp, settlement,
    status: 'verified',
  } as const;
  const receiptHash = createHash('sha256')
    .update(JSON.stringify(body)).digest('hex');
  return { ...body, receiptHash: '0x' + receiptHash };
}`,
    notes: {
      3: { title: 'RunEvidence', body: '双方各提交一个 runId 和轨迹根；链上无需保存完整日志。' },
      6: { title: 'taskId', body: '同一编号贯穿调用、执行、验收和结算，防止把其他任务结果拿来复用。' },
      7: { title: 'worker', body: '引用 Worker 的运行快照和 Trace Root。' },
      8: { title: 'validator', body: '引用独立 Validator 的结论与证据根。' },
      9: { title: 'measuredLiftPp', body: 'Validator 实测的引用份额增量，单位是百分点 pp。' },
      11: { title: 'settlement', body: '只有已验收增量进入公式：11.6pp × ¥10,000 = ¥116,000。' },
      13: { title: 'contractVersion', body: '固定到部署时的规则版本，旧任务不会被新规则重新解释。' },
      15: { title: 'status', body: '只有 verified 回执能触发结算；拒绝回执仅写入原因和轨迹。' },
      17: { title: 'SHA-256', body: '规范化回执体后计算摘要；任何字段变化都会得到不同 receiptHash。' },
      19: { title: 'receiptHash', body: '链上保存摘要和必要索引，完整回执可在链下按哈希取回并复核。' },
    },
  },
];

export function ContractCodeWalkthrough() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inspectedLine, setInspectedLine] = useState<number | null>(null);
  const active = steps[activeIndex];
  const inspected = inspectedLine ? active.notes[inspectedLine] : undefined;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % steps.length);
    }, 3800);
    return () => window.clearInterval(timer);
  }, [playing, visible]);

  useEffect(() => {
    setInspectedLine(null);
    setCopied(false);
  }, [activeIndex]);

  const selectStep = (index: number) => {
    setActiveIndex(index);
    setPlaying(false);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(active.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`diagram-panel code-walkthrough-panel ${playing ? 'is-playing' : 'is-paused'}`} ref={rootRef}>
      <header className="panel-chrome code-walkthrough-chrome">
        <span><i /><i /><i /></span>
        <code>A3S-CODE / AGENTIC CONTRACT / TYPESCRIPT</code>
        <button type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? '暂停代码漫游' : '继续代码漫游'}>
          <i aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</i>{playing ? 'PAUSE' : 'PLAY'}
        </button>
      </header>

      <div className="code-walkthrough-body">
        <aside className="code-file-tree" aria-label="Agentic Contract 文件">
          <header><span>▾</span><strong>geo-outcome/</strong></header>
          <nav>
            {steps.map((step, index) => (
              <button
                type="button"
                className={activeIndex === index ? 'is-active' : ''}
                onClick={() => selectStep(index)}
                aria-pressed={activeIndex === index}
                key={step.id}
              >
                <i>TS</i><span>{step.filename}</span>
              </button>
            ))}
          </nav>
          <footer><span>ACL</span><small>worker.acl</small><span>ACL</span><small>validator.acl</small></footer>
        </aside>

        <section className="code-editor" aria-label={`${active.filename} 代码`}>
          <header>
            <span><i>TS</i>{active.filename}</span>
            <div><small>TypeScript</small><button type="button" onClick={copyCode}>{copied ? 'COPIED' : 'COPY'}</button></div>
          </header>
          <div className="code-lines">
            {active.code.split('\n').map((line, index) => {
              const lineNumber = index + 1;
              const focused = lineNumber >= active.focus[0] && lineNumber <= active.focus[1];
              const note = active.notes[lineNumber];
              return (
                <div
                  className={`${focused ? 'is-focused' : ''} ${note ? 'has-note' : ''} ${inspectedLine === lineNumber ? 'is-inspected' : ''}`}
                  onMouseEnter={() => note && setInspectedLine(lineNumber)}
                  onFocus={() => note && setInspectedLine(lineNumber)}
                  tabIndex={note ? 0 : undefined}
                  title={note ? `${note.title}：${note.body}` : undefined}
                  key={`${active.id}-${lineNumber}`}
                >
                  <span>{String(lineNumber).padStart(2, '0')}</span><code>{line || ' '}</code>{note ? <i aria-hidden="true">·</i> : null}
                </div>
              );
            })}
          </div>
        </section>

        <aside className="code-stage-rail">
          <header><span>STEP</span><strong>{String(activeIndex + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</strong></header>
          <nav aria-label="代码漫游步骤">
            {steps.map((step, index) => (
              <button
                type="button"
                className={activeIndex === index ? 'is-active' : ''}
                onClick={() => selectStep(index)}
                aria-pressed={activeIndex === index}
                key={step.id}
              >
                <i /><span><small>{step.layer}</small><strong>{step.title}</strong></span>
              </button>
            ))}
          </nav>
          <div className={`code-line-inspector ${inspected ? 'is-inspecting' : ''}`} aria-live="polite">
            <small>{inspected ? `LINE ${String(inspectedLine).padStart(2, '0')} / HOVER NOTE` : active.layer}</small>
            <strong>{inspected?.title ?? active.title}</strong>
            <p>{inspected?.body ?? active.body}</p>
            {!inspected ? <code>{active.result}</code> : null}
          </div>
        </aside>
      </div>

      <footer className="code-walkthrough-status">
        <span><i /> SDK VERIFIED</span>
        <code>@a3s-lab/code · WORKER → VALIDATOR → RECEIPT</code>
        <strong>A3S-BOX × 2</strong>
      </footer>
      <i
        className="code-walkthrough-progress"
        style={{ '--code-progress': `${((activeIndex + 1) / steps.length) * 100}%` } as CSSProperties}
        aria-hidden="true"
      />
    </div>
  );
}
