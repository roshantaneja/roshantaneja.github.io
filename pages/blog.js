import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';  // Adjust based on your folder structure
import ReactMarkdown from 'react-markdown';

// Define the blog directory
const blogDirectory = path.join(process.cwd(), 'public', 'blog');

// Helper function to get blog posts
export const getStaticProps = async () => {
    const files = fs.readdirSync(blogDirectory);

    const posts = files.map((filename) => {
        const filePath = path.join(blogDirectory, filename);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        return {
            slug: filename.replace('.md', ''),
            title: data.title,
            date: data.date,
            description: data.description,
            content,
        };
    });

    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
        props: {
            posts,
        },
    };
};

export default function Blog({ posts }) {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>My Blog</h1>

                <div className={styles.grid}>
                    {posts.map((post) => (
                        <div key={post.slug} className={styles.card}>
                            <Link href={`/blog/${post.slug}`} legacyBehavior>
                                <a>
                                    <div>
                                        <h2>{post.title} &rarr;</h2>
                                        <p>{post.description}</p>
                                        <p><small>{new Date(post.date).toLocaleDateString()}</small></p>
                                    </div>
                                </a>
                            </Link>
                        </div>
                    ))}
                </div>
            </main>

            <footer className={styles.footer}>
                Roshan Taneja &copy; all rights reserved.
            </footer>
        </div>
    );
}