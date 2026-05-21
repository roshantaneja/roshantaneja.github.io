import Head from 'next/head';
import styles from '../styles/bench.module.css';
import homeStyles from '../styles/Home.module.css';
import Footer from '../components/Footer';

export default function Bench() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Bench — Roshan Taneja</title>
        <meta
          name="description"
          content="Hardware lab — Bench-1 ESP32 telemetry tag and Cal STAR Diablo avionics contributions."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <a href="/" className={homeStyles.backLink}>&larr; Back to Home</a>

        {/* Hero — Bench-1 */}
        <section className={styles.hero}>
          <div className={styles.heroTag}>PERSONAL PROJECT</div>
          <h1>Bench-1</h1>
          <p className={styles.heroTagline}>
            ESP32 telemetry tag I designed, fabbed, and flew on an Estes E12.
          </p>
          <p className={styles.heroSub}>
            25&times;50 mm board: ESP32-S3, BMP390 barometer, LIS3DH accelerometer,
            LoRa SX1262 downlink, microSD logging, LiPo + TP4056 charging.
          </p>
          <div className={styles.heroBadge}>
            IN PROGRESS — build underway
          </div>
        </section>

        {/* Build log */}
        <section className={styles.section}>
          <h2>Build Log</h2>
          <div className={styles.photoGrid}>
            <div className={styles.photoPlaceholder}>KiCad 3D render — coming soon</div>
            <div className={styles.photoPlaceholder}>PCB received from JLCPCB — coming soon</div>
            <div className={styles.photoPlaceholder}>Flight log CSV — pending first launch</div>
          </div>
        </section>

        {/* Cal STAR honest attribution */}
        <section className={styles.section}>
          <div className={styles.attributionBlock}>
            <h2>Cal Space Technologies and Rocketry (STAR) — Diablo Program</h2>
            <p>
              I&apos;m a contributing member of STAR&apos;s avionics subteam, working on the
              ground control stack for the Diablo liquid bipropellant engine static-fire campaign.
              Diablo is a ground test program, not a flight vehicle. The flight software and hardware
              architecture is led by <strong>Kush Mahajan, Adnan Kapadia, Aahil Syed, and Theo Parker</strong>;
              PCB design lives in the club&apos;s private Altium 365 workspace. My contributions
              to the public repos are small and listed below — board design credit belongs to the leads.
            </p>
            <ul className={styles.contribList}>
              <li>
                <a
                  href="https://github.com/calstar/Diablo-FSW"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  calstar/Diablo-FSW
                </a>
                {' '}— firmware for the static-fire control stack
              </li>
              <li>
                <a
                  href="https://github.com/calstar/DiabloAvionics"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  calstar/DiabloAvionics
                </a>
                {' '}— ground station and TC board firmware
              </li>
            </ul>
          </div>
        </section>

        {/* Tools */}
        <section className={styles.section}>
          <h2>Tools I Actually Use</h2>
          <div className={styles.toolList}>
            {['KiCad 8', 'Fusion 360', 'ESP-IDF', 'PlatformIO', 'Saleae Logic 2'].map((t) => (
              <span key={t} className={styles.toolChip}>{t}</span>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
