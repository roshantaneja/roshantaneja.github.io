import siteData from '../data/site.json'

const GITHUB_USER = siteData.owner.github
const WINDOW_DAYS = 42 // 6 weeks

/**
 * Fetch public GitHub activity for the site owner.
 * Returns null if the API call fails or all events are older than WINDOW_DAYS.
 *
 * Called from getStaticProps — must never throw.
 */
export async function getGithubActivity() {
  try {
    // GitHub Events API returns max 300 events over 3 pages; fetch all to cover 6 weeks
    const pages = await Promise.all(
      [1, 2, 3].map((page) =>
        fetch(
          `https://api.github.com/users/${GITHUB_USER}/events/public?per_page=100&page=${page}`,
          {
            headers: {
              'User-Agent': `${GITHUB_USER}-site`,
              'Accept': 'application/vnd.github+json',
            },
          }
        ).then((r) => (r.ok ? r.json() : []))
      )
    );

    const events = pages.flat().filter((e) => e && e.created_at);
    if (events.length === 0) return null;

    const now = Date.now();
    const windowMs = WINDOW_DAYS * 24 * 60 * 60 * 1000;

    // Check if the most recent event is within the window
    const mostRecent = new Date(events[0].created_at).getTime();
    if (now - mostRecent > windowMs) return null;

    // Bin events into WINDOW_DAYS daily buckets (index 0 = today)
    const buckets = new Array(WINDOW_DAYS).fill(0);
    for (const event of events) {
      const age = now - new Date(event.created_at).getTime();
      const dayIndex = Math.floor(age / (24 * 60 * 60 * 1000));
      if (dayIndex >= 0 && dayIndex < WINDOW_DAYS) {
        buckets[dayIndex]++;
      }
    }

    // "last push X hours ago" — find most recent push event
    const lastPush = events.find(
      (e) => e.type === 'PushEvent' || e.type === 'CreateEvent'
    );
    let lastPushHours = null;
    if (lastPush) {
      const diffMs = now - new Date(lastPush.created_at).getTime();
      lastPushHours = Math.round(diffMs / (1000 * 60 * 60));
    }

    return {
      buckets,            // Array<number> length 42, index 0 = today
      lastPushHours,      // number | null
      fetchedAt: now,
    };
  } catch {
    return null;
  }
}
