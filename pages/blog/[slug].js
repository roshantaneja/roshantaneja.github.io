import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import styles from '../../styles/blog.module.css';
import styles2 from '../../styles/Home.module.css';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const blogDirectory = path.join(process.cwd(), 'public', 'blog');

export const getStaticPaths = async () => {
    // Read all entries in the blog directory
    const entries = fs.readdirSync(blogDirectory, { withFileTypes: true });

    // Filter for markdown files only
    const markdownFiles = entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.md'));

    const paths = markdownFiles.map((file) => ({
        params: {
            slug: file.name.replace('.md', ''), // Remove .md extension
        },
    }));

    return {
        paths,
        fallback: false, // Return 404 for invalid paths
    };
};

export const getStaticProps = async ({ params }) => {
    const filePath = path.join(blogDirectory, `${params.slug}.md`);

    // Check if the file exists (shouldn't be necessary but ensures robustness)
    if (!fs.existsSync(filePath)) {
        return { notFound: true };
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
        props: {
            title: data.title,
            date: data.date,
            description: data.description,
            content,
        },
    };
};

export default function BlogPost({ title, date, content }) {
    const postDate = new Date(date);
    const currentDate = new Date();
    const timeDiff = Math.abs(currentDate - postDate);
    const daysAgo = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return (
        <div className={styles2.container}>
            <main className={styles2.main}>
                <a href="/blog" className={styles2.backLink}> &larr; Back to Blog</a>
                <h1 className={styles2.title}>{title}</h1>
                <p><small>{new Date(date).toLocaleDateString()}</small></p>
                <p><small>{daysAgo} days ago</small></p>
                <p>Roshan Taneja</p>
                
                {/* Add wrapper for markdown content */}
                <div className={styles.contentWrapper}>
                <ReactMarkdown
                    rehypePlugins={[rehypeHighlight]} // Adds syntax highlighting
                    components={{
                        img: ({ src, alt }) => {
                            if (src.endsWith('.mp4')) {
                                return (
                                    <video
                                        controls
                                        className={styles.blogVideo}
                                        preload="metadata"
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                    >
                                        <source src={src} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                );
                            }
                            return (
                                <img
                                    src={src}
                                    alt={alt}
                                    className={styles.blogImage}
                                />
                            );
                        },
                        a: ({ href, children }) => {
                            const youtubeMatch = href.match(
                                /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
                            );

                            if (youtubeMatch) {
                                const videoId = youtubeMatch[1];
                                return (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        title="YouTube video player"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        frameBorder="0"
                                        style={{
                                            maxWidth: '100%',
                                            height: 'auto',
                                            display: 'block',
                                            margin: '16px auto',
                                        }}
                                    ></iframe>
                                );
                            }

                            return (
                                <a href={href} target="_blank" rel="noopener noreferrer">
                                    {children}
                                </a>
                            );
                        },
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                                <pre className={styles.codeBlock}>
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                </pre>
                            ) : (
                                <code className={styles.inlineCode} {...props}>
                                    {children}
                                </code>
                            );
                        }
                    }}
                >
                    {content}
                </ReactMarkdown>

                </div>
                <SpeedInsights/>
                <Analytics/>
            </main>

            <footer className={styles2.footer}>
                Roshan Taneja &copy; all rights reserved.
            </footer>
        </div>
    );
}