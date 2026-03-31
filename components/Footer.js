import styles from '../styles/Home.module.css';

const footerLinks = [
  { label: 'GitHub', href: 'https://github.com/roshantaneja', external: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/roshantaneja/', external: true },
  { label: 'Blog', href: '/blog', external: false },
  { label: 'Tanzania Project', href: '/tanzania', external: false },
  { label: 'Map of Units', href: 'https://map.roshan.codes', external: true },
  { label: 'Resumé', href: '/resume/Roshan Taneja Resume.pdf', external: true },
  { label: 'Source Code', href: 'https://github.com/roshantaneja/roshantaneja.github.io', external: true },
];

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© {currentYear} Roshan Taneja. All rights reserved.</p>
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
    </footer>
  );
}

