import Head from 'next/head';
import styles from '../styles/About.module.css';

export default function About() {
  return (
    <div className={styles.container}>
      <Head>
        <title>About Me - Roshan Taneja</title>
        <meta
          name="description"
          content="Learn more about Roshan Taneja."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <a href="/" className={styles.backLink}> &larr; Back to Home</a>
        <h1 className={styles.title}>About Me</h1>

        <section className={styles.section}>
          <p>
            Hi, I’m Roshan Taneja! I’m a student at UC Berkeley majoring in Electrical Engineering and Computer Science (EECS), driven by a deep commitment to leveraging technology for global social impact. My work blends AI, environmental science, satellite imagery, policy, and human-centered design to solve pressing problems—especially water scarcity in underserved regions.
          </p>
          <p>
            For the past five years, I’ve worked with the Maasai community in Losimingori, Tanzania. What started as a weekend fundraiser evolved into a multi-year, multi-disciplinary project deploying 100+ rainwater harvesting units, reducing daily water collection time from 9 hours to 2 for over 10,000 people. I've collaborated with Maasai elders, organized ideation workshops across language barriers, and used machine learning models and satellite data to optimize water unit placement across 500+ square miles.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Key Stats</h2>
          <ul className={styles.statsList}>
            <li><strong>GPA:</strong> 3.97 (Senior Year GPA: 4.22)</li>
            <li><strong>ACT:</strong> 36 (Math: 36, Science: 36, Reading: 36, English: 34)</li>
            <li><strong>AP Scores:</strong> 5s in Calculus BC, Physics 1, Physics C: Mechanics, Computer Science A; 4s in English Literature, Macro, Micro; 3s in English Language, Spanish; Patent pending</li>
            <li><strong>Awards:</strong> NeurIPS 2024 Winner (ML for Social Impact), UN SDG Youth Voices Award (#6 - Water), Melvin Jones International Humanitarian Award, President’s Volunteer Service Gold Medal, International Children’s Peace Prize Nominee</li>
            <li><strong>Publications:</strong> 2 peer-reviewed papers in NHSJS, featured in Harvard’s Spatial Data Lab blog and Sacred Heart Magazine</li>
            <li><strong>Technical Skills:</strong> Python, JavaScript/TypeScript, Java, Google Earth Engine, TensorFlow, ArcGIS, Fusion360</li>
            <li><strong>Creative Tools:</strong> CAD, 3D Printing, Laser Cutting, Adobe Illustrator</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Research & Academic Work</h2>
          <p>
            I’m currently a research intern at Harvard’s Spatial Data Lab, working with Prof. Siqin Wang on modeling flood runoff and topographical analysis to plan reservoir locations for rural East African communities. I’ve taken courses in Remote Sensing (MIT Beaver Works), Climate Science (UC Berkeley), and Data Science (UCLA), which have helped me integrate technical knowledge with field applications.
          </p>
          <p>
            I’ve presented my work at major conferences like NeurIPS 2024 (selected 1 of 4 from 330+ global entries), ML4EO at University of Exeter, and the Lions East Africa MDCON24 conference. My patented object detection model uses satellite data to identify bomas (Maasai dwellings), achieving 93% accuracy and enabling data-informed placement of water units. These tools are now being extended to model runoff and inform sustainable reservoir planning.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Leadership & Initiatives</h2>
          <ul className={styles.statsList}>
            <li>Youth President, Water Programs at Maji Wells – Led international student teams in deploying water units, policy co-creation, and cross-cultural collaboration with Maasai leaders</li>
            <li>Class Officer at Sacred Heart Preparatory – Organized 25+ school-wide events, created lasting school traditions across 500+ students</li>
            <li>Founder & President of Improv Club – Revived and expanded to 35+ active members, led workshops, open mics, and performances</li>
            <li>Hardware Lead for Robotics – Built 3 state-qualifying robots; developed a CAD parts library; mentored freshmen via hands-on crash courses</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Personal Projects & Hobbies</h2>
          <p>I’m constantly exploring intersections of tech, creativity, and fun. My hobbies include:</p>
          <ul className={styles.interestsList}>
            <li>Creating custom trophies like the “Dumpster Fire Award” – a blowtorched, scrap-metal tribute to resilience in robotics competitions</li>
            <li>Improv comedy – I love the spontaneity and laughter of performing, especially organizing “surprise improv” events at school</li>
            <li>Writing – My short story "Pomegranates" was published in three literary journals and included in my school’s AP English curriculum</li>
            <li>Thrifting and upcycling furniture – From skateboards on my wall to reupholstered chairs, I love giving old things new life</li>
            <li>Spontaneous side projects – I’ve built a Space Invaders AI, simulated water-sharing policies, and played with What3Words datasets</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>What Drives Me</h2>
          <p>
            My work is animated by a belief that technological solutions should always be grounded in the needs, cultures, and ideas of the communities they serve. Whether I’m mentoring younger students, debugging a ML model, or sharing water policy ideas in Swahili using hand-drawn sketches, I care deeply about inclusion, accessibility, and making an impact that lasts.
          </p>
          <p>
            I’ve learned to work with everyone—from venture capitalists and scientists to village elders and middle schoolers. Each person brings unique insights, and I see my role as connecting the dots, building bridges, and creating real-world tools that matter.
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 Roshan Taneja. All Rights Reserved.</p>
      </footer>
    </div>
  );
}