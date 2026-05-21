import { useState, useMemo } from 'react'
import Link from 'next/link'
import Footer from '../components/Footer'
import CoverGlyph from '../components/blog/CoverGlyph'
import { getAllPosts, getCategoryUniverse } from '../lib/posts-index'
import styles from '../styles/blog-v2.module.css'

export const getStaticProps = async () => {
  const posts = getAllPosts()
  const categories = ['All', ...getCategoryUniverse()]
  return { props: { posts, categories } }
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

export default function Blog({ posts, categories }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [sort, setSort] = useState('newest')

  const filtered = useMemo(() => {
    let list =
      activeCategory === 'All'
        ? posts
        : posts.filter((p) => p.category === activeCategory)
    if (sort === 'oldest') {
      list = [...list].sort(
        (a, b) => new Date(a.date || 0) - new Date(b.date || 0)
      )
    }
    return list
  }, [posts, activeCategory, sort])

  return (
    <>
      <div className={styles.page}>
        <a href="/" className={styles.backLink}>
          &larr; Back to Home
        </a>

        <h1 className={styles.pageTitle}>Blog</h1>
        <p className={styles.pageDesc}>
          Thoughts on tech, poetry, and everything in between.
          {' '}<a href="/feed.xml" style={{ fontSize: '0.85em' }}>RSS</a>
        </p>

        <div className={styles.toolbar}>
          <div className={styles.chipGroup} role="group" aria-label="Filter by category">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.chip} ${activeCategory === cat ? styles.chipActive : ''}`}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
          <label htmlFor="blog-sort" className={styles.srOnly}>
            Sort posts
          </label>
          <select
            id="blog-sort"
            className={styles.sortSelect}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        <div className={styles.postList} role="list">
          {filtered.length === 0 && (
            <p className={styles.emptyState}>No posts in this category yet.</p>
          )}
          {filtered.map((post) => (
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
                  <span className={styles.postReadTime}>{post.readingTime}</span>
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
