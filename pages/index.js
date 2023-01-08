import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Roshan Taneja</title>
        <meta name="description" content="can i puts yo bawls in yo jaws" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <!-- Google tag (gtag.js) -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-6302CZ25FK"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-6302CZ25FK');
      </script>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Hi, im <a href="https://roshan.codes">Roshan!</a>
        </h1>

        <p className={styles.description}>
          {/*I like{' '}*/}
          {/*<code className={styles.code}>systems programming</code>*/}
          <br>
          </br>
          <br>
          </br>
          <code className={styles.code}>
            {":(){ :|:& };:"}
          </code> {"<---"} paste in ur cmd pls 👉👈
          <br>
          </br>
          (dont actually do that its a fork bomb haha)
        </p>

        <p className={styles.description}>Here are some of the projects i've worked on</p>

        <div className={styles.grid}>
          <a href="https://github.com/Daroshi11260/APCSA" className={styles.card}>
            <h2>APCSA &rarr;</h2>
            <p>Homework and project folder for my course learning of APCSA at school</p>
          </a>

          <a href="https://github.com/Daroshi11260/AdventOfCode" className={styles.card}>
            <h2>Advent Of Code &rarr;</h2>
            <p>Daily puzzle advent calendar and solutions repository</p>
          </a>

          <a href="https://github.com/Daroshi11260/School_Notes" className={styles.card}>
            <h2>School Notes &rarr;</h2>
            <p>Markdown based notetaking using github through obsidian</p>
          </a>

          <a href="https://github.com/Daroshi11260/spaceinvaders-reinforcementlearning" className={styles.card}>
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
