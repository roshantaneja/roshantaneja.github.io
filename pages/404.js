import Head from 'next/head';
import { useState, useEffect } from 'react';
import siteData from '../data/site.json';
const styles = {
  container: {
    minHeight: '100vh',
    background: 'var(--bg-0)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    color: 'var(--fg-0)',
  },
  art: {
    background: 'var(--bg-1)',
    border: '1px solid var(--rule)',
    borderRadius: '8px',
    padding: '1.5rem 2rem',
    fontSize: '0.875rem',
    lineHeight: '1.6',
    color: 'var(--fg-1)',
    marginBottom: '2rem',
    whiteSpace: 'pre',
    overflowX: 'auto',
    maxWidth: '100%',
  },
  title: {
    fontSize: '4rem',
    fontWeight: '700',
    color: 'var(--accent-warm)',
    margin: '0 0 0.5rem',
    fontFamily: "'Inter', Roboto, 'Helvetica Neue', sans-serif",
  },
  message: {
    fontSize: '1rem',
    color: 'var(--fg-1)',
    marginBottom: '2rem',
    fontFamily: "'Inter', Roboto, 'Helvetica Neue', sans-serif",
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
    fontFamily: "'Inter', Roboto, 'Helvetica Neue', sans-serif",
  },
  link: {
    color: 'var(--accent)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    borderBottom: '1px solid transparent',
    paddingBottom: '2px',
    transition: 'border-color 120ms',
  },
};

export default function NotFound() {
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const art = `
  ▲
 ▲▲▲
▲▲▲▲▲  ← you tried to land here: ${currentPath || '???'}
  |
  |    404 — empty pad
  |
~~~~~~~
  `.trim();

  return (
    <>
      <Head>
        <title>404 — Roshan Taneja</title>
        <meta name="description" content="Page not found." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={styles.container}>
        <pre style={styles.art}>{art}</pre>

        <h1 style={styles.title}>404</h1>
        <p style={styles.message}>
          That URL doesn&apos;t have a landing pad yet.
        </p>

        <nav style={styles.links} aria-label="Navigation links">
          {[
            { href: '/', label: '← Mission Control' },
            ...siteData.routes.filter(r => r.href === '/projects' || r.href === '/blog'),
          ].map(r => (
            <a key={r.href} href={r.href} style={styles.link}>{r.label}</a>
          ))}
        </nav>
      </div>

    </>
  );
}
