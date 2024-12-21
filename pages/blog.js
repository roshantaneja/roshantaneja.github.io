import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';  // Adjust based on your folder structure
import ReactMarkdown from 'react-markdown';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

// Define the blog directory
const blogDirectory = path.join(process.cwd(), 'public', 'blog');

// Helper function to get blog posts
export const getStaticProps = async () => {
    // Get all entries in the blog directory
    const entries = fs.readdirSync(blogDirectory, { withFileTypes: true });

    // Filter out directories and process only files
    const files = entries.filter((entry) => entry.isFile());

    const posts = files.map((file) => {
        const filePath = path.join(blogDirectory, file.name);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        return {
            slug: file.name.replace('.md', ''), // Remove .md extension for slug
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
                <a href="/" className={styles.backLink}> &larr; Back to Home</a>
                <h1 className={styles.title}>My Blog</h1>
                <p className={styles.description}>
                    Welcome to my blog! Here, I share my thoughts on literally everything. <br />
                    From tech to life to everything in between, you'll find it all here. <br />
                    Enjoy reading! 📚
                </p>

                <div className={styles.grid}>
                    {posts.map((post) => (
                        <div key={post.slug} className={styles.card}>
                            <Link href={`/blog/${post.slug}`} legacyBehavior>
                                <a>
                                    <div>
                                        <h2>{post.title} &rarr;</h2>
                                        <p>{post.description}</p>
                                        <p><small><strong>{Math.ceil(Math.abs(new Date() - new Date(post.date)) / (1000 * 60 * 60 * 24))} days ago</strong></small></p>
                                        {/* <p><small>{new Date(post.date).toLocaleDateString()}</small></p> */}
                                    </div>
                                </a>
                            </Link>
                        </div>
                    ))}
                </div>
                <SpeedInsights/>
                <Analytics/>
            </main>

            <footer className={styles.footer}>
                Roshan Taneja &copy; all rights reserved.
            </footer>
        </div>
    );
}