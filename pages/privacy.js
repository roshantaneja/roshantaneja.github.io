import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import Footer from '../components/Footer';
import siteData from '../data/site.json';

export default function Privacy() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Privacy — Roshan Taneja</title>
        <meta
          name="description"
          content="Privacy policy for roshan.codes — what is collected and what is not."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main} style={{ alignItems: 'flex-start' }}>
        <Link href="/" className={styles.backLink}>&larr; Back to Home</Link>

        <h1 className={styles.title} style={{ textAlign: 'left' }}>Privacy</h1>

        <div
          style={{
            maxWidth: '680px',
            width: '100%',
            color: 'var(--fg-1)',
            lineHeight: '1.8',
            fontSize: '0.975rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <p>
            This site uses <strong style={{ color: 'var(--fg-0)' }}>Vercel Analytics</strong> and{' '}
            <strong style={{ color: 'var(--fg-0)' }}>Vercel Speed Insights</strong>, which collect
            anonymized page views and Core Web Vitals. No cookies, no fingerprinting, no session replay.
          </p>
          <p>
            View counts on blog posts use IP address hashing (day-bucketed, truncated, not stored raw)
            to deduplicate within a 24-hour window.
          </p>
          <p>
            No third-party trackers. No Google Analytics. No Meta Pixel.
          </p>
          <p>
            You can opt out by sending <code style={{ color: 'var(--fg-0)', background: 'var(--bg-2)', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>DNT: 1</code> in
            your browser. This site honors it.
          </p>
          <p>
            Source at{' '}
            <a
              href={siteData.urls.sourceRepo}
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/{siteData.owner.github}/{siteData.owner.github}.github.io
            </a>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
