import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Script from "next/script"
import Link from 'next/link';
export default function Custom404() {
    return (
        <div className={styles.container}>
            <Head>
                <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-6302CZ25FK"/>
                <Script
                    id ='google-analytics'
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-6302CZ25FK');, {
                        page_path: window.location.pathname,
                        });`
                    }}
                />
                <title>Roshan Taneja</title>
                <meta name="description" content="can i puts my bawls in yo jaws" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Looks like you're a little lost.</h1>
                <a className={styles.description}>click <a href="/">here</a> to head back to the main page!</a>
            </main>
        </div>

    )
}