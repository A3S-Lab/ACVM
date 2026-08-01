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
    code: `import { defineContract } from '@a3s-lab/acvm';
import { inputSchema, resultSchema, verdictSchema } from './schemas';

export default defineContract({
  name: 'geo-outcome',
  version: 1,
  tree: {
    worker: './worker/index.ts',
    validator: './validator/index.ts',
    settle: './settle.ts',
  },
  schema: {
    input: inputSchema,
    output: resultSchema,
    verdict: verdictSchema,
  },
  acceptance: {
    minDays: 30,
    minLiftBps: 800,
  },
  settlement: {
    token: 'CNYC',
    perLiftBps: 100_000_000n,
    maxAmount: 200_000_000_000n,
  },
});`,
    notes: {
      1: { title: 'defineContract', body: 'TypeScript 只描述业务目录的入口、数据格式和结算条件；运行环境由 ACVM 固定。' },
      4: { title: '目录入口', body: 'contract.ts 是业务目录的入口文件。部署身份来自整棵目录的内容根，而不是这一份对象本身。' },
      7: { title: 'tree', body: 'Worker、Validator 和结算代码必须都在同一目录树内；缺少任一入口就不能部署。' },
      8: { title: 'worker/index.ts', body: 'Worker 负责读取任务文件并生成结果文件，由 a3s-box 以系统固定边界启动。' },
      9: { title: 'validator/index.ts', body: 'Validator 独立读取输入、Worker 输出和证据文件，不能改写 Worker 目录。' },
      12: { title: 'schema', body: '输入、输出和裁决文件都有版本化 Schema，文件内容不合格时不会进入下一阶段。' },
      17: { title: 'acceptance', body: '这里是业务验收条件，不是工具、文件系统或网络配置。' },
      21: { title: 'settlement', body: '业务目录声明计价方式与金额上限；实际转账仍由 ACVM 校验并执行。' },
      24: { title: 'maxAmount', body: '单个任务最多结算 200,000 CNYC，超出时链上转账接口会拒绝。' },
    },
  },
  {
    id: 'schemas',
    filename: 'schemas.ts',
    code: `import { schema } from '@a3s-lab/acvm';

export const inputSchema = schema.object({
  querySetRoot: schema.string(),
  siteVersion: schema.string(),
  payout: schema.address(),
});

export const resultSchema = schema.object({
  baselinePp: schema.number(),
  artifactRoot: schema.digest(),
  evidenceRoot: schema.digest(),
});

export const verdictSchema = schema.object({
  passed: schema.boolean(),
  liftBps: schema.integer(),
  payout: schema.address(),
});

export type WorkOrder = schema.infer<typeof inputSchema>;
export type WorkerResult = schema.infer<typeof resultSchema>;
export type Verdict = schema.infer<typeof verdictSchema>;`,
    notes: {
      3: { title: 'inputSchema', body: '调用意图先被规范化成 /task/input/order.json；字段不完整时 Worker 不会启动。' },
      9: { title: 'resultSchema', body: 'Worker 输出只传递必要业务值和文件承诺，不把整份工作区塞进交易。' },
      15: { title: 'verdictSchema', body: 'Validator 的裁决文件使用独立 Schema，结算阶段只接受这个固定格式。' },
      21: { title: 'TypeScript 类型', body: '运行时 Schema 和编译时类型来自同一处，避免代码与文件格式各写一份。' },
    },
  },
  {
    id: 'context',
    filename: 'ctx.d.ts',
    code: `import type { Session } from '@a3s-lab/code';

export type ReadPath =
  | '/task/input/order.json'
  | '/task/output/result.json'
  | '/task/evidence/baseline.json'
  | '/task/verdict/result.json';

export type WritePath =
  | '/task/output/artifact.json'
  | '/task/output/result.json'
  | '/task/evidence/baseline.json'
  | '/task/verdict/result.json'
  | '/task/settlement/result.json';

export type FileRef = {
  path: WritePath;
  digest: string;
  size: number;
};

export interface AgenticContractContext {
  taskId: string;
  caller: string;
  block: { height: bigint; timestamp: number };
  code: { session: Session };
  files: {
    read<T>(path: ReadPath): Promise<T>;
    write(path: WritePath, value: unknown): Promise<FileRef>;
  };
  oracle: {
    read<T>(request: {
      source: string;
      query: Record<string, unknown>;
      atBlock?: bigint;
    }): Promise<{ value: T; proof: string; observedAt: number }>;
  };
  chain: {
    transfer(request: {
      token: string;
      to: string;
      amount: bigint;
      memo?: string;
    }): Promise<{ txHash: string }>;
    emit(event: string, payload: unknown): Promise<void>;
  };
  receipt: {
    commit(kind: 'worker' | 'validator' | 'settlement'):
      Promise<{ root: string; treeRoot: string }>;
  };
}

declare global {
  const ctx: AgenticContractContext;
}`,
    notes: {
      1: { title: 'a3s-code Session', body: 'a3s-box 先创建受系统约束的 Session，再通过 ctx 交给业务代码；作者没有运行配置入口。' },
      3: { title: 'ReadPath', body: '可读取路径由协议固定。这里是在 TypeScript 中说明文件 ABI，不是让用户配置挂载权限。' },
      9: { title: 'WritePath', body: '可写文件同样由协议固定；越界路径、符号链接绕过和覆盖系统文件都会被运行时拒绝。' },
      16: { title: 'FileRef', body: '每次写入返回路径、内容摘要和字节数，后续回执直接引用这些稳定字段。' },
      22: { title: 'AgenticContractContext', body: 'ctx 是 ACVM 注入的只读全局对象，业务代码不持有链私钥，也不能替换系统能力。' },
      26: { title: 'ctx.code.session', body: '这是已由 a3s-box 配置好的 a3s-code Session；工具、文件系统和网络边界不在合约内暴露。' },
      27: { title: 'ctx.files', body: '业务只按固定路径读写 JSON；ACVM 自动规范编码、计算摘要并记录文件事件。' },
      31: { title: 'ctx.oracle', body: '外部观测返回值、来源证明和观测时间，业务代码再把它写入 evidence 文件。' },
      38: { title: 'ctx.chain', body: '转账和事件由链上能力代理执行，仍要经过合约状态、额度、nonce 和回执检查。' },
      47: { title: 'ctx.receipt', body: '提交阶段时，系统从当前任务文件生成 treeRoot，并把它绑定到签名回执。' },
      53: { title: 'global ctx', body: 'Worker、Validator 和结算代码使用同一种调用方式，但系统按阶段提供不同的固定能力。' },
    },
  },
  {
    id: 'worker',
    filename: 'worker/index.ts',
    code: `import { resultSchema, type WorkOrder } from '../schemas';

type GeoObservation = { sharePp: number; windowDays: number };

export async function run() {
  const order = await ctx.files.read<WorkOrder>('/task/input/order.json');

  const baseline = await ctx.oracle.read<GeoObservation>({
    source: 'geo-citation-share',
    query: { querySetRoot: order.querySetRoot },
    atBlock: ctx.block.height,
  });

  const baselineFile = await ctx.files.write(
    '/task/evidence/baseline.json',
    baseline,
  );

  const run = await ctx.code.session.send({
    prompt: 'Improve GEO for site version ' + order.siteVersion,
  });
  await ctx.code.session.save();

  const artifactFile = await ctx.files.write(
    '/task/output/artifact.json',
    { runId: run.id, result: run },
  );

  const output = resultSchema.parse({
    baselinePp: baseline.value.sharePp,
    artifactRoot: artifactFile.digest,
    evidenceRoot: baselineFile.digest,
  });
  await ctx.files.write('/task/output/result.json', output);

  return ctx.receipt.commit('worker');
}`,
    notes: {
      1: { title: '业务 Schema', body: 'Worker 直接复用合约目录中的结果 Schema，不再自行定义一份返回对象。' },
      6: { title: '固定输入文件', body: '调用意图由 ACVM 写成 /task/input/order.json；Worker 只能读取，不能修改。' },
      8: { title: 'ctx.oracle.read', body: '执行前冻结 GEO 基线，返回值同时带来源证明和观测时间。' },
      11: { title: 'atBlock', body: '基线绑定到确定区块，Worker 不能事后挑选更有利的数据快照。' },
      14: { title: 'evidence 文件', body: '外部观测先落成证据文件；系统自动记录写入事件并计算内容摘要。' },
      19: { title: '预配置 Session', body: 'ctx.code.session 已由 a3s-box 创建。合约代码只使用它，不设置工具、目录或网络权限。' },
      20: { title: 'Agent 运行', body: 'a3s-code 的每次模型输出和工具调用都属于当前 taskId 的运行轨迹。' },
      24: { title: 'artifact 文件', body: '完整 Agent 产物写入 output 目录，Validator 通过文件摘要引用它。' },
      29: { title: 'resultSchema.parse', body: '结果写盘前先做运行时校验，避免 TypeScript 编译通过但实际 JSON 缺字段。' },
      34: { title: '结果文件', body: 'result.json 是 Worker 对外的唯一业务输出；后续阶段只认这个固定文件。' },
      36: { title: 'Worker 回执', body: 'commit 不接收任意 payload，而是由系统对本阶段产生的文件树和运行轨迹统一承诺。' },
    },
  },
  {
    id: 'validator',
    filename: 'validator/index.ts',
    code: `import { verdictSchema, type WorkOrder, type WorkerResult } from '../schemas';

type GeoObservation = { sharePp: number; windowDays: number };

export async function validate() {
  const order = await ctx.files.read<WorkOrder>('/task/input/order.json');
  const result = await ctx.files.read<WorkerResult>('/task/output/result.json');

  const observed = await ctx.oracle.read<GeoObservation>({
    source: 'geo-citation-share',
    query: { querySetRoot: order.querySetRoot },
    atBlock: ctx.block.height,
  });

  const liftBps = Math.round(
    (observed.value.sharePp - result.baselinePp) * 100,
  );
  const verdict = verdictSchema.parse({
    passed: observed.value.windowDays >= 30
      && liftBps >= 800,
    liftBps,
    payout: order.payout,
  });

  await ctx.files.write('/task/verdict/result.json', verdict);
  return ctx.receipt.commit('validator');
}`,
    notes: {
      5: { title: '独立工作负载', body: 'Validator 在另一台 a3s-box 上启动，只读取系统提供的任务输入和 Worker 结果。' },
      6: { title: '同一输入文件', body: '验收与执行引用同一个 order.json，避免接口转发时替换任务参数。' },
      7: { title: '只读 Worker 结果', body: 'Validator 读取 result.json，但不能修改 output 目录或 Worker 回执。' },
      9: { title: '重新观测', body: 'Validator 不接受 Worker 自报的最终引用率，而是重新读取同一问题集。' },
      15: { title: '整数差值', body: '引用份额差值转换成整数 bps，避免浮点值直接参与链上结算。' },
      18: { title: '验收 Schema', body: '通过状态、收益增量和收款地址必须一起通过 verdictSchema。' },
      25: { title: '裁决文件', body: 'Validator 只输出固定的 verdict/result.json，结算代码不接收临时对象。' },
      26: { title: 'Validator 回执', body: '系统把裁决文件、重新观测证明和 Validator 运行轨迹一起生成回执根。' },
    },
  },
  {
    id: 'settlement',
    filename: 'settle.ts',
    code: `import type { Verdict } from './schemas';

export async function settle() {
  const verdict = await ctx.files.read<Verdict>('/task/verdict/result.json');

  if (!verdict.passed) {
    await ctx.chain.emit('GEORejected', { taskId: ctx.taskId });
    await ctx.files.write('/task/settlement/result.json', {
      status: 'rejected',
    });
    return ctx.receipt.commit('settlement');
  }

  const amount = BigInt(verdict.liftBps) * 100_000_000n;
  const transfer = await ctx.chain.transfer({
    token: 'CNYC',
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

  await ctx.files.write('/task/settlement/result.json', {
    status: 'paid',
    amount,
    txHash: transfer.txHash,
  });
  return ctx.receipt.commit('settlement');
}`,
    notes: {
      4: { title: '读取裁决文件', body: '结算入口不接收调用者传入的 verdict，只读取已经通过 Validator 回执绑定的文件。' },
      6: { title: '拒绝分支', body: '验收未通过时只写拒绝事件和结算结果文件，不产生资产转移。' },
      8: { title: '失败也落盘', body: '失败状态同样写入固定路径，因此完整生命周期不会只留下成功记录。' },
      14: { title: 'amount', body: '1160 bps × 100 CNYC = 116,000 CNYC；使用 bigint 避免金额精度丢失。' },
      15: { title: 'ctx.chain.transfer', body: 'ACVM 检查额度、托管余额、nonce 和 Validator 回执后才执行转账。' },
      17: { title: 'payout', body: '收款地址来自已冻结的裁决文件，结算阶段不能替换。' },
      19: { title: 'memo', body: '转账直接关联 taskId，账本记录与任务文件可以双向查询。' },
      22: { title: 'GEOSettled', body: '公开事件只放结算必要字段，完整文件树仍通过回执根按需核验。' },
      29: { title: '结算结果文件', body: '支付状态、金额和交易哈希先写入固定文件，再由系统生成最终回执。' },
      34: { title: '最终回执', body: '结算回执绑定 transfer 交易、settlement/result.json 和前序 Validator 回执。' },
    },
  },
];

