import Head from 'next/head';
import styles from '../styles/About.module.css';

export default function About() {
  return (
    <div className={styles.container}>
      <Head>
        <title>About Me - Roshan Taneja</title>
        <meta
          name="description"
          content="Learn more about Roshan Taneja, a student passionate about leveraging technology for global impact."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>About Me</h1>
        <section className={styles.section}>
          <p>
            Hi, I’m Roshan Taneja! I’m a high school student with a passion for technology, environmental science, and
            creativity. My work focuses on using AI and remote sensing to solve global challenges like water scarcity.
          </p>
          <p>
            Whether I’m building machine learning models, designing custom trophies, or writing stories, I strive to
            combine technical expertise with a touch of imagination to create meaningful impact.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Key Stats</h2>
          <ul className={styles.statsList}>
            <li><strong>GPA:</strong> 3.94 (Senior GPA: 4.22)</li>
            <li><strong>ACT:</strong> 36 (Math: 36, Science: 36, Reading: 36, English: 34)</li>
            <li><strong>Recognition:</strong> 12+ International Awards</li>
            <li><strong>Research:</strong> 4 Papers Published, 1 Patent Pending</li>
            <li><strong>Languages:</strong> Python, Java, JavaScript, Typescript</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>My Interests</h2>
          <p>
            I enjoy exploring how technology can intersect with creativity and social good. Some of my favorite hobbies
            include:
          </p>
          <ul className={styles.interestsList}>
            <li>Building custom trophies using 3D printing and laser cutting</li>
            <li>Solving algorithmic challenges through competitive programming</li>
            <li>Writing short stories and essays on tech and life</li>
            <li>Performing improv comedy and organizing spontaneous events</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Humanitarian Work</h2>
          <p>
            One of my most rewarding projects is working with the Maasai community in Northern Tanzania. Over the past
            few years, I’ve helped deploy over 100 rainwater harvesting units, reducing daily water collection time from
            9 hours to just 2 hours for over 10,000 people.
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 Roshan Taneja. All Rights Reserved.</p>
      </footer>
    </div>
  );
}