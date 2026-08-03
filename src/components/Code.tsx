import { useState } from 'react';
import { InnerLine, Pre, type AnnotationHandler, type HighlightedCode } from 'codehike/code';

type CodeProps = {
  codeblock: HighlightedCode;
};

const lineNumbers: AnnotationHandler = {
  name: 'line-numbers',
  Line: (props) => (
    <div className="ch-code-row">
      <span className="ch-code-line__number" aria-hidden="true">{props.lineNumber}</span>
      <InnerLine merge={props} className="ch-code-source" />
    </div>
  ),
};

const focus: AnnotationHandler = {
  name: 'focus',
  onlyIfAnnotated: true,
  Line: (props) => <InnerLine merge={props} className="ch-code-source is-dimmed" />,
  AnnotatedLine: (props) => <InnerLine merge={props} className="ch-code-source is-focused" />,
};

const mark: AnnotationHandler = {
  name: 'mark',
  onlyIfAnnotated: true,
  AnnotatedLine: (props) => <InnerLine merge={props} className="ch-code-source is-marked" />,
};

const diff: AnnotationHandler = {
  name: 'diff',
  onlyIfAnnotated: true,
  AnnotatedLine: (props) => (
    <InnerLine
      merge={props}
      className={`ch-code-source is-diff is-${props.annotation.query === '-' ? 'removed' : 'added'}`}
    />
  ),
};

function codeTitle(meta: string, lang: string) {
  const quoted = meta.match(/(?:title|file)=["']([^"']+)["']/)?.[1];
  const bare = meta.match(/(?:title|file)=([^\s]+)/)?.[1];
  return quoted ?? bare ?? `${lang || 'text'} example`;
}

export function Code({ codeblock }: CodeProps) {
  const [copied, setCopied] = useState(false);
  const title = codeTitle(codeblock.meta, codeblock.lang);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(codeblock.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <figure className="ch-code" data-language={codeblock.lang}>
      <figcaption>
        <span><i aria-hidden="true" />{title}</span>
        <button type="button" onClick={() => void copy()} aria-label={`复制 ${title}`}>
          {copied ? '已复制' : '复制'}
        </button>
      </figcaption>
      <Pre code={codeblock} handlers={[lineNumbers, focus, mark, diff]} />
    </figure>
  );
}
