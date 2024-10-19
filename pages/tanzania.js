import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function Tanzania() {
    return (
        <div className={styles.container}>
        <Head>
            <title>Roshan Taneja</title>
            <meta name="description" content="funny description here" />
            <link rel="icon" href="/chevron_left_FILL0_wght400_GRAD0_opsz48.ico" />
        </Head>

        <main className={styles.main}>
            <h1 className={styles.title}>
            Bringing Water to the <a href="https://en.wikipedia.org/wiki/Maasai_people">Maasai</a> of Northern Tanzania
            </h1>

            <p className={styles.description}>
            
            </p>
        </main>

        
        <footer className={styles.footer}>
            Roshan Taneja &copy; all rights reserved.
        </footer>
        </div>
    )
}