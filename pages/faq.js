import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import Footer from '../components/Footer';
import siteData from '../data/site.json';

const FAQ = [
  {
    q: "What's your research on?",
    a: "Geospatial ML for water. Tanzania (Sentinel-2 + dwelling detection) and the Labrador Sea (ICESat-2 + Kalman iceberg tracking). The Tanzania work won the NeurIPS 2024 Machine Learning for Social Impact high-school track and has a pending US patent (63/703,232).",
  },
  {
    q: "Are you available for research collaborations?",
    a: "Yes. Reach out via LinkedIn or GitHub — links in the footer.",
  },
  {
    q: "What's Cal STAR?",
    a: "Cal Space Technologies and Rocketry — Berkeley's liquid-propellant rocketry club. I contribute to the Diablo static-fire ground control stack. Details at /bench.",
  },
  {
    q: "What language do you mainly code in?",
    a: "Python for ML and data work. JavaScript/TypeScript for web. C for embedded (Diablo firmware). Some Java for competitive programming.",
  },
  {
    q: "What is map.roshan.codes?",
    a: "It redirects to /tanzania — the interactive map of deployed rainwater harvesting units in Northern Tanzania.",
  },
  {
    q: "Can I read your papers?",
    a: "Yes. Links are in the Publications section on the home page and at nhsjs.com.",
  },
  {
    q: "What is icespy?",
    a: `ICESat-2 iceberg tracking pipeline. Source at github.com/${siteData.owner.github}/icespy. Interactive demo at /icebergs.`,
  },
  {
    q: "Do you do freelance or consulting?",
    a: "Not currently — focused on research and coursework at Berkeley.",
  },
  {
    q: "How is this website built?",
    a: `Next.js 14, deployed on Vercel. MapLibre for the Tanzania map. All source at github.com/${siteData.owner.github}/${siteData.owner.github}.github.io.`,
  },
  {
    q: "What's your background with water issues in Tanzania?",
    a: "Five years working with the Maasai community. 500 rainwater units deployed, $300K raised, 30,000 people served. Full timeline at /tanzania.",
  },
];

export default function Faq() {
  return (
    <div className={styles.container}>
      <Head>
        <title>FAQ — Roshan Taneja</title>
        <meta
          name="description"
          content="Frequently asked questions about Roshan Taneja's research, projects, and background."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main} style={{ alignItems: 'flex-start' }}>
        <Link href="/" className={styles.backLink}>&larr; Back to Home</Link>

        <h1 className={styles.title} style={{ textAlign: 'left', marginBottom: '0.5rem' }}>FAQ</h1>
        <p className={styles.description} style={{ textAlign: 'left', marginLeft: 0, marginRight: 0 }}>
          Answers to questions I get asked often.
        </p>

        <div
          style={{
            width: '100%',
            maxWidth: '760px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {FAQ.map(({ q, a }, i) => (
            <details
              key={i}
              style={{
                borderBottom: '1px solid var(--rule)',
              }}
            >
              <summary
                style={{
                  padding: '1.1rem 0.25rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--fg-0)',
                  userSelect: 'none',
                }}
              >
                {q}
              </summary>
              <p
                style={{
                  padding: '0 0.25rem 1.1rem',
                  color: 'var(--fg-1)',
                  lineHeight: '1.75',
                  fontSize: '0.95rem',
                  margin: 0,
                }}
              >
                {a}
              </p>
            </details>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
