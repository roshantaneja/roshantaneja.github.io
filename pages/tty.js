import Head from 'next/head';
import { useState, useRef, useEffect, useCallback } from 'react';
import styles from '../styles/tty.module.css';
import footerPoemsData from '../data/footerPoems.json';

const PROMPT = 'roshan@roshan.codes:~$ ';

const POETRY_LINES = footerPoemsData.map((p) => p.line);

const HELP_TEXT = [
  'available commands:',
  '  whoami              — who is this person',
  '  ls                  — list pages',
  '  cat about.md        — short bio',
  '  top                 — current priorities',
  '  traceroute berkeley.edu',
  '  poetry --random     — random line from the blog',
  '  help                — this message',
  '  clear               — clear terminal',
];

function runCommand(raw) {
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();

  if (!trimmed) return [];

  if (lower === 'whoami') {
    return ['roshan taneja — eecs @ berkeley. geospatial ml. two satellites.'];
  }

  if (lower === 'ls') {
    return ['tanzania/  icebergs/  bench/  blog/  about/  projects/'];
  }

  if (lower === 'cat about.md') {
    return [
      'third-year EECS at Berkeley. working on satellite ML for water and ice.',
      'NeurIPS 2024. US patent pending.',
      'sometimes writes poetry.',
    ];
  }

  if (lower === 'top') {
    return [
      'PID   PROCESS                  CPU',
      '───────────────────────────────────',
      '1     icespy               [██████░░] 38%',
      '2     thesis_draft.md      [███░░░░░] 15%',
      '3     course_cs189         [██░░░░░░] 12%',
      '4     email_backlog        [█░░░░░░░]  8%',
    ];
  }

  if (lower === 'traceroute berkeley.edu') {
    return [
      'traceroute to berkeley.edu, 30 hops max',
      ' 1  dorm-router (192.168.1.1)         0.4 ms',
      ' 2  campus-core.berkeley.edu          1.2 ms',
      ' 3  calren.net (128.32.0.1)           2.1 ms',
      ' 4  esnet.net (198.128.60.1)          3.4 ms',
      ' 5  dc-core.berkeley.edu              4.2 ms',
      ' 6  berkeley.edu                      4.9 ms',
    ];
  }

  if (lower === 'poetry --random') {
    const line = POETRY_LINES[Math.floor(Math.random() * POETRY_LINES.length)];
    return [`"${line}"`, '— r'];
  }

  if (lower === 'help') {
    return HELP_TEXT;
  }

  if (lower === 'clear') {
    return null; // special sentinel handled in component
  }

  return [`${trimmed}: command not found. try: help`];
}

// Each entry: { type: 'prompt'|'output'|'error'|'gap', text: string }
const WELCOME = [
  { type: 'output', text: 'roshan.codes terminal v1.0.0' },
  { type: 'output', text: "type 'help' for available commands." },
  { type: 'gap' },
];

export default function Tty() {
  const [lines, setLines] = useState(WELCOME);
  const [input, setInput] = useState('');
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when lines change
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const raw = input;
      const result = runCommand(raw);

      if (result === null) {
        // clear command
        setLines(WELCOME);
      } else {
        setLines((prev) => [
          ...prev,
          { type: 'prompt', text: PROMPT + raw },
          ...result.map((t) => ({
            type: t.includes('command not found') ? 'error' : 'output',
            text: t,
          })),
          { type: 'gap' },
        ]);
      }
      setInput('');
    },
    [input]
  );

  // Clicking anywhere in the terminal focuses the input
  const handleTerminalClick = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <>
      <Head>
        <title>tty — roshan.codes</title>
        <meta name="robots" content="noindex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <p className={styles.hint}>{"// type 'help' for commands"}</p>

        <div
          className={styles.terminal}
          onClick={handleTerminalClick}
          role="application"
          aria-label="Terminal emulator"
        >
          {/* macOS-style title bar */}
          <div className={styles.titlebar} aria-hidden="true">
            <span className={`${styles.dot} ${styles.dotRed}`} />
            <span className={`${styles.dot} ${styles.dotYellow}`} />
            <span className={`${styles.dot} ${styles.dotGreen}`} />
            <span className={styles.titlebarText}>roshan@roshan.codes: ~</span>
          </div>

          {/* Output */}
          <div
            className={styles.output}
            ref={outputRef}
            aria-live="polite"
            aria-atomic="false"
            aria-label="Terminal output"
          >
            {lines.map((l, i) => {
              if (l.type === 'gap') return <div key={i} className={styles.lineGap} />;
              return (
                <div
                  key={i}
                  className={`${styles.line} ${
                    l.type === 'prompt'
                      ? styles.linePrompt
                      : l.type === 'error'
                      ? styles.lineError
                      : styles.lineOutput
                  }`}
                >
                  {l.text}
                </div>
              );
            })}
          </div>

          {/* Input row */}
          <form onSubmit={handleSubmit} className={styles.inputRow} autoComplete="off" spellCheck="false">
            <label htmlFor="tty-input" className={styles.promptLabel} aria-hidden="true">
              {PROMPT}
            </label>
            <input
              id="tty-input"
              ref={inputRef}
              type="text"
              className={styles.inputField}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Terminal input"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </form>
        </div>
      </div>
    </>
  );
}
