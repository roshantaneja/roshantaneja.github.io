import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/About.module.css';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className={styles.container}>
      <Head>
        <title>About — Roshan Taneja</title>
        <meta
          name="description"
          content="Roshan Taneja — UC Berkeley EECS student, geospatial ML researcher, humanitarian engineer."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Link href="/" className={styles.backLink}>&larr; Back to Home</Link>
        <h1 className={styles.title}>About Me</h1>

        <section className={styles.section}>
          <p>
            I&apos;m a third-year EECS student at UC Berkeley working on geospatial machine
            learning — using satellite data to answer questions about water. My research
            splits across two hemispheres: Sentinel-2 imagery over the Maasai regions of
            Northern Tanzania, where I helped deploy 500 rainwater harvesting units serving
            30,000 people, and ICESat-2 altimetry over the polar oceans, where I&apos;m
            building a Kalman-filter pipeline to track calved icebergs.
          </p>
          <p>
            The Tanzania work produced a NeurIPS 2024 paper (Machine Learning for Social
            Impact track) and a pending US patent for dwelling detection in satellite
            imagery. The iceberg tracker is in active development — you can explore it
            at <Link href="/icebergs">/icebergs</Link>.
          </p>
          <p>
            Outside of research, I write poetry and essays at <Link href="/blog">/blog</Link>.
            I contribute to Cal STAR&apos;s avionics subteam on the Diablo static-fire engine.
            I build small hardware projects at <Link href="/bench">/bench</Link>.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Research</h2>
          <ul className={styles.statsList}>
            <li><strong>NeurIPS 2024</strong> — Machine Learning for Social Impact, High School Track winner</li>
            <li><strong>US Patent Pending</strong> 63/703,232 — Dwelling Detection in Satellite Image Data Using a Model</li>
            <li><strong>ML4EO 2024</strong> — Presented at University of Exeter, UK</li>
            <li><strong>NHSJS</strong> — Two papers published (Oct 2024, Dec 2024)</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Humanitarian Work</h2>
          <p>
            Over the past five years I&apos;ve raised $300K and deployed 500 rainwater
            harvesting units in the Maasai community of Northern Tanzania, reducing daily
            water collection time from 9 hours to under 2 hours for 30,000 people. The
            NeurIPS satellite-ML work grew directly out of this — I needed to know where
            to put the next 100 units.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Interests</h2>
          <ul className={styles.interestsList}>
            <li>Writing poetry and short fiction</li>
            <li>Competitive programming and algorithmic challenges</li>
            <li>Hardware prototyping — PCB design, embedded systems</li>
            <li>Improv comedy</li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