const beats: CodeBeat[] = [
  {
    id: 'contract', fileId: 'contract', layer: '01 / CONTRACT TREE', title: '提交完整业务目录',
    body: '合约根绑定 contract.ts、Schema、Worker、Validator 和结算代码；任一文件变化都会产生新版本。',
    result: 'contractTreeRoot · worker/ · validator/', focus: [4, 25],
  },
  {
    id: 'schemas', fileId: 'schemas', layer: '02 / FILE SCHEMA', title: '先固定文件格式',
    body: '输入、结果和裁决文件共用一份运行时 Schema 与 TypeScript 类型。',
    result: 'order.json · result.json · verdict.json', focus: [3, 23],
  },
  {
    id: 'context', fileId: 'context', layer: '03 / FIXED CONTEXT', title: '系统注入固定能力',
    body: 'ctx 提供预配置的 a3s-code Session、固定文件 ABI、预言机、链操作和回执接口。',
    result: 'code · files · oracle · chain · receipt', focus: [20, 49],
  },
  {
    id: 'worker', fileId: 'worker', layer: '04 / WORKER', title: '输入、证据、结果都落盘',
    body: 'Worker 从固定输入文件开始，把预言机证据、Agent 产物和规范化结果分别写入任务目录。',
    result: 'evidenceRoot · artifactRoot · workerTreeRoot', focus: [5, 37],
  },
  {
    id: 'validator', fileId: 'validator', layer: '05 / VALIDATOR', title: '只读结果，独立裁决',
    body: 'Validator 读取同一输入和 Worker 结果，重新观测后只写 verdict/result.json。',
    result: 'passed · liftBps · validatorTreeRoot', focus: [5, 27],
  },
  {
    id: 'settlement', fileId: 'settlement', layer: '06 / SETTLEMENT', title: '只认已绑定的裁决文件',
    body: '结算代码读取 Validator 文件，通过后调用 ctx 转账，再把交易结果写回任务目录。',
    result: 'transferTx · GEOSettled · settlementReceipt', focus: [3, 35],
  },
];

