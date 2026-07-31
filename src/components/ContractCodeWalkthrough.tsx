import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

type LineNote = {
  title: string;
  body: string;
};

type CodeFile = {
  id: string;
  filename: string;
  code: string;
  notes: Record<number, LineNote>;
};

type CodeBeat = {
  id: string;
  fileId: string;
  layer: string;
  title: string;
  body: string;
  result: string;
  focus: [number, number];
};

const files: CodeFile[] = [
  {
    id: 'contract',
    filename: 'contract.ts',
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
  permissions: {
    oracle: ['geo-citation-share', 'site-analytics'],
    transfers: {
      token: 'CNYC',
      maxAmount: 200_000_000_000n,
    },
  },
  predicate: { minDays: 30, minLiftBps: 800 },
  settlement: { perLiftBps: 100_000_000n },
} as const;`,
    notes: {
      4: { title: 'workloads', body: '一次部署同时绑定 Worker 和 Validator，两份镜像缺一不可。' },
      7: { title: 'worker.image', body: 'a3s-box 实际启动的 Worker 镜像必须匹配这个摘要。' },
      11: { title: 'validator.image', body: '验收端使用独立镜像，执行方不能在任务完成后临时换规则。' },
      14: { title: 'permissions', body: 'ctx 能访问哪些预言机、资产和最高转账金额在部署时冻结。' },
      15: { title: 'oracle allowlist', body: 'Worker 和 Validator 只能请求合约列出的数据源。' },
      16: { title: 'transfers', body: '转账能力由合约托管账户提供，不使用 Agent 自己的私钥。' },
      18: { title: 'maxAmount', body: '单次任务最多转出 200,000 CNYC，超过上限时 ctx 会直接拒绝。' },
      21: { title: 'predicate', body: '观察期至少 30 天，引用份额增量至少 800 bps，也就是 8pp。' },
      22: { title: 'settlement', body: '每个有效 bps 对应 100 CNYC；1160 bps 最终结算 116,000 CNYC。' },
    },
  },
  {
    id: 'context',
    filename: 'ctx.d.ts',
    code: `export type Address = string; // 0x-prefixed

export type OracleResult<T> = {
  value: T;
  proof: string;
  observedAt: number;
};

export interface AgenticContractContext {
  taskId: string;
  caller: Address;
  block: { height: bigint; timestamp: number };
  contract: {
    address: Address;
    escrow: Address;
    settlementToken: Address;
  };
  oracle: {
    read<T>(request: {
      source: string;
      query: Record<string, unknown>;
      atBlock?: bigint;
    }): Promise<OracleResult<T>>;
  };
  chain: {
    transfer(request: {
      token: Address;
      to: Address;
      amount: bigint;
      memo?: string;
    }): Promise<{ txHash: string }>;
    emit(event: string, payload: unknown): Promise<void>;
  };
  receipt: {
    commit(kind: string, payload: unknown):
      Promise<{ root: string }>;
  };
}

declare global {
  const ctx: AgenticContractContext;
}`,
    notes: {
      9: { title: 'AgenticContractContext', body: 'ACVM 在工作负载启动时注入的只读全局上下文，不需要业务代码保存链私钥。' },
      10: { title: 'taskId', body: '调用、Worker、Validator、回执和转账都引用同一个任务编号。' },
      12: { title: 'block', body: '读取当前确定区块的高度与时间，避免预言机查询没有时间边界。' },
      13: { title: 'contract', body: '提供当前合约地址、托管地址和允许结算的资产地址。' },
      18: { title: 'ctx.oracle', body: '读取外部数据时同时返回值、来源证明和观测时间。' },
      19: { title: 'oracle.read<T>', body: '泛型 T 描述返回数据结构；source 必须命中 Manifest 白名单。' },
      25: { title: 'ctx.chain', body: '所有链操作先经过 ACVM 权限、额度、nonce 和状态检查。' },
      26: { title: 'chain.transfer', body: '从合约托管账户转账，不能指定任意 from 地址绕过授权。' },
      32: { title: 'chain.emit', body: '写入可索引事件，事件会和 taskId、交易哈希及回执根绑定。' },
      34: { title: 'ctx.receipt', body: '把本阶段输入、输出和证明提交为规范化回执。' },
      35: { title: 'receipt.commit', body: '返回 Merkle Root，链上只需保存根即可验证完整轨迹。' },
      41: { title: 'global ctx', body: 'Worker 与 Validator 都可直接使用 ctx，但获得的能力由各自 Manifest 权限裁剪。' },
    },
  },
  {
    id: 'worker',
    filename: 'worker.ts',
    code: `import {
  Agent, FileSessionStore, LocalWorkspaceBackend,
  type SessionOptions,
} from '@a3s-lab/code';

type GeoObservation = { sharePp: number; windowDays: number };
type WorkOrder = { querySetRoot: string; siteVersion: string };

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

export async function run(order: WorkOrder) {
  const baseline = await ctx.oracle.read<GeoObservation>({
    source: 'geo-citation-share',
    query: { querySetRoot: order.querySetRoot },
    atBlock: ctx.block.height,
  });

  const agent = await Agent.create('worker.acl');
  const session = await agent.sessionAsync('/workspace', options);
  const result = await session.send({
    prompt: 'Improve GEO for site version ' + order.siteVersion,
  });
  await session.save();
  const [latestRun] = (await session.runs()).slice(-1);
  const receipt = await ctx.receipt.commit('worker', {
    taskId: ctx.taskId,
    baseline,
    latestRun,
    result,
  });
  await session.closeAsync();
  await agent.close();
  return { baselinePp: baseline.value.sharePp, receipt };
}`,
    notes: {
      2: { title: '@a3s-lab/code', body: 'TypeScript SDK 提供 Agent、工作区、事件流和持久化 Session。' },
      9: { title: 'SessionOptions', body: '运行配置经过 TypeScript 类型检查后再交给 a3s-code。' },
      11: { title: 'LocalWorkspaceBackend', body: '文件与代码工具只能访问 a3s-box 挂载的 /workspace。' },
      12: { title: 'FileSessionStore', body: 'Run、Trace、Artifact 和验证材料被持续保存。' },
      14: { title: 'permissionPolicy', body: '这是 Agent 工具权限；它和 ctx 的链权限是两套独立闸门。' },
      20: { title: 'run(order)', body: 'a3s-box 用签名 WorkOrder 调用这个入口。' },
      21: { title: 'ctx.oracle.read', body: '执行前冻结 GEO 基线；返回值自带可写入回执的来源证明。' },
      24: { title: 'atBlock', body: '把基线绑定到确定区块，之后不能挑一个更有利的历史值。' },
      27: { title: 'Agent.create', body: '从 worker.acl 创建 Agent；模型和运行策略不写死在业务代码里。' },
      28: { title: 'sessionAsync', body: '创建不阻塞 Node.js 事件循环的工作区会话。' },
      29: { title: 'session.send', body: '让 Agent 完成网站分析与内容修改，工具调用全部进入事件轨迹。' },
      33: { title: 'session.runs', body: '取得本次 a3s-code Run 快照，后续可按 runId 重放和审计。' },
      34: { title: 'worker receipt', body: '把预言机基线、Agent Run 和输出一起提交，防止只交最后结果。' },
      40: { title: 'closeAsync', body: '先关闭 Session，再关闭 Agent，释放 a3s-box 中的运行资源。' },
    },
  },
  {
    id: 'validator',
    filename: 'validator.ts',
    code: `import type { Address } from './ctx';

type GeoObservation = { sharePp: number; windowDays: number };
type Claim = {
  baselinePp: number;
  querySetRoot: string;
  payout: Address;
};

export async function validate(claim: Claim) {
  const observed = await ctx.oracle.read<GeoObservation>({
    source: 'geo-citation-share',
    query: { querySetRoot: claim.querySetRoot },
    atBlock: ctx.block.height,
  });

  const liftBps = Math.round(
    (observed.value.sharePp - claim.baselinePp) * 100,
  );
  const passed = observed.value.windowDays >= 30
    && liftBps >= 800;

  return ctx.receipt.commit('validator', {
    taskId: ctx.taskId,
    passed,
    liftBps,
    payout: claim.payout,
    oracleProof: observed.proof,
    observedAt: observed.observedAt,
    });
}`,
    notes: {
      10: { title: 'validate(claim)', body: 'Validator 是第二个 a3s-box 工作负载，只接收 Worker 声明和证据引用。' },
      11: { title: '独立预言机观测', body: 'Validator 重新读取同一签名问题集，不接受 Worker 自报的最终引用率。' },
      14: { title: 'atBlock', body: '最终观测同样绑定区块高度，使观察窗口和数据快照可复核。' },
      17: { title: 'liftBps', body: '引用份额差值转换成整数 bps，避免浮点值直接进入链上结算。' },
      20: { title: 'passed', body: '只有观察期满 30 天且增量达到 800 bps 时才通过。' },
      23: { title: 'validator receipt', body: '判断结果、增量、收款地址和预言机证明共同进入验收回执。' },
      28: { title: 'oracleProof', body: '证明本次观测来自 Manifest 允许的数据源，而不是 Validator 手填。' },
    },
  },
  {
    id: 'settlement',
    filename: 'settle.ts',
    code: `import type { Address } from './ctx';

type Verdict = {
  passed: boolean;
  liftBps: number;
  payout: Address;
};

export async function settle(verdict: Verdict) {
  if (!verdict.passed) {
    await ctx.chain.emit('GEORejected', { taskId: ctx.taskId });
    return ctx.receipt.commit('settlement', { status: 'rejected' });
  }

  const amount = BigInt(verdict.liftBps) * 100_000_000n;
  const transfer = await ctx.chain.transfer({
    token: ctx.contract.settlementToken,
    to: verdict.payout,
    amount,
    memo: ctx.taskId,
  });

  await ctx.chain.emit('GEOSettled', {
    taskId: ctx.taskId,
    liftBps: verdict.liftBps,
    amount,
    txHash: transfer.txHash,
  });

  return ctx.receipt.commit('settlement', {
    status: 'paid',
    amount,
    txHash: transfer.txHash,
    });
}`,
    notes: {
      9: { title: 'settle(verdict)', body: '只有已验证回执才能进入结算入口，普通 Worker 无权直接调用。' },
      10: { title: '拒绝分支', body: '验收未通过时只写拒绝事件与回执，不产生资产转移。' },
      11: { title: 'ctx.chain.emit', body: '事件自动绑定当前合约、taskId、区块和调用者。' },
      15: { title: 'amount', body: '1160 bps × 100 CNYC = 116,000 CNYC；使用 bigint 避免金额精度丢失。' },
      16: { title: 'ctx.chain.transfer', body: 'ACVM 检查资产白名单、托管余额、额度、nonce 和 Validator 回执后才执行。' },
      17: { title: 'settlementToken', body: '资产来自 Manifest 与当前合约上下文，业务代码不能临时换币种。' },
      18: { title: 'payout', body: '收款地址已在 Validator 回执中绑定，结算阶段不能替换。' },
      20: { title: 'memo', body: '把转账直接关联到 taskId，账本和工作轨迹可以双向查询。' },
      23: { title: 'GEOSettled', body: '公开事件只放结算必要字段，完整证据仍通过回执根按需取回。' },
      30: { title: 'settlement receipt', body: '最终回执同时记录支付状态、金额和交易哈希，生命周期至此闭合。' },
    },
  },
];

const beats: CodeBeat[] = [
  {
    id: 'contract', fileId: 'contract', layer: '01 / CONTRACT', title: '冻结两份工作负载',
    body: 'Manifest 同时锁定 Worker、Validator、ctx 权限、验收阈值和结算上限。',
    result: 'contractRoot · workerDigest · validatorDigest', focus: [4, 22],
  },
  {
    id: 'context', fileId: 'context', layer: '02 / ACVM CONTEXT', title: 'ctx 提供链能力',
    body: 'ACVM 向工作负载注入受权限约束的全局 ctx，不把链私钥交给 Agent。',
    result: 'oracle · chain · receipt · taskId', focus: [9, 37],
  },
  {
    id: 'worker-runtime', fileId: 'worker', layer: '03 / A3S-CODE', title: '配置 Agent 运行边界',
    body: 'a3s-code 负责模型会话、工具权限、工作区和可追溯运行快照。',
    result: 'SessionOptions · PermissionPolicy · FileSessionStore', focus: [9, 18],
  },
  {
    id: 'worker-run', fileId: 'worker', layer: '04 / WORKER', title: '读预言机并执行任务',
    body: '先通过 ctx 冻结 GEO 基线，再让 Agent 修改内容，最后把 Run 与结果提交成回执。',
    result: 'baselineProof · runId · workerReceipt', focus: [20, 39],
  },
  {
    id: 'validator', fileId: 'validator', layer: '05 / VALIDATOR', title: '独立观测结果',
    body: 'Validator 重新读取同一问题集，只用整数谓词判断观察期和引用增量。',
    result: 'passed · liftBps · oracleProof', focus: [10, 30],
  },
  {
    id: 'settlement', fileId: 'settlement', layer: '06 / SETTLEMENT', title: '验收后转账',
    body: '通过后由 ctx 从合约托管账户转账，并把事件、交易哈希和回执根写回链上。',
    result: 'transferTx · GEOSettled · settlementReceipt', focus: [9, 34],
  },
];

const tokenPattern = /(\/\/.*$|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\b(?:import|from|export|const|type|interface|declare|global|async|function|await|return|if|else|new|as|true|false|unknown|string|number|bigint|boolean|Promise)\b|\b\d[\d_]*(?:\.\d+)?n?\b|\b(?:ctx|oracle|chain|receipt|contract|block)\b|\b[A-Z][A-Za-z0-9_]*\b|\b[a-zA-Z_$][\w$]*(?=\s*\()|\b[a-zA-Z_$][\w$]*(?=\s*:)|[{}\[\](),.:;?<>+=*|&!\/-]+)/g;

function tokenClass(token: string) {
  if (token.startsWith('//')) return 'tok-comment';
  if (token.startsWith("'") || token.startsWith('"')) return 'tok-string';
  if (/^\d/.test(token)) return 'tok-number';
  if (/^(?:import|from|export|const|type|interface|declare|global|async|function|await|return|if|else|new|as|true|false|unknown|string|number|bigint|boolean|Promise)$/.test(token)) return 'tok-keyword';
  if (/^(?:ctx|oracle|chain|receipt|contract|block)$/.test(token)) return 'tok-context';
  if (/^[A-Z]/.test(token)) return 'tok-type';
  if (/^[a-zA-Z_$]/.test(token)) return 'tok-symbol';
  return 'tok-operator';
}

function highlightLine(line: string) {
  const output: ReactNode[] = [];
  let cursor = 0;
  for (const match of line.matchAll(tokenPattern)) {
    const index = match.index ?? 0;
    if (index > cursor) output.push(line.slice(cursor, index));
    output.push(<span className={tokenClass(match[0])} key={`${index}-${match[0]}`}>{match[0]}</span>);
    cursor = index + match[0].length;
  }
  if (cursor < line.length) output.push(line.slice(cursor));
  return output;
}

export function ContractCodeWalkthrough() {
  const rootRef = useRef<HTMLDivElement>(null);
  const codeLinesRef = useRef<HTMLDivElement>(null);
  const wheelLockedRef = useRef(false);
  const wheelTimerRef = useRef<number | undefined>(undefined);
  const [activeBeatIndex, setActiveBeatIndex] = useState(0);
  const activeBeatIndexRef = useRef(activeBeatIndex);
  const [copied, setCopied] = useState(false);
  const [inspectedLine, setInspectedLine] = useState<number | null>(null);
  const activeBeat = beats[activeBeatIndex];
  const activeFile = files.find((file) => file.id === activeBeat.fileId) ?? files[0];
  const inspected = inspectedLine ? activeFile.notes[inspectedLine] : undefined;

  useEffect(() => {
    activeBeatIndexRef.current = activeBeatIndex;
  }, [activeBeatIndex]);

  useEffect(() => {
    const panel = rootRef.current;
    if (!panel) return undefined;
    const onWheel = (event: WheelEvent) => {
      if (!window.matchMedia('(min-width: 961px)').matches || Math.abs(event.deltaY) < 12 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const direction = event.deltaY > 0 ? 1 : -1;
      const currentBeat = activeBeatIndexRef.current;
      const atBoundary = (direction < 0 && currentBeat === 0) || (direction > 0 && currentBeat === beats.length - 1);
      if (atBoundary) {
        if (wheelLockedRef.current) {
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (wheelLockedRef.current) return;
      wheelLockedRef.current = true;
      const nextBeat = currentBeat + direction;
      activeBeatIndexRef.current = nextBeat;
      setActiveBeatIndex(nextBeat);
      window.clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = window.setTimeout(() => { wheelLockedRef.current = false; }, 520);
    };
    panel.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      panel.removeEventListener('wheel', onWheel);
      window.clearTimeout(wheelTimerRef.current);
    };
  }, []);

  useEffect(() => {
    setInspectedLine(null);
    setCopied(false);
    const container = codeLinesRef.current;
    const target = container?.querySelector<HTMLElement>(`[data-code-line="${activeBeat.focus[0]}"]`);
    if (!container || !target) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    container.scrollTo({ top: Math.max(0, target.offsetTop - 54), behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [activeBeat]);

  const selectBeat = (index: number) => setActiveBeatIndex(Math.max(0, Math.min(beats.length - 1, index)));

  const selectFile = (fileId: string) => {
    const firstBeat = beats.findIndex((beat) => beat.fileId === fileId);
    if (firstBeat >= 0) selectBeat(firstBeat);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeFile.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="diagram-panel code-walkthrough-panel"
      ref={rootRef}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        const next = activeBeatIndex + direction;
        if (next < 0 || next >= beats.length) return;
        event.preventDefault();
        event.stopPropagation();
        selectBeat(next);
      }}
      aria-label="使用滚轮逐段查看 Agentic Contract TypeScript 代码"
    >
      <header className="panel-chrome code-walkthrough-chrome">
        <span><i /><i /><i /></span>
        <code>A3S-CODE / ACVM CONTEXT / TYPESCRIPT</code>
        <span className="code-scroll-cue"><i aria-hidden="true">↕</i> SCROLL TO EXPLORE</span>
      </header>

      <div className="code-walkthrough-body">
        <aside className="code-file-tree" aria-label="Agentic Contract 文件">
          <header><span>▾</span><strong>geo-outcome/</strong></header>
          <nav>
            {files.map((file) => (
              <button
                type="button"
                className={activeFile.id === file.id ? 'is-active' : ''}
                onClick={() => selectFile(file.id)}
                aria-pressed={activeFile.id === file.id}
                key={file.id}
              >
                <i>TS</i><span>{file.filename}</span>
              </button>
            ))}
          </nav>
          <footer><span>ACL</span><small>worker.acl</small><span>ACL</span><small>validator.acl</small></footer>
        </aside>

        <section className="code-editor" aria-label={`${activeFile.filename} 代码`}>
          <header>
            <span><i>TS</i>{activeFile.filename}</span>
            <div><small>TypeScript</small><button type="button" onClick={copyCode}>{copied ? 'COPIED' : 'COPY'}</button></div>
          </header>
          <div className="code-lines" ref={codeLinesRef}>
            {activeFile.code.split('\n').map((line, index) => {
              const lineNumber = index + 1;
              const focused = lineNumber >= activeBeat.focus[0] && lineNumber <= activeBeat.focus[1];
              const note = activeFile.notes[lineNumber];
              return (
                <div
                  className={`${focused ? 'is-focused' : ''} ${note ? 'has-note' : ''} ${inspectedLine === lineNumber ? 'is-inspected' : ''}`}
                  data-code-line={lineNumber}
                  onMouseEnter={() => note && setInspectedLine(lineNumber)}
                  onFocus={() => note && setInspectedLine(lineNumber)}
                  tabIndex={note ? 0 : undefined}
                  title={note ? `${note.title}：${note.body}` : undefined}
                  key={`${activeFile.id}-${lineNumber}`}
                >
                  <span>{String(lineNumber).padStart(2, '0')}</span><code>{line ? highlightLine(line) : ' '}</code>{note ? <i aria-hidden="true">·</i> : null}
                </div>
              );
            })}
          </div>
        </section>

        <aside className="code-stage-rail">
          <header><span>SCROLL STEP</span><strong>{String(activeBeatIndex + 1).padStart(2, '0')} / {String(beats.length).padStart(2, '0')}</strong></header>
          <nav aria-label="代码漫游步骤">
            {beats.map((beat, index) => (
              <button
                type="button"
                className={activeBeatIndex === index ? 'is-active' : ''}
                onClick={() => selectBeat(index)}
                aria-pressed={activeBeatIndex === index}
                key={beat.id}
              >
                <i /><span><small>{beat.layer}</small><strong>{beat.title}</strong></span>
              </button>
            ))}
          </nav>
          <div className={`code-line-inspector ${inspected ? 'is-inspecting' : ''}`} aria-live="polite">
            <small>{inspected ? `LINE ${String(inspectedLine).padStart(2, '0')} / HOVER NOTE` : activeBeat.layer}</small>
            <strong>{inspected?.title ?? activeBeat.title}</strong>
            <p>{inspected?.body ?? activeBeat.body}</p>
            {!inspected ? <code>{activeBeat.result}</code> : null}
          </div>
        </aside>
      </div>

      <footer className="code-walkthrough-status">
        <span><i /> CTX CAPABILITIES BOUND</span>
        <code>ORACLE → A3S-CODE → VALIDATOR → TRANSFER</code>
        <strong>A3S-BOX × 2</strong>
      </footer>
      <i
        className="code-walkthrough-progress"
        style={{ '--code-progress': `${((activeBeatIndex + 1) / beats.length) * 100}%` } as CSSProperties}
        aria-hidden="true"
      />
    </div>
  );
}
