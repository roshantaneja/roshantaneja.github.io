import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/projects.module.css';
import homeStyles from '../styles/Home.module.css';
import Footer from '../components/Footer';
import siteData from '../data/site.json';
import projectsData from '../data/projects.json';

// GitHub SVG mark
function GhIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
        0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15
        -.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51
        -1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12
        0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82
        2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95
        .29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0
        0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export default function Projects({ projects, filters }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const ALL_FILTERS = filters;

  const filtered =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.tags.includes(activeFilter));

  return (
    <div className={styles.container}>
      <Head>
        <title>Projects — {siteData.owner.name}</title>
        <meta
          name="description"
          content={`Open source projects by ${siteData.owner.name} — geospatial ML, agents, hardware, and web.`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <a href="/" className={homeStyles.backLink}>&larr; Back to Home</a>

        <h1 className={styles.title}>Projects</h1>
        <p className={styles.subtitle}>
          Things I&apos;ve built, contributed to, or am actively building.
        </p>

        {/* Filter chips */}
        <nav className={styles.filters} aria-label="Filter by tag">
          {ALL_FILTERS.map((f) => (
            <button
              key={f}
              className={`${styles.chip}${activeFilter === f ? ' ' + styles.chipActive : ''}`}
              onClick={() => setActiveFilter(f)}
              aria-pressed={activeFilter === f}
            >
              {f}
            </button>
          ))}
        </nav>

        {/* Grid */}
        <div className={styles.grid}>
          {filtered.length === 0 && (
            <p className={styles.empty}>No projects match this filter.</p>
          )}
          {filtered.map((project) => (
            <article key={project.slug} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTagChip}>
                  {project.tags[0]}
                </span>
                <span className={styles.cardRole}>{project.role}</span>
              </div>

              <h2 className={styles.cardName}>{project.name}</h2>
              <p className={styles.cardPitch}>{project.pitch}</p>

              <div className={styles.cardStack}>
                {project.stack.map((s) => (
                  <span key={s} className={styles.stackChip}>{s}</span>
                ))}
              </div>

              <div className={styles.cardFooter}>
                <a
                  href={`https://github.com/${project.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ghLink}
                  aria-label={`View ${project.name} on GitHub`}
                >
                  <GhIcon className={styles.ghIcon} />
                  {project.github}
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const filters = ['all', ...new Set(projectsData.flatMap((p) => p.tags ?? []))];
  return {
    props: {
      projects: projectsData,
      filters,
    },
  };
}
