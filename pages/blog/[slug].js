import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight'; // Make sure this is imported
import styles from '../../styles/Home.module.css';  // Adjust path if needed

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
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>{title}</h1>
                <p><small>{new Date(date).toLocaleDateString()}</small></p>
                <p>Roshan Taneja</p>
                
                {/* Add wrapper for markdown content */}
                <div className={styles.contentWrapper}>
                    <ReactMarkdown
                        rehypePlugins={[rehypeHighlight]}  // Adds syntax highlighting
                        components={{
                            img: ({ src, alt }) => (
                                <img
                                    src={src}
                                    alt={alt}
                                    className={styles.blogImage}
                                />
                            ),

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
                                )
                            }
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </main>

            <footer className={styles.footer}>
                Roshan Taneja &copy; all rights reserved.
            </footer>
        </div>
    );
}