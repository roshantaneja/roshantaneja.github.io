import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import siteData from '../data/site.json';
import FOOTER_LINES from '../data/footerPoems.json';

const footerLinks = siteData.footerLinks;

const currentYear = new Date().getFullYear();

// Deterministic per page-load — same session sees the same line.
function pickLine() {
  const idx = Math.floor(Math.random() * FOOTER_LINES.length);
  return FOOTER_LINES[idx];
}

export default function Footer() {
  const [poem, setPoem] = useState(null);

  useEffect(() => {
    setPoem(pickLine());
  }, []);

  return (
    <footer className={styles.footer}>
      {poem && (
        <p className={styles.footerPoem}>
          &ldquo;{poem.line}&rdquo;&nbsp;
          <a href={`/blog/${poem.slug}`} className={styles.footerPoemLink} aria-label="Read this post">
            &mdash; r
          </a>
        </p>
      )}
      <nav className={styles.footerLinks} aria-label="Footer links">
        {footerLinks.map(({ label, href, external }) => (
          <a
            key={label}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className={styles.footerLink}
          >
            {label}
          </a>
        ))}
      </nav>
      <p>&copy; {currentYear} {siteData.owner.name}. All rights reserved.</p>
    </footer>
  );
}
