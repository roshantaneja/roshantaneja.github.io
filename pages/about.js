import Head from 'next/head';
import styles from '../styles/About.module.css';

export default function About() {
  return (
    <div className={styles.container}>
      <Head>
        <title>About Me - Roshan Taneja</title>
        <meta
          name="description"
          content="Detailed profile of Roshan Taneja, student passionate about technology, environmental science, and creative community-building."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <a href="/" className={styles.backLink}> &larr; Back to Home</a>
        <h1 className={styles.title}>About Me - Roshan Taneja</h1>

        <section className={styles.section}>
          <p>
            Hi, I’m Roshan Taneja, currently pursuing Electrical Engineering & Computer Science at UC Berkeley. My passion lies in harnessing technology—especially AI, machine learning, and remote sensing—to tackle global environmental challenges, with a deep focus on addressing water scarcity.
          </p>
          <p>
            My academic journey is complemented by real-world experiences, from hands-on humanitarian projects to research collaborations with top institutions.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Academic Achievements & Credentials</h2>
          <ul className={styles.statsList}>
            <li><strong>GPA:</strong> 3.97 (Senior GPA: 4.22)</li>
            <li><strong>ACT:</strong> Perfect 36 (Math: 36, Science: 36, Reading: 36, English: 34)</li>
            <li><strong>AP Exams:</strong> Calculus BC (5), Physics 1 (5), Physics C Mechanics (5), Computer Science A (5), English Literature (4), Macroeconomics (4), Microeconomics (4), English Language (3), Spanish Language (3), Physics C E&M (2)</li>
            <li><strong>Specialized Coursework:</strong> Advanced Mathematics, Machine Learning, Data Structures & Algorithms, Climate Science, Remote Sensing, Global Mathematics</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Awards & Honors</h2>
          <ul className={styles.statsList}>
            <li>NeurIPS 2024 Winner: ML for Social Impact (1 of 4 winners among 330 global entries)</li>
            <li>President’s Volunteer Service Award, Gold Medal 2024</li>
            <li>Melvin Jones International Humanitarian Award 2024</li>
            <li>Nominee, International Children’s Peace Prize 2024</li>
            <li>Next Generation Foresight Practitioner UN SDG #6 Award 2023</li>
            <li>Computer Science Department Honor 2025</li>
            <li>Rotary Computer Science Award 2023</li>
            <li>AP Scholar with Distinction 2024</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Research, Publications & Patents</h2>
          <ul className={styles.statsList}>
            <li><strong>Patent Pending:</strong> Object Detection in Satellite Imagery for Rainwater Harvesting Unit Placement (US Patent Pending 63/703,232)</li>
            <li><strong>Publications:</strong>
              <ul>
                <li>"Assessing the Impact of Rainwater Harvesting on 4500+ Maasai," NHSJS, 2024</li>
                <li>"Object Detection in Satellite Imagery for Rainwater Units Placement," NHSJS, 2024</li>
              </ul>
            </li>
            <li><strong>Conference Presentations:</strong>
              <ul>
                <li>NeurIPS High School Presenter, Vancouver, 2024</li>
                <li>ML4EO Conference, University of Exeter, UK, 2024</li>
                <li>MDCON23 Lions International Conference, Tanzania, 2023</li>
              </ul>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Leadership & Community Contributions</h2>
          <ul className={styles.statsList}>
            <li><strong>Youth President at Maji Wells:</strong> Led fundraising of over $100K and deployed 200 rainwater harvesting units, significantly reducing water collection time for 10,000 Maasai in Tanzania</li>
            <li><strong>Class Officer at Sacred Heart Prep:</strong> Organized and introduced three annual community-building events for 500+ students</li>
            <li><strong>Co-Founder of Improv Club:</strong> Fostered creative expression and built strong community bonds through improv performances and workshops</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Technical Expertise & Skills</h2>
          <ul className={styles.statsList}>
            <li><strong>Languages:</strong> Python, Java, JavaScript, TypeScript</li>
            <li><strong>Frameworks & Tools:</strong> TensorFlow, Google Earth Engine, 3D Printing, Laser Cutting, CAD software, Machine Learning Algorithms</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Creative Projects & Interests</h2>
          <p>
            I specialize in creating custom trophies, including the beloved "Dumpster Fire Award," and have contributed creatively to numerous school events and traditions. My passion for storytelling extends to short stories, published in literary magazines such as The Ravens Perch and Beyond Words.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Family & Personal Background</h2>
          <p>
            Raised in a supportive multigenerational household alongside my parents, younger brother Yuvraj, and grandparents, my family has deeply shaped my academic and personal growth.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Connect With Me</h2>
          <ul className={styles.statsList}>
            <li><a href="https://roshan.codes">Personal Website</a></li>
            <li><a href="https://github.com/roshantaneja">GitHub</a></li>
            <li><a href="https://linkedin.com/in/roshan-taneja">LinkedIn</a></li>
            <li>Email: rytaneja@gmail.com | rtaneja@berkeley.edu</li>
          </ul>
        </section>

      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 Roshan Taneja. All Rights Reserved.</p>
      </footer>
    </div>
  );
}