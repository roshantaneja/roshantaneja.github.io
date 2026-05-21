import siteData from '../data/site.json'

const GITHUB_USER = siteData.owner.github

/**
 * Fetch public GitHub activity for the site owner.
 * Returns null if the API call fails or all events are older than 14 days.
 *
 * Called from getStaticProps — must never throw.
 */
export async function getGithubActivity() {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/events/public`,
      {
        headers: {
          'User-Agent': `${GITHUB_USER}-site`,
          'Accept': 'application/vnd.github+json',
        },
      }
    );

    if (!res.ok) return null;

    const events = await res.json();
    if (!Array.isArray(events) || events.length === 0) return null;

    const now = Date.now();
    const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;

    // Check if the most recent event is within 14 days
    const mostRecent = new Date(events[0].created_at).getTime();
    if (now - mostRecent > fourteenDaysMs) return null;

    // Bin events into 14 daily buckets (index 0 = today, 13 = 13 days ago)
    const buckets = new Array(14).fill(0);
    for (const event of events) {
      const age = now - new Date(event.created_at).getTime();
      const dayIndex = Math.floor(age / (24 * 60 * 60 * 1000));
      if (dayIndex >= 0 && dayIndex < 14) {
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
      buckets,            // Array<number> length 14, index 0 = today
      lastPushHours,      // number | null
      fetchedAt: now,
    };
  } catch {
    return null;
  }
}
