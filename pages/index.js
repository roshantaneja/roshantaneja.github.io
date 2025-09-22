import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from "@vercel/analytics/react"

export default function Home() {
  return (
<div className={styles.container}>
  <Head>
    <title>Roshan Taneja</title>
    <meta name="description" content="Student passionate about using technology to solve global problems." />
    <link rel="icon" href="/favicon.ico" />
  </Head>

  <main className={styles.main}>
    <h1 className={styles.title}>
      Hello, I'm <a href="./resume/Roshan Taneja Resume.pdf" className={styles.resumeLink}>Roshan!</a>
      <span className={styles.tooltip}>Click my name for my resumé!</span>
    </h1>

    <p className={styles.description}>
      I'm a student, programmer, researcher, and writer. My work lies at the intersection of technology, machine learning, and environmental sciences, with a focus on solving global water challenges.
    </p>

    <p className={styles.description}>
      I develop machine learning models, analyze satellite imagery, and lead humanitarian projects. My work is aimed at creating lasting solutions for water scarcity, particularly for the Maasai people of Northern Tanzania.
    </p>

    <p className={styles.description}>
      I'm currently a student at the University of California, Berkeley, where I'm pursuing a degree in Computer Science and Electrical Engineering.
    </p>

    {/* add a link to the new AI search feature at https://roshantaneja-github-io-git-development-roshantanejas-projects.vercel.app/ */}

    <p className={styles.description}>
      Try out the experimental portfolio website <a href="https://roshantaneja-github-io-git-development-roshantanejas-projects.vercel.app/" target="_blank" rel="noopener noreferrer" style={{color: '#b200f3'}}> here!</a>
    </p>


    <h2 className={styles.title}>Featured Projects</h2>
    <div className={styles.grid}>
      <a href="/blog" className={styles.card}>
        <h2>My Blog &rarr;</h2>
        <p>I write fiction, publish stories, and share reflections on tech, life, and everything in between.</p>
      </a>

      <a href="/blog/3_faces-of-rainwater-harvesting" className={styles.card}>
        <h2>Faces of Rainwater Harvesting &rarr;</h2>
        <p>Using machine learning to identify indigenous dwellings and improve water accessibility in underserved regions.</p>
      </a>
      
      <a href="/tanzania" className={styles.card}>
        <h2>Bringing Water to the Maasai &rarr;</h2>
        <p>Led the deployment of 100+ rainwater harvesting units, reducing water collection time for 4500+ Maasai people.</p>
      </a>

      {/* <a href="https://github.com/roshantaneja" target="_blank" rel="noopener noreferrer" className={styles.card}>
        <h2>My Github &rarr;</h2>
        <p>Come check out some of the projects I'm working on!</p>
      </a> */}

      <a href="https://github.com/roshantaneja/competitive-programming" target="_blank" rel="noopener noreferrer" className={styles.card}>
        <h2>Competitive Programming &rarr;</h2>
        <p>Daily puzzle advent calendar and my solutions repository—join me in cracking algorithmic challenges!</p>
      </a>

      {/* <a href="https://github.com/roshantaneja/spaceinvaders-reinforcementlearning" target="_blank" rel="noopener noreferrer" className={styles.card}>
        <h2>Space Invaders &rarr;</h2>
        <p>Using reinforcement learning to beat the classic game—exploring AI for fun and learning.</p>
      </a> */}

      {/* <a href="https://roshantaneja.stck.me/" target="_blank" rel="noopener noreferrer" className={styles.card}>
        <h2>My STCK &rarr;</h2>
        <p>I write fiction, publish stories, and share reflections on tech, life, and everything in between.</p>
      </a> */}

      <a href="https://map.roshan.codes" target="_blank" rel="noopener noreferrer" className={styles.card}>
        <h2>Map of Deployed Units &rarr;</h2>
        <p>Interactive map of the deployed rainwater harvesting units in Northern Tanzania.</p>
      </a>

      {/* <a href="https://github.com/roshantaneja/roshantaneja.github.io" target="_blank" rel="noopener noreferrer" className={styles.card}>
        <h2>This Website &rarr;</h2>
        <p>The Code for this website—built with Next.js, React, and Tailwind CSS.</p>
      </a> */}

      <a href="/about" className={styles.card}>
        <h2>More About Me &rarr;</h2>
        <p>Learn more about me, my interests, experiences, and achievements.</p>
      </a>
    </div>

    <h2 className={styles.title}>Publications</h2>
    <div className={styles.grid}>
    <a href="https://nhsjs.com/wp-content/uploads/2024/12/Image-Classification-on-Satellite-Imagery-for-Sustainable-Water-Harvesting-Placement-in-Indigenous-Communities-of-Northern-Tanzania.pdf" className={styles.card}>
        <h2>Remote Sensing and Machine Learning for Water Accessibility in Maasai Regions &rarr;</h2>
        
        <ul>
          <li>Winner NeurIPS 2024 [Machine Learning for Social Impact High School Track]</li>
          <li>Presented at NeurIPS Convention 2024 in Vancouver</li>
          <li>US Patent Pending Number 63/703,232 “Dwelling Detection in Satellite Image Data Using a Model”</li>
          <li>Presented at ML4EO 2024 Conference at Univ. of Exeter UK</li>
          <li>Published in National High School Journal of Science [Dec 2024]</li>
        </ul>
        {/* <p>- Winner NeurIPS 2024 [Machine Learning for Social Impact High School Track]</p>
        <p>- Presented at NeurIPS Convention 2024 in Vancouver</p>
        <p>- US Patent Pending Number 63/703,232 “Dwelling Detection in Satellite Image Data Using a Model”</p>
        <p>- Presented at ML4EO 2024 Conference at Univ. of Exeter UK</p>
        <p>- Published in National High School Journal of Science [Dec 2024]</p> */}
      </a>

      <a href="https://nhsjs.com/wp-content/uploads/2024/10/Evaluating-the-Impact-of-Water-Harvesting.pdf" className={styles.card}>
        <h2>Impact of Rainwater Harvesting Units On Maasai Regions in Northern Tanzania &rarr;</h2>
        <ul>
          <li>Published in National High School Journal of Science [Oct 2024]</li>
          <li>Presidential Volunteer Service Award - Gold Medal [300+ Hours]</li>
          <li>Presented at MDCON23 [Multi-District East-Africa Convention] Audience of 600+ delegates</li>
          <li>Melvin Jones Humanitarian Service Award</li>
        </ul>
        {/* <p>- Published in National High School Journal of Science [Oct 2024]</p>
        <p>- Presidential Volunteer Service Award - Gold Medal [300+ Hours]</p>
        <p>- Presented at MDCON23 [Multi-District East-Africa Convention] Audience of 600+ delegates</p>
        <p>- Melvin Jones Humanitarian Service Award</p> */}
      </a>
    </div>

    <SpeedInsights/>
    <Analytics/>
  </main>

  <footer className={styles.footer}>
  Roshan Taneja &copy; all rights reserved. &nbsp; &nbsp;
    <a href="https://www.github.com/roshantaneja/roshantaneja.github.io" target="_blank" rel="noopener noreferrer" style={{alignSelf: 'right'}}>
    Wanna see how I built this site? Click me to check out the code on GitHub!
    </a>
  </footer>
</div>
  )
}
