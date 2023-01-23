import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Roshan Taneja</title>
        <meta name="description" content="can i puts my bawls in yo jaws" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className={styles.main}>
        <h1 className={styles.title}>
          Hi, im <a href="./resume/Roshan Taneja Resume.pdf" download>Roshan Taneja!</a>
        </h1>

        <p className={styles.description}>
          {/*I like{' '}*/}
          {/*<code className={styles.code}>systems programming</code>*/}
          <br>
          </br>
          <a href="https://en.wikipedia.org/wiki/Fork_bomb" className={styles.code}>
            {":(){ :|:& };:"}
          </a> {"<---"} paste in ur cmd pls 👉👈
          <br>
          </br>
          (dont actually do that its a fork bomb haha)
        </p>

        <a href="https://github.com/Daroshi11260" target="_blank" rel="noopener noreferrer" className={styles.description}>
          Check out my Github! &rarr;
        </a>


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

          <a href="https://github.com/Daroshi11260/School_Notes" target="_blank" rel="noopener noreferrer" className={styles.card}>
            <h2>School Notes &rarr;</h2>
            <p>Markdown based notetaking using github through obsidian</p>
          </a>

          <a href="https://github.com/Daroshi11260/spaceinvaders-reinforcementlearning" target="_blank" rel="noopener noreferrer" className={styles.card}>
            <h2>Space Invaders &rarr;</h2>
            <p>Using reinforcement learning to beat space invaders</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a>bing bong your opinion is wrong</a>
      </footer>
    </div>
  )
}