const tokenPattern = /(\/\/.*$|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\b(?:import|from|export|default|const|type|interface|declare|global|async|function|await|return|if|else|new|as|true|false|unknown|string|number|bigint|boolean|Promise|typeof)\b|\b\d[\d_]*(?:\.\d+)?n?\b|\b(?:ctx|code|files|oracle|chain|receipt|contract|block|schema)\b|\b[A-Z][A-Za-z0-9_]*\b|\b[a-zA-Z_$][\w$]*(?=\s*\()|\b[a-zA-Z_$][\w$]*(?=\s*:)|[{}\[\](),.:;?<>+=*|&!\/-]+)/g;

function tokenClass(token: string) {
  if (token.startsWith('//')) return 'tok-comment';
  if (token.startsWith("'") || token.startsWith('"')) return 'tok-string';
  if (/^\d/.test(token)) return 'tok-number';
  if (/^(?:import|from|export|default|const|type|interface|declare|global|async|function|await|return|if|else|new|as|true|false|unknown|string|number|bigint|boolean|Promise|typeof)$/.test(token)) return 'tok-keyword';
  if (/^(?:ctx|code|files|oracle|chain|receipt|contract|block|schema)$/.test(token)) return 'tok-context';
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
                title={file.filename}
                key={file.id}
              >
                <i>TS</i><span>{file.filename}</span>
              </button>
            ))}
          </nav>
          <footer><span>ROOT</span><small>contract tree</small><span>HASH</span><small>content addressed</small></footer>
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
        <span><i /> CONTRACT TREE LOCKED</span>
        <code>INPUT FILES → WORKER → VERDICT → SETTLEMENT</code>
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
