import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Roshan Taneja</title>
        <meta name="description" content="funny description here" />
        <link rel="icon" href="/chevron_left_FILL0_wght400_GRAD0_opsz48.ico" />
      </Head>


      <main className={styles.main}>
        <h1 className={styles.title}>
          Hello, I'm <a href="./resume/Roshan Taneja Resume.pdf" download>Roshan!</a>
        </h1>

        <div>
          <h2 classname={styles.title}>Important Links</h2>
          <a href="https://github.com/roshantaneja" target="_blank" rel="noopener noreferrer" className={styles.description}>
            My Github!
          </a>
          <br />
          <a href="/resume/Roshan%20Taneja%20Resume.pdf" target="_blank" className={styles.description}>
            My Resume (PDF)
          </a>
        </div>

        <br>
        </br>


        <h2 className={styles.title}>Projects</h2>

        <div className={styles.grid}>
          <a href="https://github.com/Daroshi11260/APCSA" target="_blank" rel="noopener noreferrer" className={styles.card}>
            <h2>APCSA &rarr;</h2>
            <p>Homework and project folder for my course learning of APCSA at school</p>
          </a>

          <a href="https://github.com/Daroshi11260/AdventOfCode" target="_blank" rel="noopener noreferrer" className={styles.card}>
            <h2>Advent Of Code &rarr;</h2>
            <p>Daily puzzle advent calendar and solutions repository</p>
          </a>

          <a href="https://roshan.codes/School_Notes" target="_blank" rel="noopener noreferrer" className={styles.card}>
            <h2>School Notes &rarr;</h2>
            <p>Published notes in markdown based notetaking using obsidian</p>
          </a>

          <a href="https://github.com/Daroshi11260/spaceinvaders-reinforcementlearning" target="_blank" rel="noopener noreferrer" className={styles.card}>
            <h2>Space Invaders &rarr;</h2>
            <p>Using reinforcement learning to beat space invaders</p>
          </a>

          <a href="https://roshantaneja.stck.me/" target="_blank" rel="noopener noreferrer" className={styles.card}>
            <h2>My Scrollstack &rarr;</h2>
            <p>sometimes i write things and publish them here, check them out!</p>
          </a>
        </div>
      </main>

      <p className={styles.description}>
          <a href="https://en.wikipedia.org/wiki/Fork_bomb" className={styles.code}>
            {":(){ :|:& };:"}
          </a> {"<---"} paste in ur cmd
          <br>
          </br>
        </p>

      <footer className={styles.footer}>
        Roshan Taneja &copy; all rights reserved.
      </footer>
    </div>
  )
}
