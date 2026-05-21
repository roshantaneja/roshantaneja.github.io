import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Footer from '../components/Footer';
import MissionControl from '../components/hero/MissionControl';
import { getGithubActivity } from '../lib/github';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import siteData from '../data/site.json';

export default function Home({ activity, latestPost, sprint, featuredProjects, publications }) {
  const [bubbleActive, setBubbleActive] = useState(false);

  return (
    <div className={styles.container}>
      <Head>
        <title>{siteData.meta.title}</title>
        <meta
          name="description"
          content={siteData.meta.description}
        />
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content={siteData.meta.themeColor} />
        <link rel="icon" href={siteData.meta.favicon} />
      </Head>

      <main className={styles.main}>

        {/* ── Greeting ─────────────────────────────────────────────── */}
        <div className={styles.greeting}>
          <p className={styles.greetingText}>
            Hi! I&apos;m{' '}
            <span
              className={styles.nameWrap}
              onMouseEnter={() => setBubbleActive(true)}
              onMouseLeave={() => setBubbleActive(false)}
            >
              <span className={styles.greetingBubbleWrap} aria-hidden="true">
                <span
                  className={`${styles.greetingBubble}${bubbleActive ? ' ' + styles.greetingBubbleActive : ''}`}
                  style={{ animation: 'greetingFloat 2.6s ease-in-out infinite' }}
                >
                  click my name for my resume!
                </span>
              </span>
              <a
                href={siteData.urls.resume}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.greetingName}
              >
                {siteData.owner.name}
              </a>
            </span>
          </p>
        </div>

        {/* ── Mission Control hero ─────────────────────────────────── */}
        <MissionControl
          activity={activity}
          latestPost={latestPost}
          sprint={sprint}
        />

        {/* ── Featured Projects ────────────────────────────────────── */}
        <h2 className={styles.title}>Featured Projects</h2>
        <div className={styles.grid}>
          {featuredProjects.map((p) => (
            <a
              key={p.href}
              href={p.href}
              className={styles.card}
              {...(p.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <h2>{p.title} &rarr;</h2>
              <p>{p.blurb}</p>
            </a>
          ))}
        </div>

        {/* ── Publications ─────────────────────────────────────────── */}
        <h2 className={styles.title}>Publications</h2>
        <div className={styles.grid}>
          {publications.map((pub) => (
            <a key={pub.href || pub.award} href={pub.href} className={styles.card}>
              <h2>{pub.title} &rarr;</h2>
              <ul>{pub.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
            </a>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  // ── GitHub activity ────────────────────────────────────────────
  let activity = null;
  try {
    activity = await getGithubActivity();
  } catch {
    activity = null;
  }

  // ── Sprint label ───────────────────────────────────────────────
  let sprint = '';
  try {
    const sprintPath = path.join(process.cwd(), 'data', 'sprint.md');
    sprint = fs.readFileSync(sprintPath, 'utf8').trim();
  } catch {
    sprint = '';
  }

  // ── Latest blog post ───────────────────────────────────────────
  let latestPost = null;
  try {
    const blogDir = path.join(process.cwd(), 'public', 'blog');
    const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'));

    // Sort by numeric prefix (e.g. "23_foo.md" → 23)
    files.sort((a, b) => {
      const numA = parseInt(a.split('_')[0], 10) || 0;
      const numB = parseInt(b.split('_')[0], 10) || 0;
      return numB - numA; // descending
    });

    const newestFile = files[0];
    if (newestFile) {
      const filePath = path.join(blogDir, newestFile);
      const raw = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter, content } = matter(raw);

      // slug = filename without .md
      const slug = newestFile.replace(/\.md$/, '');

      // First 12 words of body content (strip markdown syntax)
      const bodyText = content
        .replace(/#+\s/g, '')        // headings
        .replace(/\*\*/g, '')        // bold
        .replace(/\*/g, '')          // italic
        .replace(/`[^`]*`/g, '')     // inline code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
        .replace(/\n+/g, ' ')        // newlines
        .trim();
      const words = bodyText.split(/\s+/).filter(Boolean);
      const excerpt = words.slice(0, 12).join(' ');

      latestPost = {
        slug,
        title: frontmatter.title || slug,
        date: frontmatter.date || null,
        excerpt,
      };
    }
  } catch {
    latestPost = null;
  }

  // ── Featured Projects ──────────────────────────────────────────
  const featuredProjectsPath = path.join(process.cwd(), 'data', 'featured-projects.json');
  const featuredProjects = JSON.parse(fs.readFileSync(featuredProjectsPath, 'utf8'));

  // ── Publications ───────────────────────────────────────────────
  const publicationsPath = path.join(process.cwd(), 'data', 'publications.json');
  const allPublications = JSON.parse(fs.readFileSync(publicationsPath, 'utf8'));
  const publications = allPublications.filter(
    (pub) => pub.title !== null && pub.bullets && pub.bullets.length > 0
  );

  return {
    props: {
      activity,
      latestPost,
      sprint,
      featuredProjects,
      publications,
    },
    revalidate: 300,
  };
}
