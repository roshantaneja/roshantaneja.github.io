import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function Home() {
  return (
<div className={styles.container}>
  <Head>
    <title>Roshan Taneja</title>
    <meta name="description" content="High school student passionate about using AI, remote sensing, and technology to solve global problems." />
    <link rel="icon" href="/chevron_left_FILL0_wght400_GRAD0_opsz48.ico" />
  </Head>

  <main className={styles.main}>
  <h1 className={styles.title}>
      Hello, I'm <a href="./resume/Roshan Taneja Resume.pdf" className={styles.resumeLink}>Roshan!</a>
      <span className={styles.tooltip}>Click here for my resume!</span>
    </h1>

    <p className={styles.description}>
      I'm a high school student, programmer, researcher, and writer. <br />
      My passion lies at the intersection of technology, machine learning, <br />
      and environmental sciences, with a focus on solving global water challenges.
    </p>

    <br />

    <h2 className={styles.title}>What I Do</h2>
    <p className={styles.description}>
      I develop machine learning models, analyze satellite imagery, and lead humanitarian <br />
      projects. My work is aimed at creating lasting solutions for water scarcity, <br />
      particularly for the Maasai people of Northern Tanzania.
    </p>

    <h2 className={styles.title}>Projects</h2>
    <div className={styles.grid}>
      <a href="./tanzania" className={styles.card}>
        <h2>Bringing Water to the Maasai &rarr;</h2>
        <p>Led the deployment of 100+ rainwater harvesting units, reducing water collection time for 4500+ Maasai people.</p>
      </a>

      <a href="https://github.com/roshantaneja/water-vision" target="_blank" rel="noopener noreferrer" className={styles.card}>
        <h2>Water Vision &rarr;</h2>
        <p>Leveraging AI and satellite imagery to improve water accessibility and resource management in underserved regions.</p>
      </a>

      <a href="https://github.com/roshantaneja/competitive-programming" target="_blank" rel="noopener noreferrer" className={styles.card}>
        <h2>Competitive Programming &rarr;</h2>
        <p>Daily puzzle advent calendar and my solutions repository—join me in cracking algorithmic challenges!</p>
      </a>

      <a href="https://github.com/roshantaneja/spaceinvaders-reinforcementlearning" target="_blank" rel="noopener noreferrer" className={styles.card}>
        <h2>Space Invaders &rarr;</h2>
        <p>Using reinforcement learning to beat the classic game—exploring AI for fun and learning.</p>
      </a>

      <a href="https://roshantaneja.stck.me/" target="_blank" rel="noopener noreferrer" className={styles.card}>
        <h2>My Scrollstack &rarr;</h2>
        <p>I write fiction, publish stories, and share reflections on tech, life, and everything in between.</p>
      </a>
    </div>
  </main>

  <footer className={styles.footer}>
    Roshan Taneja &copy; all rights reserved.
  </footer>
</div>
  )
}
