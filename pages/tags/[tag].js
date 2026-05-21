import Link from 'next/link'
import Footer from '../../components/Footer'
import CoverGlyph from '../../components/blog/CoverGlyph'
import { getAllPosts, getTagUniverse } from '../../lib/posts-index'
import styles from '../../styles/blog-v2.module.css'

export const getStaticPaths = async () => {
  const tags = getTagUniverse()
  return {
    paths: tags.map((tag) => ({ params: { tag } })),
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const { tag } = params
  const allPosts = getAllPosts()
  const posts = allPosts.filter(
    (p) => Array.isArray(p.tags) && p.tags.includes(tag)
  )

  return {
    props: {
      tag,
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

export default function TagPage({ tag, posts }) {
  const label = tag.replace(/-/g, ' ')

  return (
    <>
      <div className={styles.tagPage}>
        <Link href="/blog" className={styles.backLink}>
          &larr; Blog
        </Link>

        <div className={styles.tagPageHeader}>
          <h1 className={styles.tagPageTitle}>#{label}</h1>
          <p className={styles.tagPageCount}>
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>

        <div className={styles.postList} role="list">
          {posts.length === 0 && (
            <p className={styles.emptyState}>
              No posts tagged with &ldquo;{label}&rdquo; yet.
            </p>
          )}
          {posts.map((post) => (
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
                  <span className={styles.postCategoryBadge}>{post.category}</span>
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
