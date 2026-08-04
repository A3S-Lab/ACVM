import { Player } from '@remotion/player';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export type MotionScene = 'ledger-evolution' | 'transaction-finality' | 'verifiable-execution';

type SceneDefinition = {
  label: string;
  nodes: readonly { title: string; note: string; tone: string }[];
};

const scenes: Record<MotionScene, SceneDefinition> = {
  'ledger-evolution': {
    label: '状态机的三次演化',
    nodes: [
      { title: 'UTXO Ledger', note: '谁拥有价值', tone: '#f7bf68' },
      { title: 'Contract VM', note: '程序怎样改状态', tone: '#8793ff' },
      { title: 'ACVM', note: '链下工作怎样被验收', tone: '#74f7c5' },
    ],
  },
  'transaction-finality': {
    label: '一笔交易如何获得可信确认',
    nodes: [
      { title: 'SIGN', note: '所有者授权', tone: '#f7931a' },
      { title: 'VERIFY', note: '节点独立检查', tone: '#ffd166' },
      { title: 'ORDER', note: '区块确定顺序', tone: '#6ee7f2' },
      { title: 'CONFIRM', note: '重写成本累积', tone: '#74f7c5' },
    ],
  },
  'verifiable-execution': {
    label: 'AI 任务的可验证闭环',
    nodes: [
      { title: 'INTENT', note: '目标与约束签名', tone: '#8793ff' },
      { title: 'WORK', note: '链下执行', tone: '#f4a6ff' },
      { title: 'VERIFY', note: '证据与结果复核', tone: '#ffd166' },
      { title: 'SETTLE', note: '链上推进状态', tone: '#74f7c5' },
    ],
  },
};

function FlowComposition({ scene }: { scene: MotionScene }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const definition = scenes[scene];

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at 50% 38%, #152b33 0%, #081116 62%, #05090c 100%)',
        color: '#ecfff8',
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        padding: 56,
        justifyContent: 'center',
      }}
    >
      <div style={{ position: 'absolute', top: 34, left: 56, letterSpacing: 3, color: '#74f7c5', fontSize: 17 }}>
        FRAME-DRIVEN EXPLAINER · {definition.label}
      </div>
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 18 }}>
        {definition.nodes.map((node, index) => {
          const start = index * 22;
          const progress = spring({ frame: frame - start, fps, config: { damping: 18, stiffness: 120 } });
          const opacity = interpolate(frame, [start, start + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const active = frame >= start && frame < start + 38;
          return (
            <div key={node.title} style={{ display: 'contents' }}>
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: '30px 24px',
                  border: `1px solid ${active ? node.tone : '#29414a'}`,
                  background: active ? `${node.tone}18` : '#0d1b20',
                  boxShadow: active ? `0 0 42px ${node.tone}28` : 'none',
                  opacity,
                  transform: `translateY(${(1 - progress) * 34}px)`,
                }}
              >
                <span style={{ display: 'block', fontFamily: 'monospace', color: node.tone, fontSize: 15, marginBottom: 18 }}>
                  0{index + 1}
                </span>
                <strong style={{ display: 'block', fontSize: 27, letterSpacing: -0.5 }}>{node.title}</strong>
                <span style={{ display: 'block', marginTop: 10, color: '#9eb3bb', fontSize: 15, lineHeight: 1.5 }}>{node.note}</span>
              </div>
              {index < definition.nodes.length - 1 ? (
                <div
                  aria-hidden="true"
                  style={{
                    alignSelf: 'center',
                    color: '#74f7c5',
                    fontSize: 24,
                    opacity: interpolate(frame, [start + 12, start + 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                  }}
                >→</div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 56, right: 56, bottom: 36, height: 2, background: '#1f343c' }}>
        <div
          style={{
            width: `${interpolate(frame, [0, 118], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}%`,
            height: '100%',
            background: '#74f7c5',
          }}
        />
      </div>
    </AbsoluteFill>
  );
}

export function MotionPlayer({ scene, caption }: { scene: MotionScene; caption?: string }) {
  return (
    <figure className="motion-explainer">
      <Player
        component={FlowComposition}
        inputProps={{ scene }}
        durationInFrames={120}
        compositionWidth={960}
        compositionHeight={540}
        fps={30}
        controls
        loop
        style={{ width: '100%', aspectRatio: '16 / 9' }}
      />
      <figcaption>{caption ?? scenes[scene].label}</figcaption>
    </figure>
  );
}
