---
title: "How I made this Blogging Platform"
date: "10-19-2024"
description: "This is the first post in my updated blog."
---

# Welcome to My New Blog

Here I share thoughts about coding, life, and everything in between.

This is my first post to see if the blog works. I hope you enjoy it!

## How did I make this blog?

I used nextjs and a node package called gray-matter and react-markdown to parse the markdown files.

I also used fs and path to read the files from the public folder.

---

within your nextjs project, run the following commands:


```txt
npm install gray-matter react-markdown fs path
```


---

Then create a folder called blog in the public folder and add a markdown file with the following front matter:

heres the file structure:

```
/your-nextjs-project
    /public
    /blog
        post1.md
        post2.md
    /pages
    blog.js
    /blog
        [slug].js
    /styles
    Home.module.css
```

---

Then create a file called [slug].js in the /pages/blog folder with the following code:


```javascript
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
```

And here is the code for the blog.js file:

```jsx
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
                            <Link href={`/blog/${post.slug}`}>
                                <a>
                                    <h2>{post.title} &rarr;</h2>
                                    <p>{post.description}</p>
                                    <p><small>{new Date(post.date).toLocaleDateString()}</small></p>
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
```

to create your first blog post, create a markdown file in the /public/blog folder with the following front matter:

```txt
---
title: "My First Blog Post"
date: "2024-01-01"
description: "This is the first post in my blog."
---

# Welcome to My Blog

Here I share thoughts about coding, life, and everything in between.
```

see all of the code in action at [https://github.com/roshantaneja/roshantaneja.github.io](https://github.com/roshantaneja/roshantaneja.github.io)