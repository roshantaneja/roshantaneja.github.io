import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/tanzania.module.css';
import Footer from '../components/Footer';
import HemisphereBridge from '../components/icebergs/HemisphereBridge';
import Timeline from '../components/tanzania/Timeline';
import tanzaniaTimelineEvents from '../data/tanzania/timelineEvents';
import impact from '../data/impact.json';
import siteData from '../data/site.json';

// Where the interactive unit map lives. The map used to be embedded on this
// page; it now has its own home and this page is the narrative timeline only.
const MAP_URL = 'https://map.roshan.codes';

const NUMBER_FORMATS = {
  int: (n) => n.toLocaleString('en-US'),
  'usd-compact': (n) => `$${Math.round(n / 1000)}K`,
};

export default function Tanzania() {
  const firstYear = 2020;
  const lastYear = 2024;

  return (
    <div className={styles.page}>
      <Head>
        <title>Rainwater for the Maasai — {siteData.owner.name}</title>
        <meta
          name="description"
          content="A four-year timeline of deploying rainwater harvesting units with the Maasai community of Northern Tanzania."
        />
        <link rel="canonical" href={`${siteData.urls.site}/tanzania`} />
        <link rel="icon" href={siteData.meta.favicon} />
      </Head>

      <main className={styles.timelinePage}>
        <Link href="/" className={styles.backLink}>&larr; Back to Home</Link>

        {/* ── Masthead ─────────────────────────────────────────────── */}
        <header className={styles.masthead}>
          <p className={styles.eyebrow}>
            Northern Tanzania · {firstYear}&ndash;{lastYear}
          </p>
          <h1 className={styles.mastheadTitle}>Rainwater for the Maasai</h1>
          <p className={styles.lede}>
            What began as a round of phone calls in {firstYear} became {impact.units}{' '}
            rainwater harvesting units across the Maasai regions outside Arusha.
            Daily water collection fell from roughly nine hours to under two. This
            is how it happened, entry by entry.
          </p>

          <dl className={styles.stats}>
            {impact.counters.map(({ key, label, format }) => (
              <div key={key} className={styles.stat}>
                <dt className={styles.statLabel}>{label}</dt>
                <dd className={styles.statValue}>
                  {(NUMBER_FORMATS[format] ?? NUMBER_FORMATS.int)(impact[key])}
                </dd>
              </div>
            ))}
          </dl>
        </header>

        {/* ── The timeline ─────────────────────────────────────────── */}
        <Timeline events={tanzaniaTimelineEvents} />

        {/* ── Hand-off to the map ──────────────────────────────────── */}
        <aside className={styles.mapCta}>
          <p className={styles.mapCtaLabel}>Where they landed</p>
          <h2 className={styles.mapCtaTitle}>Explore the unit map</h2>
          <p className={styles.mapCtaText}>
            Every deployed unit, plotted with the field photograph taken at its
            site — plus the Nanja Dam catchment rings used to pick the next
            hundred locations.
          </p>
          <a className={styles.mapCtaLink} href={MAP_URL}>
            map.roshan.codes
            <span aria-hidden="true">&rarr;</span>
          </a>
        </aside>
      </main>

      <HemisphereBridge currentSlug="tanzania" />
      <Footer />
    </div>
  );
}
