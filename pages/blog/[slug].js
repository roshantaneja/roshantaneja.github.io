import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import Link from 'next/link'
import Footer from '../../components/Footer'
import CoverGlyph from '../../components/blog/CoverGlyph'
import ViewCount from '../../components/blog/ViewCount'
import ReciteCursor from '../../components/blog/ReciteCursor'
import ScrollProgress from '../../components/blog/ScrollProgress'
import { readingTime } from '../../lib/reading-time'
import { getRelated } from '../../lib/related'
import { enrichPost, getAllPosts } from '../../lib/posts-index'
import siteData from '../../data/site.json'
import styles from '../../styles/blog-v2.module.css'

const blogDirectory = path.join(process.cwd(), 'public', 'blog')

export const getStaticPaths = async () => {
  const posts = getAllPosts()
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const filePath = path.join(blogDirectory, `${params.slug}.md`)
  if (!fs.existsSync(filePath)) return { notFound: true }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)

  // Enrich the current post (read directly from fs to get content)
  const currentRaw = {
    slug: params.slug,
    title: data.title ?? null,
    date: data.date ? String(data.date) : null,
    description: data.description ?? null,
    category: data.category ?? null,
    recite: data.recite ?? undefined,
    tags: Array.isArray(data.tags) ? data.tags : undefined,
    series: data.series ?? undefined,
    seriesLabel: data.seriesLabel ?? undefined,
  }
  const current = enrichPost(currentRaw)

  // Build all posts for related calculation via centralised index
  const allPosts = getAllPosts()

  const related = getRelated(params.slug, allPosts, 3)

  return {
    props: {
      slug: params.slug,
      title: current.title,
      date: current.date,
      description: current.description,
      category: current.category,
      tags: current.tags,
      series: current.series,
      recite: current.recite,
      readTime: readingTime(content),
      content,
      related,
    },
  }
}

function formatDate(raw) {
  if (!raw) return ''
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function DaysAgo({ date }) {
  if (!date) return null
  const d = new Date(date)
  if (isNaN(d.getTime())) return null
  const days = Math.ceil(Math.abs(new Date() - d) / (1000 * 60 * 60 * 24))
  return <span>{days} days ago</span>
}

export default function BlogPost({
  slug,
  title,
  date,
  description,
  category,
  tags,
  series,
  recite,
  readTime,
  content,
  related,
}) {
  const contentRef = useRef(null)

  return (
    <>
      <ScrollProgress />
      <ReciteCursor contentRef={contentRef} enabled={recite} />

      <article className={styles.article}>
        {/* ---- Header with full-bleed cover glyph background ---- */}
        <header className={styles.articleHeader}>
          <div className={styles.coverGlyphFull} aria-hidden="true">
            <CoverGlyph title={title || slug} size={512} slice />
          </div>

          <div className={styles.headerContent}>
            <Link href="/blog" className={styles.articleBackLink}>
              &larr; Blog
            </Link>

            {category && (
              <div className={styles.categoryBadge}>{category}</div>
            )}

            <h1 className={styles.articleTitle}>{title}</h1>

            <div className={styles.articleMeta}>
              <span>{siteData.owner.name}</span>
              {date && (
                <>
                  <span className={styles.articleMetaDot} aria-hidden="true">&middot;</span>
                  <time dateTime={date}>{formatDate(date)}</time>
                </>
              )}
              {date && (
                <>
                  <span className={styles.articleMetaDot} aria-hidden="true">&middot;</span>
                  <DaysAgo date={date} />
                </>
              )}
              <span className={styles.articleMetaDot} aria-hidden="true">&middot;</span>
              <span>{readTime}</span>
              <span className={styles.articleMetaDot} aria-hidden="true">&middot;</span>
              <ViewCount slug={slug} />
            </div>

            {tags && tags.length > 0 && (
              <div className={styles.tagList}>
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className={styles.tagLink}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* ---- Prose content ---- */}
        <div className={styles.content} ref={contentRef}>
          <ReactMarkdown
            rehypePlugins={[rehypeHighlight]}
            components={{
              img({ src, alt }) {
                if (src && src.endsWith('.mp4')) {
                  return (
                    <video
                      controls
                      preload="metadata"
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                        margin: '1.5rem 0',
                      }}
                    >
                      <source src={src} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )
                }
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={alt || ''}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      margin: '1.5rem 0',
                      display: 'block',
                    }}
                  />
                )
              },
              a({ href, children }) {
                const youtubeMatch =
                  href &&
                  href.match(
                    /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
                  )
                if (youtubeMatch) {
                  const videoId = youtubeMatch[1]
                  return (
                    <div
                      style={{
                        position: 'relative',
                        paddingBottom: '56.25%',
                        height: 0,
                        margin: '1.5rem 0',
                      }}
                    >
                      <iframe
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: 0,
                          borderRadius: '8px',
                        }}
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )
                }
                return (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                )
              },
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <pre
                    style={{
                      borderRadius: '8px',
                      overflow: 'auto',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code
                    style={{
                      background: 'var(--bg-2)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      fontSize: '0.9em',
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                )
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* ---- Related posts ---- */}
        {related && related.length > 0 && (
          <section className={styles.relatedSection} aria-label="Related posts">
            <h2 className={styles.relatedTitle}>Related Posts</h2>
            <div className={styles.relatedList}>
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className={styles.relatedItem}
                >
                  <CoverGlyph
                    title={p.title || p.slug}
                    size={40}
                    className={styles.relatedGlyph}
                  />
                  <div>
                    <div className={styles.relatedItemTitle}>
                      {p.title || p.slug}
                    </div>
                    {p.date && (
                      <div className={styles.relatedItemDate}>
                        {formatDate(p.date)}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </article>

      <Footer />
    </>
  )
}
