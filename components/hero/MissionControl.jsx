import DualGlobe from './DualGlobe';
import ImpactCounters from './ImpactCounters';
import BerkeleyClock from './BerkeleyClock';
import ResearchLedger from './ResearchLedger';
import GithubActivity from './GithubActivity';
import LatestDispatch from './LatestDispatch';
import styles from '../../styles/mission-control.module.css';

/**
 * Mission Control telemetry deck — 6-tile hero section.
 *
 * Props:
 *   activity    — from getStaticProps via lib/github.js (null if unavailable)
 *   latestPost  — { slug, title, date, excerpt } | null
 *   sprint      — string from data/sprint.md
 */
export default function MissionControl({ activity, latestPost, sprint }) {
  return (
    <section aria-label="Mission Control telemetry deck">
      <div className={styles.deck}>
        {/* Tile 1: World map with research site dots */}
        <DualGlobe />

        {/* Tile 2: Humanitarian impact counters */}
        <ImpactCounters />

        {/* Tile 3: Live clock in Berkeley + sprint label */}
        <BerkeleyClock sprint={sprint} />

        {/* Tile 4: Research / publications ledger */}
        <ResearchLedger />

        {/* Tile 5: GitHub commit activity (hidden if no recent data) */}
        {activity ? (
          <GithubActivity activity={activity} />
        ) : null}

        {/* Tile 6: Latest blog post dispatch */}
        {latestPost ? (
          <LatestDispatch post={latestPost} />
        ) : null}
      </div>
    </section>
  );
}
