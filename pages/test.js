import Head from 'next/head';
import styles from '../styles/Home.module.css';
import blogStyles from '../styles/blog.module.css';
import aboutStyles from '../styles/About.module.css';

export default function TestPage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Style Test Page</title>
        <meta name="description" content="A page to test all styles" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Style Test Page</h1>
        
        {/* Home.module.css Tests */}
        <section className={styles.section}>
          <h2>Home.module.css Tests</h2>
          
          <div className={styles.description}>
            <p>Testing description text style</p>
          </div>

          <div className={styles.grid}>
            <div className={styles.card}>
              <h2>Card Title</h2>
              <p>Card description text</p>
              <a href="#">Card Link</a>
            </div>
            <div className={styles.card}>
              <h2>Another Card</h2>
              <p>Hover me to see animation</p>
              <a href="#">Another Link</a>
            </div>
          </div>

          <div className={styles.listContainer}>
            <h3>List Styles</h3>
            <ul>
              <li>Unordered list item 1</li>
              <li>Unordered list item 2</li>
            </ul>
            <ol>
              <li>Ordered list item 1</li>
              <li>Ordered list item 2</li>
            </ol>
          </div>

          <div className={styles.resumeLink}>
            Resume Link
            <div className={styles.tooltip}>Tooltip Test</div>
          </div>
        </section>

        {/* Blog.module.css Tests */}
        <section className={styles.section}>
          <h2>Blog.module.css Tests</h2>
          
          <div className={blogStyles.contentWrapper}>
            <h3>Content Wrapper Test</h3>
            <p>Testing paragraph spacing and line height</p>
            
            <div className={blogStyles.codeBlock}>
              <pre>
                <code>
                  {`// Testing code block styles
function test() {
  return "Hello World";
}`}
                </code>
              </pre>
            </div>

            <p>Testing <code className={blogStyles.inlineCode}>inline code</code> style</p>

            <div className={blogStyles.youtubeEmbed}>
              <iframe 
                width="560" 
                height="315" 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>

            <img 
              className={blogStyles.blogImage}
              src="https://via.placeholder.com/800x400"
              alt="Test image"
            />
          </div>
        </section>

        {/* About.module.css Tests */}
        <section className={styles.section}>
          <h2>About.module.css Tests</h2>
          
          <div className={aboutStyles.container}>
            <div className={aboutStyles.main}>
              <h1 className={aboutStyles.title}>About Page Title</h1>
              
              <div className={aboutStyles.section}>
                <h2>Section Title</h2>
                <p>Testing section paragraph styles</p>
                
                <ul className={aboutStyles.statsList}>
                  <li><strong>Stat 1:</strong> Value 1</li>
                  <li><strong>Stat 2:</strong> Value 2</li>
                </ul>

                <ul className={aboutStyles.interestsList}>
                  <li>Interest 1</li>
                  <li>Interest 2</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Global Styles Tests */}
        <section className={styles.section}>
          <h2>Global Styles Tests</h2>
          
          <div className="divTable">
            <div className="divTableRow">
              <div className="divTableHead">Header 1</div>
              <div className="divTableHead">Header 2</div>
            </div>
            <div className="divTableRow">
              <div className="divTableCell">Cell 1</div>
              <div className="divTableCell">Cell 2</div>
            </div>
          </div>

          <div className="vertical-timeline-element-content">
            <h3>Timeline Item</h3>
            <p>Testing timeline element styles</p>
          </div>
          <div className="vertical-timeline-element-icon">
            <span>Icon</span>
          </div>

          <footer>
            <p>Testing footer styles</p>
            <a href="#">Footer Link</a>
          </footer>
        </section>
      </main>
    </div>
  );
} 