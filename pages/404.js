import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from "@vercel/analytics/react"
export default function Custom404() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Roshan Taneja</title>
                <meta name="description" content="can i puts my bawls in yo jaws" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Looks like you're a little lost.</h1>
                <a className={styles.description} href="/"> click here to head back to the main page! &rarr;</a>
            </main>
            <SpeedInsights/>
            <Analytics/>
        </div>

    )
}