import Link from 'next/link'
import Footer from '../../components/Footer'
import CoverGlyph from '../../components/blog/CoverGlyph'
import { getAllPosts, getSeriesUniverse } from '../../lib/posts-index'
import styles from '../../styles/blog-v2.module.css'

export const getStaticPaths = async () => {
  const series = getSeriesUniverse()
  return {
    paths: series.map((s) => ({ params: { series: s.slug } })),
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const { series } = params
  const allPosts = getAllPosts()
  // Series displayed in chronological (reading) order
  const posts = allPosts
    .filter((p) => p.series === series)
    .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))

  const seriesUniverse = getSeriesUniverse()
  const label = seriesUniverse.find((s) => s.slug === series)?.label ?? series

  return {
    props: {
      series,
      label,
      posts,
    },
  }
}

function formatDate(raw) {
  if (!raw) return ''
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function SeriesPage({ series, label, posts }) {
  return (
    <>
      <div className={styles.tagPage}>
        <Link href="/blog" className={styles.backLink}>
          &larr; Blog
        </Link>

        <div className={styles.tagPageHeader}>
          <h1 className={styles.tagPageTitle}>{label}</h1>
          <p className={styles.tagPageCount}>
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} &mdash; reading order
          </p>
        </div>

        <div className={styles.postList} role="list">
          {posts.length === 0 && (
            <p className={styles.emptyState}>
              No posts in this series yet.
            </p>
          )}
          {posts.map((post, idx) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={styles.postRow}
              role="listitem"
            >
              <CoverGlyph
                title={post.title || post.slug}
                size={48}
                className={styles.postGlyph}
              />
              <div className={styles.postMeta}>
                <div className={styles.postTitle}>
                  <span style={{ color: 'var(--fg-2)', marginRight: '0.5rem', fontVariantNumeric: 'tabular-nums' }}>
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  {post.title || post.slug}
                </div>
                {post.description && (
                  <div className={styles.postDescription}>
                    {post.description}
                  </div>
                )}
                <div className={styles.postFooter}>
                  <span className={styles.postDate}>{formatDate(post.date)}</span>
                  {post.readingTime && (
                    <span className={styles.postReadTime}>{post.readingTime}</span>
                  )}
                </div>
              </div>
              <span className={styles.postArrow} aria-hidden="true">
                &rsaquo;
              </span>
            </Link>
          ))}
        </div>

      </div>
      <Footer />
    </>
  )
}
