import type { SVGProps } from 'react';

export type IconName =
  | 'arrow'
  | 'bolt'
  | 'brain'
  | 'chain'
  | 'check'
  | 'eye'
  | 'fingerprint'
  | 'github'
  | 'key'
  | 'lock'
  | 'pause'
  | 'play'
  | 'receipt'
  | 'shield'
  | 'spark'
  | 'terminal';

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    bolt: <path d="m13 2-8 11h6l-1 9 8-12h-6l1-8Z" />,
    brain: (
      <>
        <path d="M9.5 4.5A3.5 3.5 0 0 0 6 8v.25A3.5 3.5 0 0 0 5.5 15 3.5 3.5 0 0 0 9 19.5" />
        <path d="M14.5 4.5A3.5 3.5 0 0 1 18 8v.25a3.5 3.5 0 0 1 .5 6.75 3.5 3.5 0 0 1-3.5 4.5M12 4v16M8 9.5h4m0 5h4" />
      </>
    ),
    chain: (
      <>
        <path d="m10 13.5 4-3" />
        <path d="M7.5 16.5 5 19a3 3 0 0 1-4-4l4-4a3 3 0 0 1 4 0" />
        <path d="m16.5 7.5 2.5-2.5a3 3 0 0 1 4 4l-4 4a3 3 0 0 1-4 0" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    fingerprint: (
      <>
        <path d="M12 11a2 2 0 0 1 2 2c0 4-1 7-1 7" />
        <path d="M8 14c0-6 8-6 8 0 0 2-.25 4-.75 6" />
        <path d="M5.5 16.5C5 14 5.3 10 8.3 8.3A7 7 0 0 1 19 14c0 2-.2 3.8-.6 5.5" />
        <path d="M4 11a8.5 8.5 0 0 1 16.5 2M9.5 18.5c.35-1.7.5-3.6.5-5.5" />
      </>
    ),
    github: <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7.4A5.8 5.8 0 0 0 19.3 3 5.4 5.4 0 0 0 19.1 0S17.9-.4 15 1.6a14 14 0 0 0-7 0C5.1-.4 3.9 0 3.9 0A5.4 5.4 0 0 0 3.7 3 5.8 5.8 0 0 0 2.2 7.1c0 5.8 3.5 7 6.8 7.4A4.8 4.8 0 0 0 8 18v4m-4-6c-3 .9-3-2-4-2" />,
    key: (
      <>
        <circle cx="7.5" cy="15.5" r="3.5" />
        <path d="m10 13 9-9m-2 2 2 2m-5 1 2 2" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="3" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" />
      </>
    ),
    pause: <path d="M9 5v14M15 5v14" />,
    play: <path d="m8 5 11 7-11 7V5Z" />,
    receipt: (
      <>
        <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
        <path d="M9 8h6m-6 4h6m-6 4h3" />
      </>
    ),
    shield: <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Zm-3-10 2 2 4-5" />,
    spark: <path d="m12 2 1.4 5.6L19 9l-5.6 1.4L12 16l-1.4-5.6L5 9l5.6-1.4L12 2Zm7 13 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />,
    terminal: <path d="m5 7 4 4-4 4m6 0h7" />,
  };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 2.5 35.2 11v18L20 37.5 4.8 29V11L20 2.5Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="m20 8 10.2 6v12L20 32l-10.2-6V14L20 8Z" fill="currentColor" opacity=".13" />
      <path d="m12.5 25 7.5-13 7.5 13M16 21h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="17.5" fill="none" stroke="currentColor" strokeDasharray="2 5" opacity=".45" />
    </svg>
  );
}
