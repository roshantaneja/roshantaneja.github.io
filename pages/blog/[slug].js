import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import styles from '../../styles/Home.module.css';  // Adjust based on your folder structure

const blogDirectory = path.join(process.cwd(), 'public', 'blog');

// Helper function to get all blog slugs
export const getStaticPaths = async () => {
    const files = fs.readdirSync(blogDirectory);

    const paths = files.map((filename) => ({
        params: {
            slug: filename.replace('.md', ''),
        },
    }));

    return {
        paths,
        fallback: false,
    };
};

// Helper function to get blog content by slug
export const getStaticProps = async ({ params }) => {
    const filePath = path.join(blogDirectory, `${params.slug}.md`);
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
                <ReactMarkdown>{content}</ReactMarkdown>
            </main>

            <footer className={styles.footer}>
                Roshan Taneja &copy; all rights reserved.
            </footer>
        </div>
    );
}